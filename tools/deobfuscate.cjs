// Static AST transforms only: downloaded JavaScript is never evaluated.
const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const prettier = require('prettier');
const root = path.resolve(__dirname, '..');

function method(node, name) {
  return t.isCallExpression(node) && t.isMemberExpression(node.callee) &&
    (node.callee.computed ? t.isStringLiteral(node.callee.property, { value: name }) : t.isIdentifier(node.callee.property, { name }));
}
function decode(code) {
  const ast = parser.parse(code, { sourceType: 'unambiguous', allowReturnOutsideFunction: true });
  traverse(ast, {
    StringLiteral(p) { delete p.node.extra; },
    NumericLiteral(p) { delete p.node.extra; },
    UnaryExpression: { exit(p) {
      if (p.node.operator !== '!') return;
      const arg = p.node.argument;
      if (t.isArrayExpression(arg) && arg.elements.length === 0) p.replaceWith(t.booleanLiteral(false));
      else if (t.isBooleanLiteral(arg)) p.replaceWith(t.booleanLiteral(!arg.value));
    } },
    MemberExpression: { exit(p) {
      if (p.node.computed && t.isStringLiteral(p.node.property) && t.isValidIdentifier(p.node.property.value)) {
        p.node.property = t.identifier(p.node.property.value);
        p.node.computed = false;
      }
    } },
    CallExpression: { exit(p) {
      const n = p.node;
      if (!method(n, 'join') || n.arguments.length !== 1 || !t.isStringLiteral(n.arguments[0], {value: ''})) return;
      const reverse = n.callee.object;
      if (!method(reverse, 'reverse') || reverse.arguments.length) return;
      const split = reverse.callee.object;
      if (!method(split, 'split') || split.arguments.length !== 1 || !t.isStringLiteral(split.arguments[0], {value: ''})) return;
      if (t.isStringLiteral(split.callee.object)) p.replaceWith(t.stringLiteral(split.callee.object.value.split('').reverse().join('')));
    } },
    BinaryExpression: { exit(p) {
      const {left, right, operator} = p.node;
      if (operator === '^' && t.isNumericLiteral(left) && t.isNumericLiteral(right)) p.replaceWith(t.numericLiteral(left.value ^ right.value));
    } },
  });
  return generate(ast, { comments: true, jsescOption: { minimal: true } }).code;
}

async function transformFile(source, destination) {
  let content = fs.readFileSync(source, 'utf8');
  const ext = path.extname(source);
  if (['.js', '.mjs'].includes(ext)) {
    content = await prettier.format(decode(content), { parser: 'babel' });
  } else if (['.html', '.svg'].includes(ext)) {
    // Keep SVG CDATA wrappers so JavaScript remains valid XML.
    const re = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi;
    let out = '', cursor = 0;
    for (const match of content.matchAll(re)) {
      out += content.slice(cursor, match.index) + match[1];
      let body = match[2];
      const cdata = body.includes('<![CDATA[');
      body = body.replace(/\/\/<!\[CDATA\[/g, '').replace(/\/\/\]\]>/g, '');
      if (body.trim() && !/type=["'](?:application\/ld\+json|importmap)/i.test(match[1])) {
        body = await prettier.format(decode(body), { parser: 'babel' });
      }
      out += '\n' + (cdata ? '//<![CDATA[\n' : '') + body + (cdata ? '//]]>\n' : '') + match[3];
      cursor = match.index + match[0].length;
    }
    content = out + content.slice(cursor);
    if (ext === '.html') {
      const html = await import('parse5');
      content = await prettier.format(html.serialize(html.parse(content)), { parser: 'html' });
    }
  } else return;
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.writeFileSync(destination, content);
  console.log(path.relative(root, destination));
}
async function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const source = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(source);
    else await transformFile(source, path.join(root, path.relative(path.join(root, 'original'), source)));
  }
}
module.exports = {decode};
if (require.main === module) walk(path.join(root, 'original')).catch(error => { console.error(error); process.exitCode = 1; });
