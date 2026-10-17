(() => {
  const root = window.shadowRoot || document;
  const labels = {
    searchInput: 'Search the web or enter a URL', addrInput: 'Search or enter a URL',
    gamesSearch: 'Find your next game', effectsSearch: 'Find a sound',
  };
  for (const [id, label] of Object.entries(labels)) {
    const input = root.getElementById(id);
    if (input) {
      input.placeholder = label;
      input.setAttribute('aria-label', label);
    }
  }
  const actionLabels = {
    handleHome: 'Return home', goBack: 'Go back', goForward: 'Go forward',
    reload: 'Reload page', toggleFullscreen: 'Toggle fullscreen',
    closeGames: 'Close library', closeEffects: 'Close effects', closeAI: 'Close AI',
    toggleGameFullscreen: 'Toggle game fullscreen', handleGamePlayerClose: 'Close game',
    toggleControllerMapper: 'Controller settings',
  };
  root.querySelectorAll('button[onclick]').forEach(button => {
    const action = button.getAttribute('onclick').split('(')[0];
    if (actionLabels[action] && !button.textContent.trim()) {
      button.setAttribute('aria-label', actionLabels[action]);
      button.title = actionLabels[action];
    }
  });
  const grid = root.getElementById('shortcuts');
  function prepareShortcuts() {
    grid?.querySelectorAll('.shortcut').forEach(item => {
      if (item.dataset.keyboardReady) return;
      item.dataset.keyboardReady = 'true';
      item.tabIndex = 0;
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', item.querySelector('span')?.textContent || 'Open shortcut');
      item.addEventListener('keydown', event => {
        if (event.target !== item || !['Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        item.click();
      });
    });
  }
  prepareShortcuts();
  if (grid) new MutationObserver(prepareShortcuts).observe(grid, {childList: true});
  const screens = [['gamesScreen', 'navGames'], ['effectsScreen', 'navEffects'],
    ['aiScreen', 'navAI'], ['settingsScreen', 'navSettings']];
  function syncNavigation() {
    for (const [screenId, navId] of screens) {
      const active = root.getElementById(screenId)?.classList.contains('open') || false;
      const button = root.getElementById(navId);
      button?.classList.toggle('active', active);
      button?.setAttribute('aria-pressed', String(active));
    }
  }
  const observer = new MutationObserver(syncNavigation);
  for (const [id] of screens) {
    const screen = root.getElementById(id);
    if (screen) observer.observe(screen, {attributes: true, attributeFilter: ['class']});
  }
  syncNavigation();
})();
