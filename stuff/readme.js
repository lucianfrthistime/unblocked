(() => {
  const markdownUrl = new URL('README.md', document.currentScript.src);
  const root = window.shadowRoot || document.body;
  if (root.querySelector('#startupReadme')) return;
  const style = document.createElement('style');
  style.textContent = `
    #startupReadme { margin: auto; width: min(640px, calc(100vw - 32px));
      max-height: calc(100dvh - 32px); padding: 0; border: 1px solid #ffffff20;
      border-radius: 22px; background: var(--ui-surface, #191e1c); color: var(--ui-text, #edf0e9);
      box-shadow: 0 24px 100px #0009; font: 15px/1.65 Inter, sans-serif; }
    #startupReadme::backdrop { background: #080d09b3; backdrop-filter: blur(14px); }
    #startupReadme header, #startupReadme footer { display: flex; align-items: center;
      justify-content: space-between; padding: 20px 28px; gap: 16px; }
    #startupReadme header { border-bottom: 1px solid #ffffff15; }
    #startupReadme h2 { font-size: 13px; font-weight: 500; margin: 0; color: var(--accent, #9cdbbd); }
    #startupReadme .readme-content { padding: 30px 28px; overflow: auto;
      max-height: calc(100dvh - 220px); overflow-wrap: anywhere; }
    #startupReadme .readme-content > * + * { margin-top: 14px; }
    #startupReadme .readme-content h1 { font-size: 34px; font-weight: 500; letter-spacing: -.05em; line-height: 1.25; }
    #startupReadme .readme-content h2 { margin-top: 24px; }
    #startupReadme ul, #startupReadme ol { padding-left: 24px; }
    #startupReadme a { color: var(--accent, #9cdbbd); }
    #startupReadme pre { white-space: pre-wrap; background: #101413; padding: 12px; border-radius: 10px; }
    #startupReadme code { font-family: monospace; }
    #startupReadme img { max-width: 100%; }
    #startupReadme blockquote { border-left: 3px solid var(--accent, #9cdbbd); padding-left: 14px; }
    #startupReadme footer { border-top: 1px solid #ffffff15; justify-content: flex-end; }
    #startupReadme button { cursor: pointer; font: inherit; border-radius: 9px;
      padding: 10px 22px; border: 1px solid #ffffff15; background: var(--accent, #9cdbbd); color: #14261c; font-weight: 500; }
    #startupReadme .readme-close { background: transparent; color: #929d96; padding: 4px 12px; font-size: 22px; }
    #startupReadme button:focus-visible, #startupReadme a:focus-visible {
      outline: 2px solid var(--accent, #9cdbbd); outline-offset: 3px; }
  `;
  root.appendChild(style);
  const dialog = document.createElement('dialog');
  dialog.id = 'startupReadme';
  dialog.setAttribute('aria-labelledby', 'startupReadmeTitle');
  dialog.innerHTML = `<header><h2 id="startupReadmeTitle">A note for you</h2>
    <button class="readme-close" type="button" aria-label="Close readme">&times;</button></header>
    <article class="readme-content" aria-live="polite">Loading readme…</article>
    <footer><button class="readme-continue" type="button" autofocus>Continue</button></footer>`;
  root.appendChild(dialog);
  const content = dialog.querySelector('article');
  dialog.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('keydown', event => event.stopPropagation());
  dialog.addEventListener('close', () => {
    document.getElementById('searchInput')?.focus();
    dialog.remove();
    style.remove();
  });
  dialog.showModal();
  (async () => {
    try {
      const response = await fetch(markdownUrl, {cache: 'no-store', signal: AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markdown = await response.text();
      if (window.marked && window.DOMPurify) {
        content.innerHTML = DOMPurify.sanitize(await marked.parse(markdown));
        content.querySelectorAll('a[href]').forEach(link => {
          link.href = new URL(link.getAttribute('href'), markdownUrl).href;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
        });
      } else {
        content.style.whiteSpace = 'pre-wrap';
        content.textContent = markdown;
      }
    } catch {
      content.textContent = 'The readme could not be loaded. You can still continue to the site.';
    }
  })();
})();
