const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const root = path.resolve(__dirname, '..');

(async () => {
  const modules = ['jet', 'sj'].map(dir => ({
    name: `${dir}/jet`, bytes: fs.readFileSync(path.join(root, 'stuff', dir, 'jet.wasm')),
  }));
  for (const dir of ['curl', 'pox']) {
    const ast = parser.parse(fs.readFileSync(path.join(root, 'stuff', dir, 'index.mjs'), 'utf8'), {sourceType: 'module'});
    let count = 0;
    traverse(ast, {StringLiteral(p) {
      const value = p.node.value.replace(/^data:[^,]*;base64,/, '');
      if (!value.startsWith('AGFzbQ')) return;
      const bytes = Buffer.from(value, 'base64');
      if (bytes.subarray(0, 4).equals(Buffer.from([0, 97, 115, 109]))) {
        modules.push({name: `${dir}/embedded-${++count}`, bytes});
      }
    }});
  }
  for (const {name, bytes} of modules) {
    const wabt = await require('wabt')();
    const destination = path.join(root, 'wasm-source', name);
    fs.mkdirSync(path.dirname(destination), {recursive: true});
    fs.writeFileSync(destination + '.wasm', bytes);
    const mod = wabt.readWasm(bytes, {readDebugNames: true});
    mod.validate();
    mod.generateNames();
    mod.applyNames();
    const text = mod.toText({foldExprs: false, inlineExport: false});
    fs.writeFileSync(destination + '.wat', text);
    if (!WebAssembly.validate(bytes)) throw new Error(`Invalid WebAssembly: ${name}`);
    mod.destroy();
    console.log(`Validated binary and disassembled ${name} (${bytes.length} bytes)`);
  }
})().catch(error => {console.error(error); process.exitCode = 1;});
