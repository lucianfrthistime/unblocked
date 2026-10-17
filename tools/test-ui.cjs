const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {JSDOM} = require('jsdom');
const rootDir = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(rootDir, file), 'utf8');
const html = read('stuff/main.html');
const tick = () => new Promise(resolve => setTimeout(resolve, 0));

async function run() {
  const dom = new JSDOM('<body><div id="app"></div></body>', {
    url: 'http://127.0.0.1:8000/', runScripts: 'outside-only', pretendToBeVisual: true,
  });
  const {window: w} = dom;
  const doc = w.document;
  const shadow = doc.getElementById('app').attachShadow({mode: 'open'});
  const parsed = new w.DOMParser().parseFromString(html, 'text/html');
  shadow.innerHTML = parsed.body.innerHTML;
  w.shadowRoot = shadow;
  const nativeGet = doc.getElementById.bind(doc);
  doc.getElementById = id => shadow.getElementById(id) || nativeGet(id);
  const ids = [...shadow.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(ids.length, new Set(ids).size, 'No duplicate UI IDs');
  const original = new w.DOMParser().parseFromString(read('original/stuff/main.html'), 'text/html');
  for (const el of original.querySelectorAll('[id]')) {
    if (['acLeft', 'acRight'].includes(el.id)) continue;
    assert(shadow.getElementById(el.id), `Preserve existing functional element: ${el.id}`);
  }
  const theme = parsed.getElementById('interface-system');
  assert(theme && theme.textContent.includes('prefers-reduced-motion'));
  // Parse all theme rules, including responsive rules, using the DOM stylesheet parser.
  const style = doc.createElement('style');
  style.textContent = theme.textContent;
  doc.head.append(style);
  assert(style.sheet.cssRules.length > 100, 'Theme parsed successfully');

  const grid = shadow.getElementById('shortcuts');
  grid.innerHTML = '<div class="shortcut"><span>YouTube</span></div>';
  let opened = 0;
  grid.firstElementChild.onclick = () => opened++;
  w.eval(read('stuff/ui.js'));
  grid.firstElementChild.dispatchEvent(new w.KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
  assert.equal(opened, 1, 'Enter activates a shortcut');
  assert.equal(grid.firstElementChild.tabIndex, 0);
  grid.insertAdjacentHTML('beforeend', '<div class="shortcut"><span>Saved bookmark</span></div>');
  await tick();
  assert.equal(grid.lastElementChild.getAttribute('aria-label'), 'Saved bookmark');
  shadow.getElementById('aiScreen').classList.add('open');
  await tick();
  assert.equal(shadow.getElementById('navAI').getAttribute('aria-pressed'), 'true');
  shadow.getElementById('aiScreen').classList.remove('open');
  await tick();
  assert.equal(shadow.getElementById('navAI').getAttribute('aria-pressed'), 'false');
  assert.equal(shadow.getElementById('searchInput').placeholder, 'Search the web or enter a URL');

  // jsdom has no native dialog implementation; simulate its open/close API.
  w.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  w.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new w.Event('close')); };
  Object.defineProperty(doc, 'currentScript', {configurable: true, value: {src: 'http://127.0.0.1:8000/stuff/readme.js'}});
  const markdown = read('stuff/README.md');
  w.fetch = async (url, options) => {
    assert.equal(String(url), 'http://127.0.0.1:8000/stuff/README.md');
    assert.equal(options.cache, 'no-store');
    return {ok: true, text: async () => markdown};
  };
  w.eval(read('stuff/readme.js'));
  await tick();
  assert(shadow.getElementById('startupReadme').open);
  assert.equal(shadow.querySelector('.readme-content').textContent, markdown, 'Preserve user welcome text in fallback');
  shadow.querySelector('.readme-continue').click();
  assert.equal(shadow.getElementById('startupReadme'), null, 'Continue dismisses the dialog');
  assert.equal(shadow.activeElement.id, 'searchInput', 'Return focus to search');
  w.fetch = async () => ({ok: false, status: 404});
  w.eval(read('stuff/readme.js'));
  await tick();
  assert(shadow.querySelector('.readme-content').textContent.includes('could not be loaded'));
  shadow.querySelector('.readme-close').click();
  assert.equal(shadow.getElementById('startupReadme'), null, 'Failed requests remain dismissible');
  dom.window.close();
  console.log('UI checks passed: theme syntax, preserved controls, keyboard shortcuts, dynamic bookmarks, navigation state, README content, dismissal, focus, and fetch failure.');
}
run().catch(error => { console.error(error); process.exitCode = 1; });
