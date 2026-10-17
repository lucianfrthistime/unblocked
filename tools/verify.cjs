const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const {decode} = require('./deobfuscate.cjs');
const root = path.resolve(__dirname, '..');
function canonical(code, customizeOriginal = false) {
  // Normalize the deliberate display-name migration when comparing recovered code.
  const branded = decode(code).replace(/\bopium(?:\.best)?\b/gi, 'lucianland')
    .replaceAll('APStudy | Math and Language Arts Tutoring', 'lucianland')
    .replaceAll('APStudy helps', 'lucianland helps');
  const cdnBase = 'https://cdn.jsdelivr.net/gh/lucianfrthistime/unblocked@main/stuff/';
  const configured = branded.replace(/https:\/\/[^"'\s]*(?:%54ongSherbet|TongSherbet)\/storage[^"'\s]*/g, cdnBase);
  const ast = parser.parse(configured, {sourceType: 'unambiguous', allowReturnOutsideFunction: true});
  traverse(ast, {VariableDeclarator(p) {
    if (p.node.id.name !== '_0x5bgb' || !t.isArrayExpression(p.node.init)) return;
    assert(p.node.init.elements.every(n => t.isStringLiteral(n) && n.value === cdnBase), 'Expected configured asset mirrors');
    p.node.init.elements = [t.stringLiteral(cdnBase)];
  }});
  if (customizeOriginal) {
    const body = ast.program.body;
    const adCheck = body.findIndex(n => t.isFunctionDeclaration(n) && n.id.name === 'isAdBlock');
    const aiStart = body.findIndex(n => t.isVariableDeclaration(n) && n.declarations.some(d => d.id.name === 'AI_WS_PATH'));
    assert(adCheck > 0 && aiStart > adCheck, 'Expected original advertising block');
    assert(t.isExpressionStatement(body[adCheck - 1]), 'Expected advertising loader');
    body.splice(adCheck - 1, aiStart - adCheck + 1);
    const taglineStart = body.findIndex(n => t.isVariableDeclaration(n) && n.declarations.some(d => d.id.name === 'taglineEl'));
    const taglineEnd = body.findIndex(n => t.isVariableDeclaration(n) && n.declarations.some(d => d.id.name === '_oDBPromise'));
    assert(taglineStart >= 0 && taglineEnd > taglineStart, 'Expected original tagline');
    body.splice(taglineStart, taglineEnd - taglineStart, ...parser.parse(
      'document.getElementById("tagline").textContent = "Browse, play, and explore. All from one place.";'
    ).program.body);
    traverse(ast, {VariableDeclarator(p) {
      if (p.node.id.name !== 'SHORTCUTS') return;
      const items = p.node.init.elements;
      const index = items.findIndex(n => n.properties.some(prop =>
        (prop.key.name === 'label' || prop.key.value === 'label') && prop.value.value === 'Discord'));
      assert(index >= 0, 'Expected original Discord shortcut');
      items.splice(index, 1);
    }});
  }
  traverse(ast, {EmptyStatement(p) { if (p.inList) p.remove(); }, ObjectProperty(p) {
    if (!p.node.computed && t.isStringLiteral(p.node.key) && t.isValidIdentifier(p.node.key.value, false)) p.node.key = t.identifier(p.node.key.value);
  }});
  return JSON.stringify(ast, (key, value) =>
    ['start','end','loc','extra','leadingComments','trailingComments','innerComments','comments','tokens'].includes(key) ? undefined :
    value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.entries(value).sort(([a],[b]) => a.localeCompare(b))) : value);
}
function scripts(text) {
  return [...text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m => m[1].replace(/\/\/<!\[CDATA\[/g, '').replace(/\/\/\]\]>/g, ''));
}
let count = 0;
function compare(a, b, label) {
  if (a === b) return;
  let i = 0;
  while (a[i] === b[i] && i < a.length) i++;
  throw new Error(`${label}: AST difference at ${i}\n${a.slice(i-80,i+150)}\n${b.slice(i-80,i+150)}`);
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const source = path.join(dir, entry.name);
    if (entry.isDirectory()) {walk(source); continue;}
    const relative = path.relative(path.join(root, 'original'), source);
    const target = path.join(root, relative);
    if (/\.(js|mjs)$/.test(source)) {
      let edited = fs.readFileSync(target, 'utf8');
      // Documented local startup fixes are intentionally different from recovery.
      if (relative.replaceAll('\\', '/') === 'stuff/main.js') {
        assert.equal(edited.split('      img.referrerPolicy = "no-referrer";').length, 2);
        assert.equal(edited.split('// Load the editable startup README after the application has initialized.').length, 2);
        parser.parse(edited, {sourceType: 'script'});
        edited = edited.replace('      img.referrerPolicy = "no-referrer";', '')
          .split('// Load the editable startup README after the application has initialized.')[0];
      }
      compare(canonical(edited), canonical(fs.readFileSync(source,'utf8'), relative.replaceAll('\\', '/') === 'stuff/main.js'), relative);
      count++;
    } else if (/\.(html|svg)$/.test(source)) {
      const before = scripts(fs.readFileSync(source,'utf8'));
      const after = scripts(fs.readFileSync(target,'utf8'));
      assert.equal(after.length, before.length, relative);
      before.forEach((code, i) => {compare(canonical(after[i]), canonical(code), `${relative} script ${i}`); count++;});
    } else {
      assert.deepEqual(fs.readFileSync(target), fs.readFileSync(source), relative);
    }
  }
}
walk(path.join(root,'original'));
console.log(`Verified ${count} JavaScript files/inline scripts against statically decoded originals with documented startup fixes allowed; binary/data files unchanged.`);

