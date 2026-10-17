window.dataLayer = window.dataLayer || [];
window.gtag = function () {
  dataLayer.push(arguments);
};
gtag("js", new Date());
gtag("config", "G-1CC1LKMRS6");
(function () {
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=G-1CC1LKMRS6";
  document.head.appendChild(s);
})();
const sjEncode = (url) =>
  new URL("./~/", location.href).pathname + controller.config.codec.encode(url);
const SHORTCUTS = [
  {
    label: "YouTube",
    url: "https://youtube.com/",
  },
  {
    label: "TikTok",
    url: "https://www.tiktok.com/foryou",
  },
  {
    label: "Geforce Now",
    url: "https://play.geforcenow.com/mall/",
  },
  {
    label: "Roblox",
    faviconHost: "https://www.roblox.com/",
    url: "https://nowgg.fun/apps/a/19900/b.html",
  },
  {
    label: "Geometry Dash",
    url: "https://web-dashers.github.io/",
    faviconUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdw5uFI0cIdPEEfg8nXpx-UeHx2SRH5tG-e3OhSB0dfQ&s",
  },
  {
    label: "Kick",
    url: "https://kick.com/",
  },
  {
    label: "Twitch",
    url: "https://twitch.tv",
  },
  {
    label: "Snapchat",
    url: "https://www.snapchat.com/web",
  },
  {
    label: "Instagram",
    url: "https://instagram.com",
  },
];
if (!location.hostname.includes(".best")) {
  SHORTCUTS.push({
    label: "Movies",
    url: "https://aether.ist/",
    faviconUrl: "https://cdn-icons-png.flaticon.com/512/10351/10351880.png",
  });
}
const ra = [
  {
    name: "Google",
    url: "https://www.google.com/search?q=",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
  },
  {
    name: "Brave",
    url: "https://search.brave.com/search?q=",
  },
  {
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
  },
  {
    name: "Startpage",
    url: "https://www.startpage.com/sp/search?q=",
  },
  {
    name: "Ecosia",
    url: "https://www.ecosia.org/search?q=",
  },
  {
    name: "Ask",
    url: "https://www.ask.com/web?q=",
  },
];
const isMobileDevice = true;
const DEFAULT_TRANSPORT = isMobileDevice
  ? {
      name: "libcurl",
      src: "curl/index.mjs",
    }
  : {
      name: "epoxy",
      src: "pox/index.mjs",
    };
const SETTINGS = {
  Appearance: {
    Stars: {
      type: "toggle",
      default: true,
      callback: (val) => {
        starsEnabled = val;
      },
    },
    "Shooting Stars": {
      type: "toggle",
      default: true,
      callback: (val) => {
        shootingStarsEnabled = val;
      },
    },
    "Prevent Close": {
      type: "toggle",
      default: true,
      callback: (val) => {
        preventCloseEnabled = val;
      },
    },
    "Title Changer": {
      type: "toggle",
      default: true,
      callback: (val, init) => {
        titleChangerEnabled = val;
        if (init) return;
        if (!val) {
          try {
            clearTimeout(focusTimeout);
          } catch {}
          focusTimeout = null;
          document.title = "lucianland";
        } else if (document.hidden) {
          document.title = "New Tab";
        }
      },
    },
  },
  Privacy: {
    "About:Blank Cloak": {
      type: "toggle",
      default: false,
      callback: (val, init) => {
        if (init) return;
        if (val) triggerCloak();
      },
    },
    "Clientsided Ad Block": {
      type: "toggle",
      default: true,
      callback: (val) => {},
    },
  },
  Prxy: {
    Transport: {
      type: "dropdown",
      default: DEFAULT_TRANSPORT,
      options: [
        {
          name: "libcurl",
          src: "curl/index.mjs",
        },
        {
          name: "epoxy",
          src: "pox/index.mjs",
        },
      ],
      callback: async (val) => {
        try {
          if (localStorage.TRNSPRT === val.src) return;
          localStorage.TRNSPRT = val.src;
          const { default: TransportClient } = await import(val.src);
          transport = new TransportClient({
            wisp: window.wlspServer,
          });
          await initTransport(transport);
          controller.setTransport(transport);
        } catch {}
      },
    },
    "Search Engine": {
      type: "dropdown",
      default: {
        name: "Brave",
        url: "https://search.brave.com/search?q=",
      },
      options: ra,
      callback: (val) => {},
    },
  },
  Advanced: {
    "Force Update/Clear Data": {
      type: "button",
      label: "Clear",
      action: async () => {
        if (
          !confirm(
            "This will clear all data and force update the client. Are you sure?",
          )
        )
          return;
        try {
          const names = await caches.keys();
          await Promise.all(names.map((n) => caches["delete"](n)));
        } catch (e) {}
        try {
          localStorage.clear();
        } catch (e) {}
        try {
          sessionStorage.clear();
        } catch (e) {}
        try {
          document.cookie.split(";").forEach((c) => {
            const name = c.split("=")[0].trim();
            const domain = location.hostname;
            const pathParts = location.pathname.split("/");
            for (let i = pathParts.length; i >= 0; i--) {
              const path = pathParts.slice(0, i).join("/") || "/";
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path};domain=${domain}`;
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
            }
          });
        } catch (e) {}
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));
        } catch (e) {}
        try {
          const forceDelDb = (name) =>
            new Promise((res) => {
              const open = indexedDB.open(name);
              open.onsuccess = () => {
                open.result.close();
                deleteTs();
              };
              open.onerror = deleteTs;
              const deleteTs = () => {
                const req = indexedDB.deleteDatabase(name);
                req.onsuccess = req.onerror = req.onblocked = res;
              };
            });
          await forceDelDb("__jet_controller");
          if (indexedDB.databases) {
            const dbs = await indexedDB.databases();
            await Promise.all(dbs.map((db) => forceDelDb(db.name)));
          }
        } catch (e) {}
        allowUnload = true;
        alert(
          "done! after the page reloads, please wait for the client to update and load",
        );
        location.reload(1);
      },
    },
  },
};
const EXTENSIONS = [
  {
    name: "Youtube Ad Blocker",
    domain: ["youtube.com", "*.youtube.com"],
    code: "(function() { 'use strict'; var cssArrObject = ['#masthead-ad', 'ytd-rich-item-renderer.style-scope.ytd-rich-grid-row #content:has(.ytd-display-ad-renderer)', '.video-ads.ytp-ad-module', 'tp-yt-paper-dialog:has(yt-mealbar-promo-renderer)', 'ytd-engagement-panel-section-list-renderer[target-id=\"engagement-panel-ads\"]', '#related #player-ads', '#related ytd-ad-slot-renderer', 'ytd-ad-slot-renderer', 'yt-mealbar-promo-renderer', 'ytd-popup-container:has(a[href=\"/premium\"])', 'ad-slot-renderer', 'ytm-companion-ad-renderer', '#related #-ad-']; function removeNonVideoAds(arry) { arry.forEach((selector, index) => { arry[index] = `${selector}{display:none!important}`; }); const premiumContainers = [...document.querySelectorAll('ytd-popup-container')]; const matchingContainers = premiumContainers.filter(container => container.querySelector('a[href=\"/premium\"]')); if (matchingContainers.length > 0) { matchingContainers.forEach(container => container.remove()); } const backdrops = document.querySelectorAll('tp-yt-iron-overlay-backdrop'); const targetBackdrop = Array.from(backdrops).find((backdrop) => backdrop.style.zIndex === '2201'); if (targetBackdrop) { targetBackdrop.className = ''; targetBackdrop.removeAttribute('opened'); } let style = document.createElement('style'); (document.head || document.body).appendChild(style); style.appendChild(document.createTextNode(arry.join(' '))); } function skipAd(video) { const adIndicator = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-modern, .video-ads.ytp-ad-module .ytp-ad-player-overlay, .ytp-ad-button-icon'); if (adIndicator && !window.location.href.includes('https://m.youtube.com/')) { video.muted = true; video.currentTime = video.duration - 0.1; } } function removeAdblockWarning() { var warningInterval = setInterval(function() { var popupExists = document.getElementsByClassName('style-scope ytd-popup-container').length > 0; var dismissButton = document.getElementById('dismiss-button'); var divider = document.getElementById('divider'); if (popupExists && dismissButton && divider) { setTimeout(function() { dismissButton.click(); const playButton = document.getElementsByClassName('ytp-play-button ytp-button')[0]; if (playButton) playButton.click(); clearInterval(warningInterval); }, Math.random() * 3000); } }, Math.random() * 500); } setInterval(() => { if (document.readyState !== 'loading') { removeNonVideoAds(cssArrObject); removeAdblockWarning(); var adsVideo = document.querySelector('.ad-showing video'); var mainVideo = document.querySelector('video'); if (mainVideo) { var playerStatus = { currentTime: mainVideo.currentTime, isPaused: mainVideo.paused, speed: mainVideo.playbackRate }; if (playerStatus.currentTime <= 5 && playerStatus.isPaused == true) { mainVideo.play().catch(error => { console.error('Failed to play video:', error); }); } } if (adsVideo) { skipAd(adsVideo); } } }, 500); })();",
  },
  {
    name: "GeForce NOW Ad Blocker",
    domain: ["geforcenow.com", "*.geforcenow.com"],
    code: `(function() {
 Object.defineProperty(document, 'hidden', { get: () => false });
 
    function checkForVideo() {
        const video = document.getElementById('preStreamVideo');
        if (video) {
            video.style.width = '0.1px';
            video.style.height = '0.1px';
            video.muted = true;
            const observer = new MutationObserver(() => {
                if (!document.contains(video)) {
                    observer.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }
 
    const interval = setInterval(() => {
        if (document.getElementById('preStreamVideo')) {
            clearInterval(interval);
            checkForVideo();
        }
    }, 1000);
})();`,
  },
  {
    name: "nowgg.fun fat fat",
    domain: "*.ip.nowgg.fun",
    code: `window.alert=()=>{}`,
    prompt: false,
  },
];
const _extApproved = new Set();
const _extDismissed = new Set();
function _domainMatches(pattern, hostname) {
  if (pattern === "*") return true;
  if (pattern.startsWith("*.")) {
    const _0x303a = pattern.slice(1);
    return hostname === _0x303a.slice(1) || hostname.endsWith(_0x303a);
  }
  return hostname === pattern;
}
function _extMatchesDomain(ext, hostname) {
  const _0xa44a = Array.isArray(ext.domain) ? ext.domain : [ext.domain];
  return _0xa44a.some((p) => _domainMatches(p, hostname));
}
function _runExtension(ext) {
  try {
    frame.element.contentWindow.eval(ext?.code?.toString());
  } catch {}
}
function _showExtPrompt(ext, idx) {
  const _0xa73e0a = "_ep" + idx;
  if (document.getElementById(_0xa73e0a)) return;
  const _0xfe_0x7f3 = document.createElement("div");
  _0xfe_0x7f3.id = _0xa73e0a;
  _0xfe_0x7f3.className = "ext-prompt";
  const _0x_0x317 = document.createElement("div");
  _0x_0x317.className = "ext-prompt-eyebrow";
  _0x_0x317.textContent = "Extension available";
  const _0x68d17e = document.createElement("div");
  _0x68d17e.className = "ext-prompt-name";
  _0x68d17e.textContent = ext.name;
  const _0x3b_0x8da = document.createElement("div");
  _0x3b_0x8da.className = "ext-prompt-question";
  _0x3b_0x8da.textContent = "Run it on this site?";
  const _0x6be = document.createElement("div");
  _0x6be.className = "ext-prompt-btns";
  const _0xe3f = document.createElement("button");
  _0xe3f.className = "ext-prompt-btn yes";
  _0xe3f.textContent = "Yes";
  const _0xc90c = document.createElement("button");
  _0xc90c.className = "ext-prompt-btn no";
  _0xc90c.textContent = "No";
  const _0x4930d = () => {
    _0xfe_0x7f3.classList.remove("open");
    _0xfe_0x7f3.addEventListener("transitionend", () => _0xfe_0x7f3.remove(), {
      once: true,
    });
    setTimeout(() => _0xfe_0x7f3.remove(), 350);
  };
  _0xe3f.onclick = () => {
    _0x4930d();
    _extApproved.add(idx);
    _runExtension(ext);
  };
  _0xc90c.onclick = () => {
    _0x4930d();
    _extDismissed.add(idx);
  };
  _0x6be.appendChild(_0xe3f);
  _0x6be.appendChild(_0xc90c);
  _0xfe_0x7f3.appendChild(_0x_0x317);
  _0xfe_0x7f3.appendChild(_0x68d17e);
  _0xfe_0x7f3.appendChild(_0x3b_0x8da);
  _0xfe_0x7f3.appendChild(_0x6be);
  (shadowRoot || document.body).appendChild(_0xfe_0x7f3);
  requestAnimationFrame(() => _0xfe_0x7f3.classList.add("open"));
}
function _checkExtensions(href, _0xb9a1e) {
  try {
    _0xb9a1e = new URL(href).hostname;
  } catch (e) {
    return;
  }
  if (!_0xb9a1e) return;
  EXTENSIONS.forEach((ext, i) => {
    if (ext.enabled === false) return;
    if (!_extMatchesDomain(ext, _0xb9a1e)) return;
    if (_extApproved.has(i)) {
      _runExtension(ext);
    } else if (ext.prompt === false) {
      _runExtension(ext);
    } else if (!_extDismissed.has(i)) {
      _showExtPrompt(ext, i);
    }
  });
}
let frame = null;
let starsEnabled = true;
let shootingStarsEnabled = true;
let preventCloseEnabled = true;
let titleChangerEnabled = true;
var allowUnload = false;
window.addEventListener("keydown", (e) => {
  return;
  if (e.ctrlKey && e.key.toLowerCase() === "r") {
    allowUnload = true;
    setTimeout(() => {
      allowUnload = false;
    }, 1000);
  }
});
window.parent.addEventListener("beforeunload", (e) => {
  if (allowUnload || !preventCloseEnabled) return;
  e.preventDefault();
  e.returnValue = "";
});
const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem("SETTINGS") || "{}");
  } catch (e) {
    return {};
  }
})();
function saveSettings() {
  const _0x72c = {};
  Object.entries(SETTINGS).forEach(([cat, s]) => {
    _0x72c[cat] = {};
    Object.entries(s).forEach(([k, v]) => {
      _0x72c[cat][k] = v._value !== undefined ? v._value : v["default"];
    });
  });
  localStorage.setItem("SETTINGS", JSON.stringify(_0x72c));
}
Object.entries(SETTINGS).forEach(([cat, settings]) => {
  Object.entries(settings).forEach(([key, s]) => {
    s._value = saved[cat]?.[key] !== undefined ? saved[cat][key] : s["default"];
    if (s.callback) s.callback(s._value, true);
  });
});
function cloakAboutBlank() {
  if (window.self !== window.top) return true;
  const _0xad17c = window.open("about:blank", "_blank");
  if (!_0xad17c) return false;
  allowUnload = true;
  _0xad17c.document.open();
  _0xad17c.document.write(cloakWrapperHtml(window.location.href));
  _0xad17c.document.close();
  location.replace("https://clever.com/");
  setTimeout(() => {
    allowUnload = false;
  }, 1000);
  return true;
}
let cloakPending = false;
function triggerCloak() {
  if (cloakAboutBlank()) return;
  if (cloakPending) return;
  cloakPending = true;
  const _0xf_0xg23 = () => {
    if (!cloakAboutBlank()) return;
    document.removeEventListener("click", _0xf_0xg23, true);
    document.removeEventListener("keydown", _0xf_0xg23, true);
    document.removeEventListener("pointerdown", _0xf_0xg23, true);
    cloakPending = false;
  };
  document.addEventListener("click", _0xf_0xg23, true);
  document.addEventListener("keydown", _0xf_0xg23, true);
  document.addEventListener("pointerdown", _0xf_0xg23, true);
}
function cloakWrapperHtml(originalUrl) {
  const _0x73bf6b = !!SETTINGS.Appearance["Title Changer"]._value;
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Tab</title>
<style>html,body{margin:0;padding:0;height:100vh;overflow:hidden}iframe{border:0}</style>
</head>
<body>
<iframe id="cloakFrame" width="100%" height="100%" src="${window.location.href}"></iframe>
<script>
(function () {
    var originalUrl = ${JSON.stringify(originalUrl)};
    var titleChangerOnNow = ${_0x73bf6b};
    function applyTitle() {
        document.title = (!titleChangerOnNow || document.hidden) ? 'New Tab' : 'lucianland';
    }
    document.addEventListener('visibilitychange', applyTitle);
    applyTitle();
    window.addEventListener('storage', function (e) {
        if (e.key !== 'SETTINGS') return;
        var s; try { s = JSON.parse(localStorage.getItem('SETTINGS') || '{}'); } catch (err) { s = {}; }
        titleChangerOnNow = !!(s.Appearance && s.Appearance['Title Changer']);
        applyTitle();
        if (!(s.Privacy && s.Privacy['About:Blank Cloak'])) {
            try { document.getElementById('cloakFrame').contentWindow.allowUnload = true; } catch (e) {}
            window.location.href = originalUrl;
        }
    });
})();
</script>
</body>
</html>`;
}
if (
  window.self === window.top &&
  SETTINGS.Privacy["About:Blank Cloak"]._value
) {
  triggerCloak();
}
document.getElementById("tagline").textContent = "Browse, play, and explore. All from one place.";
let _oDBPromise = null;
let _oMigratePromise = null;
const grid = document.getElementById("shortcuts");
let _bookmarks = [];
function _renderShortcuts() {
  grid.innerHTML = "";
  SHORTCUTS.forEach(
    ({
      label: label,
      url: url,
      faviconHost: faviconHost,
      faviconUrl: faviconUrl,
    }) => {
      const el = document.createElement("div");
      el.className = "shortcut";
      const img = document.createElement("img");
      img.className = "shortcut-icon";
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.src =
        faviconUrl ||
        sjEncode(
          "https://www.google.com/s2/favicons?domain=" +
            new URL(faviconHost || url).hostname +
            "&sz=128",
        );
      img.onerror = () => {
        img.removeAttribute("src");
      };
      const span = document.createElement("span");
      span.textContent = label;
      el.appendChild(img);
      el.appendChild(span);
      el.onclick = () => navigate(url);
      grid.appendChild(el);
    },
  );
  _bookmarks.forEach((bm) => {
    const el = document.createElement("div");
    el.className = "shortcut";
    const img = document.createElement("img");
    img.className = "shortcut-icon";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = bm.faviconUrl;
    img.onerror = () => {
      img.removeAttribute("src");
    };
    const span = document.createElement("span");
    span.textContent = bm.label;
    const _0xf85de = document.createElement("button");
    _0xf85de.className = "shortcut-delete";
    _0xf85de.type = "button";
    _0xf85de.title = "Remove bookmark";
    _0xf85de.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
    _0xf85de.onclick = async (e) => {
      e.stopPropagation();
      await _bookmarksReady;
      _bookmarks = _bookmarks.filter((b) => b.id !== bm.id);
      _renderShortcuts();
      _updateBookmarkIcon(document.getElementById("addrInput").value.trim());
      _deleteBookmark(bm.id);
    };
    el.appendChild(img);
    el.appendChild(span);
    el.appendChild(_0xf85de);
    el.onclick = () => navigate(bm.url);
    grid.appendChild(el);
  });
}
_renderShortcuts();
const _bookmarksReady = _loadAllBookmarks().then((bookmarks) => {
  _bookmarks = bookmarks;
  _renderShortcuts();
  _updateBookmarkIcon(document.getElementById("addrInput").value.trim());
});
const sidebar = document.getElementById("settingsSidebar");
const tabsEl = document.getElementById("settingsTabs");
const panelsEl = document.getElementById("settingsPanels");
const categories = Object.keys(SETTINGS);
const sectionEls = [];
function setActive(cat) {
  sidebar
    .querySelectorAll(".sidebar-item")
    .forEach((el) => el.classList.toggle("active", el.dataset.cat === cat));
  tabsEl
    .querySelectorAll(".tab-item")
    .forEach((el) => el.classList.toggle("active", el.dataset.cat === cat));
}
let scrollLock = false;
let scrollLockTimer = null;
function scrollToCategory(cat) {
  setActive(cat);
  const _0x49fa1b = panelsEl.querySelector(`[data-section="${cat}"]`);
  if (!_0x49fa1b) return;
  scrollLock = true;
  clearTimeout(scrollLockTimer);
  const _0xeb_0xc2e = _0x49fa1b.getBoundingClientRect();
  const _0x4ee34d = panelsEl.getBoundingClientRect();
  panelsEl.scrollTo({
    top: panelsEl.scrollTop + _0xeb_0xc2e.top - _0x4ee34d.top,
    behavior: "smooth",
  });
  scrollLockTimer = setTimeout(() => {
    scrollLock = false;
  }, 800);
}
panelsEl.addEventListener("scroll", () => {
  if (scrollLock) return;
  const containerTop = panelsEl.getBoundingClientRect().top;
  let active = categories[0];
  sectionEls.forEach((el) => {
    if (el.getBoundingClientRect().top - containerTop < 4)
      active = el.dataset.section;
  });
  setActive(active);
});
categories.forEach((cat, i) => {
  const sItem = document.createElement("div");
  sItem.className = "sidebar-item" + (i === 0 ? " active" : "");
  sItem.textContent = cat;
  sItem.dataset.cat = cat;
  sItem.onclick = () => scrollToCategory(cat);
  sidebar.appendChild(sItem);
  const tItem = document.createElement("button");
  tItem.className = "tab-item" + (i === 0 ? " active" : "");
  tItem.textContent = cat;
  tItem.dataset.cat = cat;
  tItem.onclick = () => scrollToCategory(cat);
  tabsEl.appendChild(tItem);
  const section = document.createElement("div");
  section.className = "settings-panel-section";
  section.dataset.section = cat;
  sectionEls.push(section);
  const lbl = document.createElement("div");
  lbl.className = "category-label";
  lbl.textContent = cat;
  section.appendChild(lbl);
  const rows = document.createElement("div");
  rows.className = "category-rows";
  Object.entries(SETTINGS[cat]).forEach(([key, s]) => {
    const row = document.createElement("div");
    row.className = "setting-row";
    const label = document.createElement("span");
    label.className = "setting-label";
    label.textContent = key;
    row.appendChild(label);
    if (s.type === "toggle") {
      const btn = document.createElement("button");
      btn.className = "toggle" + (s._value ? " on" : "");
      btn.onclick = () => {
        btn.classList.toggle("on");
        s._value = btn.classList.contains("on");
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(btn);
    } else if (s.type === "input") {
      const inp = document.createElement("input");
      inp.className = "setting-input";
      inp.placeholder = key;
      inp.value = s._value || "";
      inp.onchange = () => {
        s._value = inp.value;
        s.callback(inp.value);
        saveSettings();
      };
      row.appendChild(inp);
    } else if (s.type === "button") {
      const btn = document.createElement("button");
      btn.className = "setting-action-btn";
      btn.textContent = s.label;
      btn.onclick = () => s.action();
      row.appendChild(btn);
    } else if (s.type === "dropdown") {
      const sel = document.createElement("select");
      sel.className = "setting-select";
      s.options.forEach((opt) => {
        const o = document.createElement("option");
        o.textContent = opt.name;
        o.value = JSON.stringify(opt);
        if (opt.name === s._value?.name) o.selected = true;
        sel.appendChild(o);
      });
      sel.onchange = () => {
        s._value = JSON.parse(sel.value);
        s.callback(s._value);
        saveSettings();
      };
      row.appendChild(sel);
    }
    rows.appendChild(row);
  });
  section.appendChild(rows);
  panelsEl.appendChild(section);
});
const spacer = document.createElement("div");
spacer.className = "settings-spacer";
panelsEl.appendChild(spacer);
function setVh() {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`,
  );
}
setVh();
window.addEventListener("resize", setVh);
let canvas = document.getElementById("stars");
let ctx = canvas.getContext("2d");
let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);
const starObjs = Array.from(
  {
    length: 180,
  },
  () => {
    const base = Math.random() * 0.28 + 0.05;
    return {
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.85 + 0.2,
      base: base,
      alpha: base,
      blinking: Math.random() < 0.3,
      blinkPeak: 0,
      blinkDir: 1,
      blinkSpeed: 0.012 + Math.random() * 0.022,
      pauseMs: Math.random() * 6000,
    };
  },
);
let shoots = [];
const homeStateEls = [
  "panel",
  "gamesScreen",
  "gamePlayer",
  "effectsScreen",
].map((id) => document.getElementById(id));
function starsShouldRun() {
  return !document.hidden && document.hasFocus() && isOpiumMenu(true);
}
const OPIUM_EXTERNAL_SCREENS = ["panel", "gamePlayer"];
const OPIUM_HOME_ONLY_SCREENS = ["gamesScreen", "effectsScreen"];
function isOpiumMenu(homePageOnly = false) {
  const _0x9a_0xb18 = homePageOnly
    ? [...OPIUM_EXTERNAL_SCREENS, ...OPIUM_HOME_ONLY_SCREENS]
    : OPIUM_EXTERNAL_SCREENS;
  return !_0x9a_0xb18.some((id) =>
    document.getElementById(id)?.classList.contains("open"),
  );
}
globalThis.isOpiumMenu = isOpiumMenu;
const navActiveMap = [
  ["gamesScreen", "navGames"],
  ["effectsScreen", "navEffects"],
  ["settingsScreen", "navSettings"],
];
function updateNavActive() {
  navActiveMap.forEach(([screenId, navId]) => {
    const _0xa634bb = document.getElementById(screenId);
    const _0xb218db = document.getElementById(navId);
    if (_0xa634bb && _0xb218db)
      _0xb218db.classList.toggle(
        "active",
        _0xa634bb.classList.contains("open"),
      );
  });
}
updateNavActive();
let starsRafPending = false;
let last = 0;
let starsGen = 0;
let starsActive = null;
function stopStars() {
  starsGen++;
  starsRafPending = false;
  last = 0;
  shoots = [];
  if (W && H) ctx.clearRect(0, 0, W, H);
}
function startStars() {
  if (starsRafPending) return;
  starsRafPending = true;
  const _0x64a = starsGen;
  requestAnimationFrame((ts) => doFrame(ts, _0x64a));
}
function updateStarsActive() {
  const _0x956fea = starsShouldRun();
  if (_0x956fea === starsActive) return;
  starsActive = _0x956fea;
  if (_0x956fea) {
    startStars();
    if (!shootTimer) scheduleShoot();
  } else {
    stopStars();
  }
}
function spawnShoot() {
  const _0xbd225d = Math.random() * W * 1.4 - W * 0.2;
  const _0x9415c = Math.random() * H * 0.5;
  const _0x2ba3d = (Math.PI / 180) * (12 + Math.random() * 22);
  const _0xb51a = 7 + Math.random() * 8;
  shoots.push({
    x: _0xbd225d,
    y: _0x9415c,
    vx: Math.cos(_0x2ba3d) * _0xb51a,
    vy: Math.sin(_0x2ba3d) * _0xb51a,
    len: 70 + Math.random() * 100,
    life: 1,
    decay: 0.016 + Math.random() * 0.014,
  });
}
let nextShootAt = 0;
let shootTimer = null;
function scheduleShoot() {
  shootTimer = null;
  if (!starsShouldRun()) return;
  const _0x27bgde = Date.now();
  if (shootingStarsEnabled && _0x27bgde >= nextShootAt) {
    spawnShoot();
    nextShootAt = _0x27bgde + 500 + Math.random() * 800;
  }
  shootTimer = setTimeout(scheduleShoot, 500 + Math.random() * 800);
}
document.addEventListener("visibilitychange", updateStarsActive);
window.addEventListener("blur", updateStarsActive);
window.addEventListener("focus", updateStarsActive);
const screenClassObserver = new MutationObserver(() => {
  updateNavActive();
  updateStarsActive();
});
const settingsScreenEl = document.getElementById("settingsScreen");
[...homeStateEls, settingsScreenEl].forEach((el) => {
  if (el)
    screenClassObserver.observe(el, {
      attributes: true,
      attributeFilter: ["class"],
    });
});
setInterval(updateStarsActive, 1000);
const STARS_MAX_DT = 50;
function doFrame(ts, gen) {
  if (gen !== starsGen) return;
  if (!starsRafPending || !starsShouldRun()) {
    stopStars();
    return;
  }
  if (!last) {
    last = ts;
    requestAnimationFrame((t) => doFrame(t, gen));
    return;
  }
  const _0x8680c = ts - last;
  if (_0x8680c < 33) {
    requestAnimationFrame((t) => doFrame(t, gen));
    return;
  }
  last = ts;
  const _0x89ea = Math.min(_0x8680c, STARS_MAX_DT);
  ctx.clearRect(0, 0, W, H);
  if (starsEnabled) {
    starObjs.forEach((s) => {
      if (s.blinking) {
        s.blinkPeak += s.blinkDir * s.blinkSpeed;
        if (s.blinkPeak >= 1) {
          s.blinkPeak = 1;
          s.blinkDir = -1;
        }
        if (s.blinkPeak <= 0) {
          s.blinkPeak = 0;
          s.blinkDir = 1;
          s.blinking = false;
          s.alpha = s.base;
          s.pauseMs = 1500 + Math.random() * 5000;
        } else {
          s.alpha = s.base + (0.92 - s.base) * Math.sin(s.blinkPeak * Math.PI);
        }
      } else {
        s.pauseMs -= _0x89ea;
        if (s.pauseMs <= 0) s.blinking = true;
      }
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha.toFixed(3)})`;
      ctx.fill();
    });
  }
  if (shootingStarsEnabled) {
    shoots = shoots.filter((s) => s.life > 0);
    shoots.forEach((s) => {
      const _0xg_0xae4 = s.x - s.vx * (s.len / 10);
      const _0x646e = s.y - s.vy * (s.len / 10);
      const _0xce_0x14f = ctx.createLinearGradient(
        _0xg_0xae4,
        _0x646e,
        s.x,
        s.y,
      );
      _0xce_0x14f.addColorStop(0, "rgba(255,255,255,0)");
      _0xce_0x14f.addColorStop(
        1,
        `rgba(255,255,255,${(s.life * 0.85).toFixed(3)})`,
      );
      ctx.beginPath();
      ctx.moveTo(_0xg_0xae4, _0x646e);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = _0xce_0x14f;
      ctx.lineWidth = 1.1;
      ctx.stroke();
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;
    });
  }
  requestAnimationFrame((t) => doFrame(t, gen));
}
updateStarsActive();
function getSearchEngine() {
  return (
    SETTINGS.Prxy?.["Search Engine"]?._value?.url ||
    "https://duckduckgo.com/?q="
  );
}
function resolveUrl(v) {
  if (!v) return null;
  if (v.startsWith("http://") || v.startsWith("https://")) return v;
  if (v.includes(".") && !v.includes(" ")) return "https://" + v;
  return getSearchEngine() + encodeURIComponent(v);
}
function updateLockIcon(url) {
  const _0x386a5f = document.getElementById("lockIcon");
  if (_0x386a5f)
    _0x386a5f.classList.toggle(
      "secure",
      typeof url === "string" && url.startsWith("https://"),
    );
}
function navigate(url) {
  const u = resolveUrl(
    url || document.getElementById("searchInput").value.trim(),
  );
  if (!u) return;
  document.getElementById("panel").classList.add("open");
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("addrInput").value = u;
  updateLockIcon(u);
  _updateBookmarkIcon(u);
  startFrameLoading();
  frame.go(u);
  collapseSearch();
}
const searchWrap = document.getElementById("searchWrap");
const searchInput = document.getElementById("searchInput");
const acBox = document.getElementById("autocomplete");
let acSelected = -1;
let acItems = [];
let acTimer = null;
function expandSearch() {
  searchWrap.classList.add("expanded");
}
function collapseSearch() {
  searchWrap.classList.remove("expanded");
  searchWrap.classList.remove("has-ac");
  acBox.classList.remove("has-items");
  acBox.innerHTML = "";
  acItems = [];
  acSelected = -1;
}
searchInput.addEventListener("focus", expandSearch);
(shadowRoot || document).addEventListener("click", (e) => {
  if (!searchWrap.contains(e.target)) collapseSearch();
});
async function fetchAutocompletes(q) {
  if (!q) {
    acBox.innerHTML = "";
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
    return;
  }
  try {
    let _0x96c94c;
    try {
      const res = await fetch(
        sjEncode(
          `https://suggestqueries.google.com/complete/search?output=toolbar&hl=en&q=${encodeURIComponent(q)}`,
        ),
      );
      const _0x2_0x56b = new DOMParser().parseFromString(
        await res.text(),
        "application/xml",
      );
      _0x96c94c = [..._0x2_0x56b.querySelectorAll("suggestion")]
        .slice(0, 8)
        .map((el) => el.getAttribute("data"));
      if (!_0x96c94c.length) throw new Error("empty");
    } catch {
      const res = await fetch(
        sjEncode(
          `https://duckduckgo.com/ac/?kl=wt-wt&q=${encodeURIComponent(q)}`,
        ),
      );
      const _0x3_0x5c5 = await res.json();
      _0x96c94c = _0x3_0x5c5.slice(0, 8).map((s) => s.phrase);
    }
    renderSuggestions(_0x96c94c);
  } catch (e) {
    acBox.innerHTML = "";
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
  }
}
function renderSuggestions(list) {
  acBox.innerHTML = "";
  acItems = list;
  acSelected = -1;
  if (!list.length) {
    acBox.classList.remove("has-items");
    searchWrap.classList.remove("has-ac");
    return;
  }
  list.forEach((s) => {
    const _0xg2_0x116 = document.createElement("div");
    _0xg2_0x116.className = "ac-item";
    const _0x3c_0xcf7 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    _0x3c_0xcf7.setAttribute("viewBox", "0 0 24 24");
    const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", "11");
    c.setAttribute("cy", "11");
    c.setAttribute("r", "8");
    const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", "m21 21-4.35-4.35");
    _0x3c_0xcf7.appendChild(c);
    _0x3c_0xcf7.appendChild(p);
    _0xg2_0x116.appendChild(_0x3c_0xcf7);
    _0xg2_0x116.appendChild(document.createTextNode(s));
    _0xg2_0x116.onmousedown = (e) => {
      e.preventDefault();
      searchInput.value = s;
      navigate(s);
    };
    acBox.appendChild(_0xg2_0x116);
  });
  acBox.classList.add("has-items");
  searchWrap.classList.add("has-ac");
}
searchInput.addEventListener("input", () => {
  clearTimeout(acTimer);
  acSelected = -1;
  acTimer = setTimeout(() => fetchAutocompletes(searchInput.value.trim()), 180);
});
searchInput.addEventListener("keydown", (e) => {
  const items = acBox.querySelectorAll(".ac-item");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    acSelected = Math.min(acSelected + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle("selected", i === acSelected));
    if (acSelected >= 0) searchInput.value = acItems[acSelected];
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    acSelected = Math.max(acSelected - 1, -1);
    items.forEach((el, i) => el.classList.toggle("selected", i === acSelected));
    if (acSelected >= 0) searchInput.value = acItems[acSelected];
  } else if (e.key === "Escape") {
    collapseSearch();
  } else if (e.key === "Enter") {
    navigate();
  }
});
let homeClickCount = 0,
  homeResetTimer = null;
let gameCloseClickCount = 0,
  gameCloseResetTimer = null;
function resetGameCloseConfirm() {
  gameCloseClickCount = 0;
  clearTimeout(gameCloseResetTimer);
  const _0x91geeb = document.getElementById("gamePlayerClose");
  const _0xb_0x7c7 = document.getElementById("gamePlayerCloseWrap");
  const _0x6f_0xfab = document.getElementById("gameCloseCountdown");
  if (_0x91geeb) _0x91geeb.classList.remove("confirm");
  if (_0xb_0x7c7) _0xb_0x7c7.classList.remove("confirming");
  if (_0x6f_0xfab) {
    _0x6f_0xfab.classList.add("no-anim");
    _0x6f_0xfab.offsetHeight;
    _0x6f_0xfab.classList.remove("no-anim");
  }
}
function _armOrConfirmClose(onConfirm) {
  gameCloseClickCount++;
  if (gameCloseClickCount === 1) {
    const _0x94d = document.getElementById("gamePlayerClose");
    const _0xa15c = document.getElementById("gamePlayerCloseWrap");
    if (_0x94d) _0x94d.classList.add("confirm");
    if (_0xa15c) _0xa15c.classList.add("confirming");
    gameCloseResetTimer = setTimeout(resetGameCloseConfirm, 5000);
  } else {
    resetGameCloseConfirm();
    onConfirm();
  }
}
function handleGamePlayerClose() {
  _armOrConfirmClose(closeGamePlayer);
}
function resetHomeConfirm() {
  homeClickCount = 0;
  clearTimeout(homeResetTimer);
  const _0xc388bd = document.getElementById("homeBtn");
  const _0xc_0x3c2 = document.getElementById("homeBtnWrap");
  const _0x166e = document.getElementById("homeCountdown");
  _0xc388bd.classList.remove("confirm");
  _0xc_0x3c2.classList.remove("confirming");
  _0x166e.classList.add("no-anim");
  _0x166e.offsetHeight;
  _0x166e.classList.remove("no-anim");
}
function handleHome() {
  homeClickCount++;
  if (homeClickCount === 1) {
    const _0xc9a1ba = document.getElementById("homeBtn");
    const _0x5baab = document.getElementById("homeBtnWrap");
    _0xc9a1ba.classList.add("confirm");
    _0x5baab.classList.add("confirming");
    homeResetTimer = setTimeout(resetHomeConfirm, 5000);
  } else {
    resetHomeConfirm();
    closePanel();
  }
}
function closePanel() {
  document.getElementById("panel").classList.remove("open");
  document.getElementById("bottomNav").classList.remove("hidden");
  document.getElementById("addrInput").value = "";
  updateLockIcon(null);
  _updateBookmarkIcon(null);
  try {
    frame.element.src = "about:blank";
  } catch {}
  stopFrameLoading();
  if (document.fullscreenElement) document.exitFullscreen();
}
let frameLoading = false;
function startFrameLoading() {
  frameLoading = true;
  document.getElementById("reloadBtn").classList.add("loading");
}
function stopFrameLoading() {
  frameLoading = false;
  document.getElementById("reloadBtn").classList.remove("loading");
}
function goBack() {
  try {
    frame && frame.back();
    startFrameLoading();
  } catch (e) {}
}
function goForward() {
  try {
    frame && frame.forward();
    startFrameLoading();
  } catch (e) {}
}
function reload() {
  if (frameLoading) {
    try {
      frame.element.contentWindow.stop();
    } catch (e) {}
    stopFrameLoading();
    return;
  }
  try {
    startFrameLoading();
    frame.reload();
  } catch (e) {
    stopFrameLoading();
  }
}
document.getElementById("addrInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") navigate(e.target.value.trim());
});
function toggleSettings() {
  document.getElementById("settingsScreen").classList.toggle("open");
}
const fsEnter = `<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>`;
const fsExit = `<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>`;
const bmOutline = `<path d="M7.84 4.1a.178.178 0 0 1 .32 0l.634 1.285a.18.18 0 0 0 .134.098l1.42.206c.145.021.204.2.098.303L9.42 6.993a.18.18 0 0 0-.051.158l.242 1.414a.178.178 0 0 1-.258.187l-1.27-.668a.18.18 0 0 0-.165 0l-1.27.668a.178.178 0 0 1-.257-.187l.242-1.414a.18.18 0 0 0-.05-.158l-1.03-1.001a.178.178 0 0 1 .098-.303l1.42-.206a.18.18 0 0 0 .134-.098z"/><path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>`;
const bmFilled = `<path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5M8.16 4.1a.178.178 0 0 0-.32 0l-.634 1.285a.18.18 0 0 1-.134.098l-1.42.206a.178.178 0 0 0-.098.303L6.58 6.993c.042.041.061.1.051.158L6.39 8.565a.178.178 0 0 0 .258.187l1.27-.668a.18.18 0 0 1 .165 0l1.27.668a.178.178 0 0 0 .257-.187L9.368 7.15a.18.18 0 0 1 .05-.158l1.028-1.001a.178.178 0 0 0-.098-.303l-1.42-.206a.18.18 0 0 1-.134-.098z"/>`;
function _updateBookmarkIcon(url) {
  const _0x9d8e8c = document.getElementById("bookmarkIcon");
  const _0xdbb6ff = document.getElementById("bookmarkBtn");
  if (!_0x9d8e8c || !_0xdbb6ff) return;
  const _0xabbabd = !!url && _bookmarks.some((b) => b.id === url);
  _0x9d8e8c.innerHTML = _0xabbabd ? bmFilled : bmOutline;
  _0xdbb6ff.title = _0xabbabd ? "Remove bookmark" : "Bookmark this page";
}
async function toggleBookmark(_0xdeb) {
  const _0x73c5be = document.getElementById("addrInput").value.trim();
  if (!_0x73c5be) return;
  await _bookmarksReady;
  const _0x668a5g = _bookmarks.find((b) => b.id === _0x73c5be);
  if (_0x668a5g) {
    _bookmarks = _bookmarks.filter((b) => b.id !== _0x73c5be);
    _deleteBookmark(_0x73c5be);
    _updateBookmarkIcon(_0x73c5be);
    _renderShortcuts();
    return;
  }
  _0xdeb = "";
  try {
    _0xdeb = new URL(_0x73c5be).hostname;
  } catch (e) {}
  let _0xg4b3b = _0xdeb;
  try {
    _0xg4b3b = frame.element.contentDocument.title || _0xdeb;
  } catch (e) {}
  const _0xc3621c = {
    id: _0x73c5be,
    url: _0x73c5be,
    label: _0xg4b3b || _0x73c5be,
    faviconUrl: sjEncode(
      "https://www.google.com/s2/favicons?domain=" + _0xdeb + "&sz=128",
    ),
    bookmark: true,
    ts: Date.now(),
  };
  _bookmarks.push(_0xc3621c);
  _saveBookmark(_0xc3621c);
  _updateBookmarkIcon(_0x73c5be);
  _renderShortcuts();
}
function toggleFullscreen() {
  const _0xfc6df = document.getElementById("frame");
  if (!document.fullscreenElement) _0xfc6df.requestFullscreen();
  else document.exitFullscreen();
}
document.addEventListener("fullscreenchange", () => {
  document.getElementById("fsIcon").innerHTML = document.fullscreenElement
    ? fsExit
    : fsEnter;
});
frame = controller.createFrame(document.getElementById("frame"), {
  plugins: [
    new $jetUtils.HttpCachePlugin(),
    new $jetUtils.UrlWatcherPlugin((href) => {
      document.getElementById("addrInput").value = href;
      updateLockIcon(href);
      _updateBookmarkIcon(href);
      _checkExtensions(href);
    }),
  ],
});
controller.id = "OPM";
controller.rpc.id = "tabchannel-OPM";
controller.prefix = controller.config.prefix;
frame.prefix = controller.prefix;
frame.fetchHandler.context = frame.context;
frame.fetchHandler.context.hooks = {
  rewriter: frame.fetchHandler.hooks.rewriter,
};
controller.setupMessagePort();
frame.element.addEventListener("load", stopFrameLoading);
const link =
  document.querySelector("link[rel~='icon']") || document.createElement("link");
link.rel = "icon";
link.href = "data:,";
document.head.appendChild(link);
let focusTimeout = null;
document.addEventListener("visibilitychange", (e) => {
  if (!titleChangerEnabled) return;
  if (document.hidden) {
    document.title = "New Tab";
  } else {
    try {
      clearInterval(focusTimeout);
    } catch {}
    focusTimeout = null;
    document.title = "lucianland";
  }
});
let _effectsVolume = 1;
let _currentAudio = null;
let _effectsSearchTimer = null;
let _effectsLoaded = false;
let _effectsPage = 1;
let _effectsKeyword = null;
let _effectsLoading = false;
let _effectsExhausted = false;
let _effectsAll = [];
let _effectsLoadGen = 0;
let _effectsScrollTop = 0;
function _makeGridVirtualizer(
  wrapId,
  sizerId,
  gridId,
  buildItem,
  onNearEnd,
  _0xg13cbf,
  _0x3bdf,
  _0x3c31dg,
  _0x6f527e,
  _0x4_0xa39,
  _0xe6d,
  _0x0f4a6e,
) {
  const _0xa4d = document.getElementById(wrapId);
  const _0x7b3ea = document.getElementById(sizerId);
  const _0x2ffe = document.getElementById(gridId);
  _0xg13cbf = 2;
  let _0x66ae = [];
  _0x3bdf = 0;
  _0x3c31dg = 0;
  _0x6f527e = 0;
  _0x4_0xa39 = 0;
  _0xe6d = 0;
  _0x0f4a6e = 0;
  let _0xc8a = false;
  function _0x9a2c() {
    const _0xc4ad = getComputedStyle(_0x2ffe);
    const _0x5fc8e = _0xc4ad.gridTemplateColumns
      .split(" ")
      .filter((t) => t && t !== "0px");
    _0x3bdf = Math.max(1, _0x5fc8e.length);
    _0x6f527e = parseFloat(_0xc4ad.rowGap) || 0;
    _0x4_0xa39 = parseFloat(getComputedStyle(_0x7b3ea).paddingTop) || 0;
    const _0x21482b = _0x2ffe.firstElementChild;
    if (_0x21482b) {
      const h = _0x21482b.getBoundingClientRect().height;
      if (h > 0) _0x3c31dg = h + _0x6f527e;
    }
  }
  function _0xf8f6f() {
    if (_0x3c31dg > 0 && _0x3bdf > 0) return;
    _0x9a2c();
    if (_0x3c31dg > 0) return;
    if (!_0x66ae.length) return;
    _0x2ffe.textContent = "";
    _0x2ffe.style.top = _0x4_0xa39 + "px";
    const n = Math.min(_0x66ae.length, _0x3bdf);
    for (let i = 0; i < n; i++) _0x2ffe.appendChild(buildItem(_0x66ae[i], i));
    _0xe6d = 0;
    _0x0f4a6e = n;
    _0x9a2c();
  }
  function _0x73723b(s, e) {
    if (s >= _0x0f4a6e || e <= _0xe6d) {
      _0x2ffe.textContent = "";
      for (let i = s; i < e; i++) _0x2ffe.appendChild(buildItem(_0x66ae[i], i));
      _0xe6d = s;
      _0x0f4a6e = e;
      return;
    }
    const _0xd1baff = Math.max(_0xe6d, s);
    const _0x54c = Math.min(_0x0f4a6e, e);
    for (let k = _0xe6d; k < _0xd1baff; k++)
      _0x2ffe.firstElementChild?.remove();
    for (let k = _0x54c; k < _0x0f4a6e; k++) _0x2ffe.lastElementChild?.remove();
    for (let i = _0xd1baff - 1; i >= s; i--)
      _0x2ffe.prepend(buildItem(_0x66ae[i], i));
    for (let i = _0x54c; i < e; i++)
      _0x2ffe.appendChild(buildItem(_0x66ae[i], i));
    _0xe6d = s;
    _0x0f4a6e = e;
  }
  function _0x7802ab() {
    if (!_0x66ae.length || _0xa4d.classList.contains("flow")) return;
    _0xf8f6f();
    if (!_0x3c31dg) return;
    const _0xf0dg = Math.ceil(_0x66ae.length / _0x3bdf);
    const _0xdd660e = Math.max(0, _0xf0dg * _0x3c31dg - _0x6f527e);
    const _0x9e6af = _0xdd660e + "px";
    if (_0x7b3ea.style.height !== _0x9e6af) _0x7b3ea.style.height = _0x9e6af;
    const _0x46bc = _0xa4d.scrollTop;
    const _0xb829ge = _0xa4d.clientHeight || 1;
    let _0x79d = Math.floor((_0x46bc - _0x4_0xa39) / _0x3c31dg) - _0xg13cbf;
    if (_0x79d < 0) _0x79d = 0;
    let _0x6b26c =
      Math.ceil((_0x46bc - _0x4_0xa39 + _0xb829ge) / _0x3c31dg) + _0xg13cbf;
    if (_0x6b26c > _0xf0dg) _0x6b26c = _0xf0dg;
    if (_0x6b26c <= _0x79d) _0x6b26c = Math.min(_0xf0dg, _0x79d + 1);
    const _0xdfg = _0x4_0xa39 + _0x79d * _0x3c31dg;
    const _0x729cc = _0xdfg + "px";
    if (_0x2ffe.style.top !== _0x729cc) _0x2ffe.style.top = _0x729cc;
    const s = _0x79d * _0x3bdf;
    const e = Math.min(_0x66ae.length, _0x6b26c * _0x3bdf);
    if (s !== _0xe6d || e !== _0x0f4a6e) _0x73723b(s, e);
    if (onNearEnd && _0x46bc + _0xb829ge >= _0x4_0xa39 + _0xdd660e - _0xb829ge)
      onNearEnd();
  }
  function _0x8ab46g() {
    if (_0xc8a) return;
    _0xc8a = true;
    requestAnimationFrame(() => {
      _0xc8a = false;
      _0x7802ab();
    });
  }
  _0xa4d.addEventListener("scroll", _0x8ab46g, {
    passive: true,
  });
  window.addEventListener("resize", () => {
    if (!_0x66ae.length || _0xa4d.classList.contains("flow")) return;
    if (!_0x2ffe.firstElementChild) {
      _0x3c31dg = 0;
      _0x3bdf = 0;
      return;
    }
    const _0x0d31b =
      _0x3c31dg > 0
        ? Math.floor(Math.max(0, _0xa4d.scrollTop - _0x4_0xa39) / _0x3c31dg) *
          _0x3bdf
        : 0;
    _0x3c31dg = 0;
    _0x3bdf = 0;
    _0x2ffe.textContent = "";
    _0xe6d = 0;
    _0x0f4a6e = 0;
    _0xf8f6f();
    if (_0x3c31dg > 0)
      _0xa4d.scrollTop =
        _0x4_0xa39 + Math.floor(_0x0d31b / _0x3bdf) * _0x3c31dg;
    _0x7802ab();
  });
  return {
    setItems(next) {
      _0x66ae = next || [];
      if (_0x0f4a6e > _0x66ae.length) {
        _0x2ffe.textContent = "";
        _0xe6d = 0;
        _0x0f4a6e = 0;
      }
      _0x7802ab();
    },
    restore(top) {
      if (!_0x66ae.length) return;
      _0xf8f6f();
      if (!_0x3c31dg) return;
      const rows = Math.ceil(_0x66ae.length / _0x3bdf);
      const contentH = Math.max(0, rows * _0x3c31dg - _0x6f527e);
      _0x7b3ea.style.height = contentH + "px";
      const _0x97e = Math.max(
        0,
        _0x4_0xa39 * 2 + contentH - _0xa4d.clientHeight,
      );
      _0xa4d.scrollTop = Math.min(top || 0, _0x97e);
      _0x7802ab();
    },
    clear() {
      _0x2ffe.textContent = "";
      _0xe6d = 0;
      _0x0f4a6e = 0;
    },
    reset() {
      _0x66ae = [];
      _0x2ffe.textContent = "";
      _0x7b3ea.style.height = "";
      _0x2ffe.style.top = "";
      _0x3c31dg = 0;
      _0x3bdf = 0;
      _0xe6d = 0;
      _0x0f4a6e = 0;
    },
    enterFlow() {
      _0xa4d.classList.add("flow");
      _0x2ffe.style.top = "";
      _0x7b3ea.style.height = "";
    },
    exitFlow() {
      _0xa4d.classList.remove("flow");
    },
    isMounted() {
      return !_0xa4d.classList.contains("flow") && !!_0x2ffe.firstElementChild;
    },
    scrollTop() {
      return _0xa4d.scrollTop;
    },
  };
}
async function _getMyinstantsEffects(pageNum = 1, keyword = null) {
  const _0x0932af = keyword
    ? `https://www.myinstants.com/en/search/?name=${encodeURIComponent(keyword)}&page=${pageNum}`
    : `https://www.myinstants.com/en/categories/sound%20effects/us/?page=${pageNum}`;
  const _0xdac3f = sjEncode(_0x0932af);
  const _0x46g = await fetch(_0xdac3f);
  const _0x3a5b3d = await _0x46g.text();
  const _0x33319f = new DOMParser();
  const _0xd119c = _0x33319f.parseFromString(_0x3a5b3d, "text/html");
  const _0xg90b = _0xd119c.querySelectorAll(".instant");
  const _0x09699g = [];
  _0xg90b.forEach((instant) => {
    const _0x46501a = instant.querySelector(".instant-link");
    const _0x43730g = instant.querySelector(".small-button");
    if (!_0x46501a || !_0x43730g) return;
    const _0xf34f = _0x46501a.textContent.trim();
    const _0xa9af = _0x43730g.getAttribute("onclick");
    const _0x67944a = _0xa9af?.match(
      new RegExp("play\\(['\"]([^'\"]+)['\"]", ""),
    );
    if (!_0x67944a) return;
    const _0xafg98d = _0x67944a[1];
    const _0x47562f = `https://www.myinstants.com${_0xafg98d}`;
    const _0xc4fa1e = sjEncode(_0x47562f);
    _0x09699g.push({
      title: _0xf34f,
      src: _0xc4fa1e,
    });
  });
  return _0x09699g;
}
const _sblSrc = (p) =>
  sjEncode(p.startsWith("http") ? p : "https://soundbuttonslab.com" + p);
async function _getSoundButtonsLabEffects(pageNum = 1, keyword = null) {
  const _0x31e7g = keyword
    ? `/api/v1/search-sound-button?q=${encodeURIComponent(keyword)}&page=${pageNum}`
    : `/api/v1/get-home-page-trending-soundboard-buttons?page=${pageNum}`;
  const _0x3c2ba = await fetch(
    sjEncode("https://soundbuttonslab.com" + _0x31e7g),
  );
  if (!_0x3c2ba.ok) throw new Error(`HTTP ${_0x3c2ba.status} for ${_0x31e7g}`);
  const _0x5_0x9fd = await _0x3c2ba.json();
  return keyword
    ? _0x5_0x9fd.results.map((r) => ({
        title: r.title,
        src: _sblSrc(r.file),
      }))
    : _0x5_0x9fd.results.data.map((r) => ({
        title: r.name,
        src: _sblSrc(r.audio),
      }));
}
async function getEffects(pageNum = 1, keyword = null) {
  const [myinstants, soundButtonsLab] = await Promise.all([
    _getMyinstantsEffects(pageNum, keyword)["catch"](() => []),
    _getSoundButtonsLabEffects(pageNum, keyword)["catch"](() => []),
  ]);
  return [...myinstants, ...soundButtonsLab];
}
const _effectsVirt = _makeGridVirtualizer(
  "effectsGridWrap",
  "effectsGridSizer",
  "effectsGrid",
  (e) => _buildEffectButton(e.title, e.src),
  () => _loadEffectsPage(),
);
function openEffects() {
  document.getElementById("effectsScreen").classList.add("open");
  if (!_effectsLoaded) {
    _effectsReload(null);
  } else if (!_effectsVirt.isMounted()) {
    _renderEffectsList();
    _effectsVirt.restore(_effectsScrollTop);
  }
}
function closeEffects() {
  const _0x535fc = document.getElementById("effectsScreen");
  _effectsScrollTop = _effectsVirt.scrollTop();
  _0x535fc.classList.remove("open");
  setTimeout(() => {
    if (!_0x535fc.classList.contains("open")) {
      _effectsLoadGen++;
      _effectsLoading = false;
      _effectsVirt.clear();
    }
  }, 450);
}
function _renderEffectSkeletons(grid, count) {
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const _0x7e59bf = document.createElement("div");
    _0x7e59bf.className = "effect-btn skeleton";
    grid.appendChild(_0x7e59bf);
  }
}
function _fillingEffectSkeletonCount(wrap, _0xda04a, _0x6_0x69e) {
  _0xda04a = 100;
  _0x6_0x69e = 8;
  const _0x91b1ag = Math.max(
    1,
    Math.floor((wrap.clientWidth + _0x6_0x69e) / (_0xda04a + _0x6_0x69e)),
  );
  const _0x39fe4f = _0xda04a;
  const _0xc208b = Math.max(
    1,
    Math.ceil((wrap.clientHeight * 1.6) / (_0x39fe4f + _0x6_0x69e)),
  );
  return _0x91b1ag * _0xc208b;
}
function _effectsReload(keyword) {
  _effectsPage = 1;
  _effectsKeyword = keyword || null;
  _effectsLoading = false;
  _effectsExhausted = false;
  _effectsAll = [];
  _effectsLoadGen++;
  _effectsScrollTop = 0;
  _effectsVirt.reset();
  _effectsVirt.enterFlow();
  const _0x52358c = document.getElementById("effectsGridWrap");
  _renderEffectSkeletons(
    document.getElementById("effectsGrid"),
    _fillingEffectSkeletonCount(_0x52358c),
  );
  _0x52358c.scrollTop = 0;
  _loadEffectsPage();
}
function _renderEffectsList() {
  if (!_effectsAll.length) return;
  _effectsVirt.exitFlow();
  _effectsVirt.setItems(_effectsAll);
}
function _buildDownloadIcon(_0xf39bb) {
  _0xf39bb = "http://www.w3.org/2000/svg";
  const _0xd8d5c = document.createElementNS(_0xf39bb, "svg");
  _0xd8d5c.setAttribute("viewBox", "0 0 24 24");
  const _0xc2_0x2ca = document.createElementNS(_0xf39bb, "path");
  _0xc2_0x2ca.setAttribute("d", "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4");
  const _0x5743b = document.createElementNS(_0xf39bb, "polyline");
  _0x5743b.setAttribute("points", "7 10 12 15 17 10");
  const _0xdb_0x6e1 = document.createElementNS(_0xf39bb, "line");
  _0xdb_0x6e1.setAttribute("x1", "12");
  _0xdb_0x6e1.setAttribute("y1", "15");
  _0xdb_0x6e1.setAttribute("x2", "12");
  _0xdb_0x6e1.setAttribute("y2", "3");
  _0xd8d5c.appendChild(_0xc2_0x2ca);
  _0xd8d5c.appendChild(_0x5743b);
  _0xd8d5c.appendChild(_0xdb_0x6e1);
  return _0xd8d5c;
}
async function _downloadEffect(title, src) {
  const _0x4d1f =
    (title || "sound-effect")
      .replace(new RegExp('[\\\\/:*?"<>|]+', "g"), "")
      .trim() || "sound-effect";
  try {
    const _0xf025e = await fetch(src);
    const _0xf2de = await _0xf025e.blob();
    const _0xd350e = URL.createObjectURL(_0xf2de);
    const a = document.createElement("a");
    a.href = _0xd350e;
    a.download = _0x4d1f + ".mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(_0xd350e), 1000);
  } catch (e) {
    window.open(src, "_blank");
  }
}
function _buildEffectButton(title, src, _0x28028a) {
  _0x28028a = "http://www.w3.org/2000/svg";
  const _0x55bbaa = document.createElement("button");
  _0x55bbaa.className = "effect-btn";
  const _0x74dc = document.createElementNS(_0x28028a, "svg");
  _0x74dc.setAttribute("viewBox", "0 0 24 24");
  const _0x7cfbef = document.createElementNS(_0x28028a, "polygon");
  _0x7cfbef.setAttribute("points", "11 5 6 9 2 9 2 15 6 15 11 19 11 5");
  const _0x49g3f = document.createElementNS(_0x28028a, "path");
  _0x49g3f.setAttribute("d", "M15.54 8.46a5 5 0 0 1 0 7.07");
  const _0x5742c = document.createElementNS(_0x28028a, "path");
  _0x5742c.setAttribute("d", "M19.07 4.93a10 10 0 0 1 0 14.14");
  _0x74dc.appendChild(_0x7cfbef);
  _0x74dc.appendChild(_0x49g3f);
  _0x74dc.appendChild(_0x5742c);
  const _0xeae73d = document.createElement("span");
  _0xeae73d.textContent = title;
  const _0x5bd = title.length;
  const _0xe1be =
    _0x5bd <= 6
      ? 14
      : _0x5bd <= 12
        ? 12
        : _0x5bd <= 20
          ? 11
          : _0x5bd <= 30
            ? 10
            : 9;
  _0xeae73d.style.fontSize = _0xe1be + "px";
  const _0x0d226e = document.createElement("div");
  _0x0d226e.className = "effect-download";
  _0x0d226e.title = "Download mp3";
  _0x0d226e.setAttribute("aria-label", "Download mp3");
  _0x0d226e.appendChild(_buildDownloadIcon());
  _0x0d226e.onclick = (e) => {
    e.stopPropagation();
    _downloadEffect(title, src);
  };
  _0x55bbaa.appendChild(_0x74dc);
  _0x55bbaa.appendChild(_0xeae73d);
  _0x55bbaa.appendChild(_0x0d226e);
  _0x55bbaa.onclick = () => _playEffect(_0x55bbaa, src);
  if (_currentAudio && _currentAudio._effectSrc === src)
    _0x55bbaa.classList.add("playing");
  return _0x55bbaa;
}
async function _loadEffectsPage() {
  if (_effectsLoading || _effectsExhausted) return;
  _effectsLoading = true;
  const _0x73f5cd = _effectsLoadGen;
  const _0xb2_0xd87 = document.getElementById("effectsGrid");
  try {
    const _0x3c7b2a = await getEffects(_effectsPage, _effectsKeyword);
    if (_0x73f5cd !== _effectsLoadGen) {
      _effectsLoading = false;
      return;
    }
    if (!_0x3c7b2a.length) {
      _effectsExhausted = true;
      if (_effectsPage === 1) {
        _effectsVirt.enterFlow();
        _0xb2_0xd87.innerHTML =
          '<div class="effects-loading">error loading, refresh and try again</div>';
      }
      _effectsLoading = false;
      return;
    }
    _effectsAll.push(..._0x3c7b2a);
    _effectsPage++;
    _effectsLoaded = true;
    _effectsLoading = false;
    _renderEffectsList();
  } catch (e) {
    if (_0x73f5cd !== _effectsLoadGen) {
      _effectsLoading = false;
      return;
    }
    if (_effectsPage === 1) {
      _effectsVirt.enterFlow();
      _0xb2_0xd87.innerHTML =
        '<div class="effects-loading">failed to load</div>';
    }
    _effectsLoading = false;
  }
}
function _clearPlayingBtns() {
  document
    .querySelectorAll(".effect-btn.playing")
    .forEach((b) => b.classList.remove("playing"));
}
function _playEffect(btn, src) {
  if (_currentAudio) {
    const _0x2f86a = _currentAudio._effectSrc === src;
    _currentAudio.pause();
    _currentAudio.currentTime = 0;
    _currentAudio = null;
    _clearPlayingBtns();
    if (_0x2f86a) return;
  }
  const _0x297b8f = new Audio(src);
  _0x297b8f.volume = _effectsVolume;
  _0x297b8f._effectSrc = src;
  _0x297b8f.play()["catch"](() => {});
  btn.classList.add("playing");
  _currentAudio = _0x297b8f;
  _0x297b8f.onended = () => {
    if (_currentAudio !== _0x297b8f) return;
    _currentAudio = null;
    _clearPlayingBtns();
  };
}
function _updateVolumeTrack() {
  const _0x2g568c = document.getElementById("volumeSlider");
  const _0x3bd = parseFloat(_0x2g568c.value) * 100;
  _0x2g568c.style.background = `linear-gradient(to right, var(--accent) ${_0x3bd}%, rgba(255,255,255,0.12) ${_0x3bd}%)`;
}
_updateVolumeTrack();
document.getElementById("volumeSlider").addEventListener("input", function () {
  _effectsVolume = parseFloat(this.value);
  if (_currentAudio) _currentAudio.volume = _effectsVolume;
  _updateVolumeTrack();
});
document.getElementById("effectsSearch").addEventListener("input", function () {
  clearTimeout(_effectsSearchTimer);
  const _0x559f = this.value.trim();
  _effectsSearchTimer = setTimeout(() => _effectsReload(_0x559f || null), 350);
});
let _luminReady = false;
let _luminInitPromise = null;
let _gamesLoaded = false;
let _gamesKeyword = null;
let _gamesSearchTimer = null;
let _gamesLoadGen = 0;
let _gamesScrollTop = 0;
const _gamesImgCache = new WeakMap();
const GAMES_CACHE_TTL = 24 * 60 * 60 * 1000;
function _migrateOldDBs(db) {
  if (localStorage.getItem("O_MIGRATED")) return Promise.resolve();
  if (_oMigratePromise) return _oMigratePromise;
  _oMigratePromise = (async () => {
    try {
      const _0xdc8ffb = await new Promise((resolve, reject) => {
        const req = indexedDB.open("oCache", 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore("cache");
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const _0xae5ec = await new Promise((resolve, reject) => {
        const tx = _0xdc8ffb.transaction("cache", "readonly");
        const _0x7gc = tx.objectStore("cache");
        const _0x7_0xe8b = _0x7gc.getAllKeys();
        const _0x83d = _0x7gc.getAll();
        tx.oncomplete = () =>
          resolve({
            keys: _0x7_0xe8b.result,
            vals: _0x83d.result,
          });
        tx.onerror = () => reject(tx.error);
      });
      _0xdc8ffb.close();
      const _0x48cef = await new Promise((resolve, reject) => {
        const req = indexedDB.open("oAiChats", 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore("chats", {
            keyPath: "id",
          });
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      const _0xb5dg7f = await new Promise((resolve, reject) => {
        const req = _0x48cef
          .transaction("chats", "readonly")
          .objectStore("chats")
          .getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
      _0x48cef.close();
      if (_0xae5ec.keys.length || _0xb5dg7f.length) {
        await new Promise((resolve, reject) => {
          const tx = db.transaction(["cache", "chats"], "readwrite");
          _0xae5ec.keys.forEach((k, i) =>
            tx.objectStore("cache").put(_0xae5ec.vals[i], k),
          );
          _0xb5dg7f.forEach((chat) => tx.objectStore("chats").put(chat));
          tx.oncomplete = resolve;
          tx.onerror = () => reject(tx.error);
        });
      }
      await Promise.all(
        ["oCache", "oAiChats"].map(
          (name) =>
            new Promise((res) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = req.onerror = req.onblocked = res;
            }),
        ),
      );
      localStorage.setItem("O_MIGRATED", "1");
    } catch (e) {
      console.error("[O] migration failed:", e);
    }
  })();
  return _oMigratePromise;
}
function _oDB() {
  if (_oDBPromise) return _oDBPromise;
  _oDBPromise = new Promise((resolve, reject) => {
    const _0xa86baf = indexedDB.open("O", 2);
    _0xa86baf.onupgradeneeded = () => {
      const db = _0xa86baf.result;
      if (!db.objectStoreNames.contains("cache")) db.createObjectStore("cache");
      if (!db.objectStoreNames.contains("chats"))
        db.createObjectStore("chats", {
          keyPath: "id",
        });
      if (!db.objectStoreNames.contains("bookmarks"))
        db.createObjectStore("bookmarks", {
          keyPath: "id",
        });
    };
    _0xa86baf.onsuccess = () => {
      const db = _0xa86baf.result;
      _migrateOldDBs(db).then(() => resolve(db));
    };
    _0xa86baf.onerror = () => {
      _oDBPromise = null;
      reject(_0xa86baf.error);
    };
  });
  return _oDBPromise;
}
async function _loadGamesCacheEntry(key, isValid) {
  try {
    const _0x3058ee = await _oDB();
    const _0xbb97de = await new Promise((resolve, reject) => {
      const _0x2cfe1f = _0x3058ee.transaction("cache", "readonly");
      const _0x2ac3fa = _0x2cfe1f.objectStore("cache").get(key);
      _0x2ac3fa.onsuccess = () => resolve(_0x2ac3fa.result);
      _0x2ac3fa.onerror = () => reject(_0x2ac3fa.error);
    });
    if (!_0xbb97de) {
      return null;
    }
    if (!isValid(_0xbb97de.games)) {
      return null;
    }
    if (Date.now() - _0xbb97de.ts > GAMES_CACHE_TTL) {
      return null;
    }
    return _0xbb97de.games;
  } catch (e) {
    console.error("[O] cache load failed:", key, e);
    return null;
  }
}
async function _saveGamesCacheEntry(key, games) {
  try {
    const _0x83bga = await _oDB();
    await new Promise((resolve, reject) => {
      const _0xe7f = _0x83bga.transaction("cache", "readwrite");
      _0xe7f.objectStore("cache").put(
        {
          ts: Date.now(),
          games: games,
        },
        key,
      );
      _0xe7f.oncomplete = resolve;
      _0xe7f.onerror = () => reject(_0xe7f.error);
    });
  } catch (e) {
    console.error("[O] cache save failed:", key, e);
  }
}
async function _loadAllBookmarks() {
  try {
    const _0xe67ae = await _oDB();
    const _0x28095f = await new Promise((resolve, reject) => {
      const _0xb6d = _0xe67ae.transaction("bookmarks", "readonly");
      const _0x381gc = _0xb6d.objectStore("bookmarks").getAll();
      _0x381gc.onsuccess = () => resolve(_0x381gc.result || []);
      _0x381gc.onerror = () => reject(_0x381gc.error);
    });
    _0x28095f.sort((a, b) => (a.ts || 0) - (b.ts || 0));
    return _0x28095f;
  } catch (e) {
    console.error("[O] bookmarks load failed:", e);
    return [];
  }
}
async function _getBookmark(id) {
  try {
    const _0x6af = await _oDB();
    return await new Promise((resolve, reject) => {
      const _0x56a04g = _0x6af
        .transaction("bookmarks", "readonly")
        .objectStore("bookmarks")
        .get(id);
      _0x56a04g.onsuccess = () => resolve(_0x56a04g.result || null);
      _0x56a04g.onerror = () => reject(_0x56a04g.error);
    });
  } catch (e) {
    console.error("[O] bookmark lookup failed:", id, e);
    return null;
  }
}
async function _saveBookmark(bookmark) {
  try {
    const _0xcc72a = await _oDB();
    await new Promise((resolve, reject) => {
      const _0xe8g3fd = _0xcc72a.transaction("bookmarks", "readwrite");
      _0xe8g3fd.objectStore("bookmarks").put(bookmark);
      _0xe8g3fd.oncomplete = resolve;
      _0xe8g3fd.onerror = () => reject(_0xe8g3fd.error);
    });
  } catch (e) {
    console.error("[O] bookmark save failed:", bookmark.id, e);
  }
}
async function _deleteBookmark(id) {
  try {
    const _0xb4a1a = await _oDB();
    await new Promise((resolve, reject) => {
      const _0xeaf = _0xb4a1a.transaction("bookmarks", "readwrite");
      _0xeaf.objectStore("bookmarks")["delete"](id);
      _0xeaf.oncomplete = resolve;
      _0xeaf.onerror = () => reject(_0xeaf.error);
    });
  } catch (e) {
    console.error("[O] bookmark delete failed:", id, e);
  }
}
function _repoUrl(repo) {
  if (!window.assetsBase) return `https://cdn.jsdelivr.net/gh/${repo}/`;
  const _0xcd_0x679 = window.assetsBase;
  if (new RegExp("\\/main\\/?$", "").test(_0xcd_0x679)) {
    repo = repo.replace(new RegExp("@[^/]+$", ""), "");
  }
  return _0xcd_0x679.replace(
    new RegExp("%54ongSherbet\\/storage(?:@[^/]+)?", ""),
    repo,
  );
}
window._repoUrl = _repoUrl;
const BLOCK = [
  "a.luminsdk.com",
  "drkesten.com",
  "instructure-ramen.hpsschools.org",
];
const hit = (v) =>
  typeof v === "string" && BLOCK.some((b) => v.toLowerCase().includes(b));
const P = Array.prototype.push,
  A = Function.prototype.apply;
Array.prototype.push = function () {
  return A.call(
    P,
    this,
    [...arguments].filter((v) => !hit(v)),
  );
};
Function.prototype.apply = function (t, a) {
  const l = a && a.length > 1 && a[a.length - 1];
  if (
    l &&
    typeof l === "object" &&
    l.length &&
    [...l].every(
      (v) => typeof v === "string" && new RegExp("^https?:", "").test(v),
    )
  )
    a = [...a.slice(0, -1), [...l].filter((v) => !hit(v))];
  return A.call(this, t, a);
};
const _luminScriptPromise = loadScript(getBase() + "/lmnsdk.js");
function _initLumin() {
  if (_luminReady) return Promise.resolve();
  if (_luminInitPromise) return _luminInitPromise;
  _luminInitPromise = _luminScriptPromise
    .then(() =>
      Lumin.init({
        headless: true,
      }),
    )
    .then(() => {
      _luminReady = true;
    });
  return _luminInitPromise;
}
const GNM = {
  index: _repoUrl("freebuisness/assets") + "zones.json",
  html: _repoUrl("freebuisness/html"),
  covers: _repoUrl("freebuisness/covers"),
};
const GMSHELF = {
  seraph: {
    index: _repoUrl("gmshelf/seraph") + "seraph.json",
    base: _repoUrl("gmshelf/seraph").replace(new RegExp("\\/$", ""), ""),
  },
};
const OPMSOURCES = {
  ugs: {
    index: _repoUrl("%54ongSherbet/storage@main") + "ugs.json",
  },
  ckv: {
    index: _repoUrl("%54ongSherbet/storage@main") + "ckv.json",
  },
};
const _gamesState = {
  all: null,
  fetchPromise: null,
  matches: null,
};
function _normalizeGameName(s) {
  return s.toLowerCase().replace(new RegExp("[^a-z0-9]+", "g"), "");
}
function _filterByName(list, keyword) {
  if (!keyword) return list;
  const k = _normalizeGameName(keyword);
  if (!k) return list;
  return list.filter((g) => g._norm && g._norm.includes(k));
}
async function _fetchAllLuminGames() {
  await _initLumin();
  const _0x7d_0x2c3 = [];
  let _0xdabffc = 1,
    _0x3144ea = 1;
  do {
    const _0xd567af = await Lumin.getGames({
      page: _0xdabffc,
      limit: 99999,
    });
    (_0xd567af.games || []).forEach((g) =>
      _0x7d_0x2c3.push({
        source: "lumin",
        name: g.name,
        id: g.id,
        image_token: g.image_token,
      }),
    );
    _0x3144ea = _0xd567af.pages || 1;
    _0xdabffc++;
  } while (_0xdabffc <= _0x3144ea);
  return _0x7d_0x2c3;
}
async function _fetchAllGnmGames() {
  const _0xcaadb = await (await fetch(GNM.index)).json();
  return _0xcaadb
    .filter(
      (g) =>
        g.url &&
        g.url.startsWith("{HTML_URL}") &&
        g.cover &&
        !g.name.startsWith("[!]"),
    )
    .map((g) => ({
      source: "gn-math",
      name: g.name,
      url: g.url,
      cover: g.cover,
      _html: GNM.html,
      _covers: GNM.covers,
    }));
}
function _gmshelfCoverCandidates(base, url) {
  const _0x5dc18e = url
    .replace(new RegExp("\\/[^/]*$", ""), "")
    .split("/")
    .pop();
  const _0x28b = url.split("/").pop().replace(new RegExp("\\.[^.]*$", ""), "");
  const _0x9ef4c = ["jpg", "png", "webp", "jpeg"];
  const _0x3c2 = new Set();
  [_0x5dc18e, _0x28b].forEach((s) =>
    _0x9ef4c.forEach((ext) => _0x3c2.add(`${s}.${ext}`)),
  );
  return [..._0x3c2].map((n) => `${base}/covers/${n}`);
}
async function _fetchGmshelfGames(sourceName) {
  const { index: index, base: base } = GMSHELF[sourceName];
  const _0xf741ag = await fetch(index);
  const _0x393b = await _0xf741ag.json();
  const _0xcf45c = Array.isArray(_0x393b) ? _0x393b : _0x393b.games || [];
  return _0xcf45c
    .filter((g) => g.url && g.name)
    .map((g) => ({
      source: sourceName,
      name: g.name,
      url: base + g.url,
      cover: _gmshelfCoverCandidates(base, g.url),
    }));
}
function _tileCover(name, h) {
  h = 0;
  for (const c of name || "?") h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const _0x4g_0xc4e = h % 360;
  const _0xfa68dc =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
    `<rect width="200" height="200" fill="hsl(${_0x4g_0xc4e},55%,38%)"/>` +
    `<text x="100" y="128" font-size="72" text-anchor="middle" fill="#fff" font-family="sans-serif">` +
    `${(name || "?").trim().charAt(0).toUpperCase()}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(_0xfa68dc);
}
async function _fetchNewGames(sourceName) {
  const { index: index } = OPMSOURCES[sourceName];
  const _0x5e_0x5c6 = await fetch(index);
  const _0x122g = await _0x5e_0x5c6.json();
  const _0x7f86df = Array.isArray(_0x122g) ? _0x122g : _0x122g.games || [];
  return _0x7f86df
    .filter((g) => g && g.name && g.author && g.file)
    .map((g) => ({
      source: sourceName,
      name: g.name,
      url: _repoUrl(g.author) + g.file,
      cover: g.cover_author
        ? _repoUrl(g.cover_author) + g.cover_file
        : _tileCover(g.name),
    }));
}
function _finalizeGamesCatalog(all) {
  all.forEach((g) => {
    g._norm = _normalizeGameName(g.name);
    g.displayName = g.name;
    if (g.source === "gn-math") {
      g.displayName = `${g.name} (gn-math)`;
    } else if (g.source === "seraph") {
      g.displayName = `${g.name} (seraph)`;
    } else if (g.source === "ugs") {
      g.displayName = `${g.name} (ugs)`;
    } else if (g.source === "ckv") {
      g.displayName = `${g.name} (ckv)`;
    } else if (g.source === "lumin") {
      const _0x26ec =
        g.id && g.id.includes("/") ? g.id.split("/")[0] : g.source;
      g.displayName = `${g.name} (${_0x26ec})`;
    }
  });
  const _0x76fb0c = new Intl.Collator(undefined, {
    sensitivity: "base",
  });
  all.sort((a, b) => _0x76fb0c.compare(a.displayName, b.displayName));
  return all;
}
async function _ensureGamesCatalog() {
  if (!_gamesState.all) {
    if (!_gamesState.fetchPromise) {
      _gamesState.fetchPromise = (async () => {
        const _0x498bda = await _loadGamesCacheEntry(
          "games",
          (g) => g && typeof g === "object",
        );
        let _0x83c6eb = false,
          _0xeced = false,
          _0x8_0x740 = false,
          _0x2d0f4b = false;
        const [lumin, gnm, seraph, ugs, ckv] = await Promise.all([
          _fetchAllLuminGames()["catch"](() => []),
          _0x498bda && Array.isArray(_0x498bda.gnm)
            ? _0x498bda.gnm
            : _fetchAllGnmGames()["catch"](() => {
                _0x83c6eb = true;
                return [];
              }),
          _0x498bda && Array.isArray(_0x498bda.seraph)
            ? _0x498bda.seraph
            : _fetchGmshelfGames("seraph")["catch"](() => {
                _0xeced = true;
                return [];
              }),
          _0x498bda && Array.isArray(_0x498bda.ugs)
            ? _0x498bda.ugs
            : _fetchNewGames("ugs")["catch"](() => {
                _0x8_0x740 = true;
                return [];
              }),
          _0x498bda && Array.isArray(_0x498bda.ckv)
            ? _0x498bda.ckv
            : _fetchNewGames("ckv")["catch"](() => {
                _0x2d0f4b = true;
                return [];
              }),
        ]);
        const _0x32723e = {
          ...(_0x498bda || {}),
        };
        if (!_0x83c6eb) _0x32723e.gnm = gnm;
        if (!_0xeced) _0x32723e.seraph = seraph;
        if (!_0x8_0x740) _0x32723e.ugs = ugs;
        if (!_0x2d0f4b) _0x32723e.ckv = ckv;
        if (Object.keys(_0x32723e).length > 0) {
          await _saveGamesCacheEntry("games", _0x32723e);
        }
        const _0xg3620g = new Set();
        const _0xe973ag = lumin.filter((g) => {
          if (_0xg3620g.has(g.id)) return false;
          _0xg3620g.add(g.id);
          return true;
        });
        const _0x0e6a = [..._0xe973ag, ...gnm, ...seraph, ...ugs, ...ckv];
        _gamesState.all = _finalizeGamesCatalog(_0x0e6a);
      })();
      _gamesState.fetchPromise["catch"](() => {
        _gamesState.fetchPromise = null;
      });
    }
    await _gamesState.fetchPromise;
  }
  _gamesState.matches = _filterByName(_gamesState.all, _gamesKeyword);
}
function _gameCardImg(src, alt) {
  const _0x57e = Array.isArray(src) ? src.slice() : [src];
  if (!_0x57e.length) {
    const ph = document.createElement("div");
    ph.className = "game-card-placeholder";
    return ph;
  }
  const _0x7491b = document.createElement("img");
  _0x7491b.className = "game-card-img";
  _0x7491b.alt = alt;
  _0x7491b.loading = "lazy";
  _0x7491b.decoding = "async";
  const _0x7dc5cc = () => {
    if (!_0x57e.length) {
      const ph = document.createElement("div");
      ph.className = "game-card-placeholder";
      _0x7491b.replaceWith(ph);
      return;
    }
    _0x7491b.src = _0x57e.shift();
  };
  _0x7491b.onerror = _0x7dc5cc;
  _0x7dc5cc();
  return _0x7491b;
}
function _buildGameCard(g) {
  const _0xd65ddc = document.createElement("button");
  _0xd65ddc.className = "game-card";
  const _0x2c76b = _gamesImgCache.get(g);
  if (_0x2c76b) {
    _0xd65ddc.appendChild(_gameCardImg(_0x2c76b, g.displayName));
  } else {
    const _0x7bc61c = document.createElement("div");
    _0x7bc61c.className = "game-card-placeholder";
    _0xd65ddc.appendChild(_0x7bc61c);
    const _0x66a = _gamesLoadGen;
    _resolveGameImgSrc(g)
      .then((src) => {
        if (!src || _0x66a !== _gamesLoadGen || !_0x7bc61c.isConnected) return;
        _0x7bc61c.replaceWith(_gameCardImg(src, g.displayName));
      })
      ["catch"](() => {});
  }
  const _0xb7ce = document.createElement("div");
  _0xb7ce.className = "game-card-name";
  const _0xd4bee = document.createElement("span");
  _0xd4bee.textContent = g.displayName;
  _0xb7ce.appendChild(_0xd4bee);
  _0xd65ddc.appendChild(_0xb7ce);
  _0xd65ddc.onclick = _gameCardOnClick(g);
  return _0xd65ddc;
}
async function _resolveGameImgSrc(g) {
  if (_gamesImgCache.has(g)) return _gamesImgCache.get(g);
  const _0x9_0xeg0 =
    g.source === "lumin"
      ? await Lumin.getImageUrl(g.image_token)["catch"](() => null)
      : Array.isArray(g.cover)
        ? g.cover
        : g.cover.replace("{COVER_URL}", g._covers);
  if (_0x9_0xeg0) _gamesImgCache.set(g, _0x9_0xeg0);
  return _0x9_0xeg0;
}
function _gameCardOnClick(g) {
  if (g.source === "lumin") return () => openGamePlayer(g.id);
  const _0x10_0xff2 =
    g.source === "gn-math"
      ? g._html + "/" + g.url.replace("{HTML_URL}/", "")
      : g.url;
  return () => openDirectGame(g.source, g.name, _0x10_0xff2);
}
const _gamesVirt = _makeGridVirtualizer(
  "gamesGridWrap",
  "gamesGridSizer",
  "gamesGrid",
  (g) => _buildGameCard(g),
);
function _updateGamesCount() {
  document.getElementById("gamesCount").textContent = _gamesState.matches
    ? _gamesState.matches.length.toLocaleString() + " Total"
    : "";
}
function _renderGameSkeletons(grid, count) {
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const _0xe37eb = document.createElement("div");
    _0xe37eb.className = "game-card skeleton";
    const _0x7b857f = document.createElement("div");
    _0x7b857f.className = "game-card-placeholder";
    _0xe37eb.appendChild(_0x7b857f);
    grid.appendChild(_0xe37eb);
  }
}
function _fillingSkeletonCount(wrap, _0x9cf53a, _0x955dbd) {
  _0x9cf53a = 155;
  _0x955dbd = 8;
  const _0x0916ca = Math.max(
    1,
    Math.floor((wrap.clientWidth + _0x955dbd) / (_0x9cf53a + _0x955dbd)),
  );
  const _0xe64c7d = (_0x9cf53a * 9) / 16 + 40;
  const _0xa_0xfc3 = Math.max(
    1,
    Math.ceil((wrap.clientHeight * 1.6) / (_0xe64c7d + _0x955dbd)),
  );
  return _0x0916ca * _0xa_0xfc3;
}
function _renderGamesList() {
  const _0x9b91d = document.getElementById("gamesGrid");
  _updateGamesCount();
  const _0x911c3f = _gamesState.matches;
  if (!_0x911c3f || !_0x911c3f.length) {
    _gamesVirt.reset();
    _gamesVirt.enterFlow();
    _0x9b91d.innerHTML = '<div class="games-loading">no results</div>';
    return;
  }
  if (!document.getElementById("gamesScreen").classList.contains("open"))
    return;
  _gamesVirt.exitFlow();
  _gamesVirt.setItems(_0x911c3f);
}
async function _loadFilteredGames(gen, grid, wrap, opts) {
  const _0x612b = opts.getList();
  if (_0x612b) {
    _gamesVirt.exitFlow();
    _gamesState.matches = _filterByName(_0x612b, _gamesKeyword);
    _renderGamesList();
    return;
  }
  _gamesVirt.enterFlow();
  _renderGameSkeletons(grid, _fillingSkeletonCount(wrap));
  document.getElementById("gamesCount").textContent = "";
  try {
    await opts.ensureLoaded();
  } catch (e) {
    if (gen === _gamesLoadGen) {
      _gamesVirt.enterFlow();
      grid.innerHTML = `<div class="games-loading">${opts.errorMsg}</div>`;
    }
    return;
  }
  if (gen !== _gamesLoadGen) return;
  opts.onLoaded?.();
  _gamesState.matches = _filterByName(opts.getList(), _gamesKeyword);
  _renderGamesList();
}
async function _gamesReload(keyword) {
  _gamesKeyword = keyword || null;
  const _0xfaa = ++_gamesLoadGen;
  _gamesScrollTop = 0;
  const _0xb3_0x6d6 = document.getElementById("gamesGrid");
  const _0x64f8e = document.getElementById("gamesGridWrap");
  _gamesVirt.reset();
  _0x64f8e.scrollTop = 0;
  if (_cloudEnabled) {
    return _loadFilteredGames(_0xfaa, _0xb3_0x6d6, _0x64f8e, {
      getList: () => (_cloudGames.length ? _cloudGames : null),
      ensureLoaded: async () => {
        _cloudGames = await loadCloudGames();
      },
      errorMsg: "failed to load cloud games",
    });
  }
  return _loadFilteredGames(_0xfaa, _0xb3_0x6d6, _0x64f8e, {
    getList: () => _gamesState.all,
    ensureLoaded: _ensureGamesCatalog,
    errorMsg: "failed to load",
    onLoaded: () => {
      _gamesLoaded = true;
    },
  });
}
function openGames() {
  document.getElementById("gamesScreen").classList.add("open");
  if (!_gamesLoaded) {
    _gamesReload(null);
  } else if (!_gamesVirt.isMounted()) {
    _renderGamesList();
    _gamesVirt.restore(_gamesScrollTop);
  }
}
function closeGames() {
  const _0xf2_0x33b = document.getElementById("gamesScreen");
  _gamesScrollTop = _gamesVirt.scrollTop();
  _0xf2_0x33b.classList.remove("open");
  setTimeout(() => {
    if (!_0xf2_0x33b.classList.contains("open")) {
      _gamesVirt.clear();
    }
  }, 450);
}
let _gamePlayerGen = 0;
let _skipNextGameAdBlockInject = false;
let _gamepadDetectionInterval = null;
function _startGamepadDetection() {
  if (_gamepadDetectionInterval) return;
  const _0x7ffdc = () => {
    const _0xg865f = navigator.getGamepads ? navigator.getGamepads() : [];
    let _0xcc_0xd8a = false;
    for (let i = 0; i < _0xg865f.length; i++) {
      if (_0xg865f[i] && _0xg865f[i].connected) {
        _0xcc_0xd8a = true;
        break;
      }
    }
    const _0x713d8e = document.getElementById("gamePlayerController");
    if (_0x713d8e) {
      _0x713d8e.classList.toggle("hidden", !_0xcc_0xd8a);
    }
  };
  _0x7ffdc();
  _gamepadDetectionInterval = setInterval(_0x7ffdc, 1000);
}
function _stopGamepadDetection() {
  if (_gamepadDetectionInterval) {
    clearInterval(_gamepadDetectionInterval);
    _gamepadDetectionInterval = null;
  }
  const _0x9b967b = document.getElementById("gamePlayerController");
  if (_0x9b967b) {
    _0x9b967b.classList.add("hidden");
  }
}
function _openGamePlayerShell(label) {
  _gamePlayerGen++;
  const _0x3203cd = _gamePlayerGen;
  const _0x665g3d = document.getElementById("gamePlayer");
  const _0x1254c = document.getElementById("gameFrame");
  const _0xbc18a = document.getElementById("gamePlayerLoading");
  const _0x7675ec = document.getElementById("gamePlayerId");
  if (_cloudSession) teardownCloud(true);
  document.getElementById("cloudVideoWrap").classList.remove("visible");
  _exitStaleFullscreen(
    _cloudSession ? document.getElementById("cloudVideoWrap") : _0x1254c,
  );
  _0x7675ec.textContent = label;
  _0x1254c.classList.remove("visible");
  _0x1254c.src = "about:blank";
  _0xbc18a.classList.remove("hidden");
  _0xbc18a.textContent = "loading…";
  _0x665g3d.classList.add("open");
  _startGamepadDetection();
  return {
    gf: _0x1254c,
    loading: _0xbc18a,
    gen: _0x3203cd,
  };
}
function _dirOf(url) {
  const u = new URL(url);
  u.search = "";
  u.hash = "";
  u.pathname = u.pathname.substring(0, u.pathname.lastIndexOf("/") + 1);
  return u.toString();
}
function _withBaseHref(html, baseUrl) {
  if (new RegExp("<base[^>]*>", "i").test(html)) return html;
  if (new RegExp("<head[^>]*>", "i").test(html))
    return html.replace(
      new RegExp("<head([^>]*)>", "i"),
      `<head$1><base href="${baseUrl}">`,
    );
  if (new RegExp("<html[^>]*>", "i").test(html))
    return html.replace(
      new RegExp("<html([^>]*)>", "i"),
      `<html$1><head><base href="${baseUrl}"></head>`,
    );
  return `<base href="${baseUrl}">` + html;
}
function _gameAdBlockInit() {
  const _0x32g68b = window.atob;
  window.atob = function (s) {
    const d = _0x32g68b(s);
    return typeof d === "string" && d.includes("[AV][boot] ") ? null : d;
  };
  const _0x7420ff = setInterval(() => {
    try {
      document.getElementById("sidebarad1")?.remove();
      document.getElementById("sidebarad2")?.remove();
      clearInterval(_0x7420ff);
    } catch {}
  }, 1000);
}
function _ADBLOCKIT(html) {
  const _0x144afb = `<script>(${_gameAdBlockInit.toString()})();</script>`;
  if (new RegExp("<head[^>]*>", "i").test(html))
    return html.replace(
      new RegExp("<head([^>]*)>", "i"),
      `<head$1>${_0x144afb}`,
    );
  if (new RegExp("<html[^>]*>", "i").test(html))
    return html.replace(
      new RegExp("<html([^>]*)>", "i"),
      `<html$1><head>${_0x144afb}</head>`,
    );
  return _0x144afb + html;
}
function _injectGameAdBlock(iframe) {
  try {
    const _0xf755c = iframe.contentDocument || iframe.contentWindow.document;
    if (!_0xf755c) return;
    const s = _0xf755c.createElement("script");
    s.textContent = `(${_gameAdBlockInit.toString()})();`;
    _0xf755c.documentElement.appendChild(s);
  } catch (e) {}
}
document.getElementById("gameFrame").addEventListener("load", function () {
  if (_skipNextGameAdBlockInject) {
    _skipNextGameAdBlockInject = false;
    return;
  }
  _injectGameAdBlock(this);
});
function _unwrapModuleContent(html) {
  const _0xed6c2a = html.match(
    new RegExp(
      "<Content[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/Content>",
      "i",
    ),
  );
  if (_0xed6c2a) return _0xed6c2a[1];
  if (new RegExp("^\\s*<Module>", "i").test(html)) {
    const _0x8f3b = html.search(new RegExp("<!doctype html|<html", "i"));
    if (_0x8f3b !== -1) return html.slice(_0x8f3b);
  }
  return html;
}
async function openDirectGame(source, name, url) {
  const {
    gf: gf,
    loading: loading,
    gen: gen,
  } = _openGamePlayerShell(`${source}/${name}`);
  try {
    const _0x4f7ed = await fetch(url);
    const _0x39361d = _unwrapModuleContent(await _0x4f7ed.text());
    if (gen !== _gamePlayerGen) return;
    gf.onload = () => {
      if (gen !== _gamePlayerGen) return;
      loading.classList.add("hidden");
      gf.classList.add("visible");
    };
    const _0xb800b = gf.contentDocument;
    _0xb800b.open();
    _skipNextGameAdBlockInject = true;
    _0xb800b.write(_ADBLOCKIT(_withBaseHref(_0x39361d, _dirOf(url))));
    _0xb800b.close();
  } catch (e) {
    if (gen === _gamePlayerGen) loading.textContent = "failed to load";
  }
}
async function openGamePlayer(gameId) {
  const { gf: gf, loading: loading, gen: gen } = _openGamePlayerShell(gameId);
  try {
    await _initLumin();
    const { url: url } = await Lumin.getGameUrl(gameId);
    const _0xdadb = await fetch(url);
    const _0x11_0x3ff = await _0xdadb.text();
    if (gen !== _gamePlayerGen) return;
    gf.onload = () => {
      if (gen !== _gamePlayerGen) return;
      loading.classList.add("hidden");
      gf.classList.add("visible");
    };
    const _0xaffc2c = gf.contentDocument;
    _0xaffc2c.open();
    _skipNextGameAdBlockInject = true;
    _0xaffc2c.write(_ADBLOCKIT(_withBaseHref(_0x11_0x3ff, _dirOf(url))));
    _0xaffc2c.close();
  } catch (e) {
    if (gen === _gamePlayerGen) loading.textContent = "failed to load";
  }
}
function closeGamePlayer() {
  resetGameCloseConfirm();
  _cloudEndedActive = false;
  _stopGamepadDetection();
  const _0xdg60dd = document.getElementById("gamePlayer");
  const _0x9f43gc = document.getElementById("gameFrame");
  const _0x4e308c = document.getElementById("cloudVideoWrap");
  const _0xe6c = document.getElementById("gamePlayerLoading");
  _0xdg60dd.classList.remove("open");
  _0x9f43gc.src = "about:blank";
  _0x9f43gc.classList.remove("visible");
  _0x4e308c.classList.remove("visible");
  _0xe6c.classList.remove("hidden");
  _0xe6c.textContent = "loading…";
  document.getElementById("gamePlayerId").textContent = "";
  document.getElementById("gamePlayerTimeLeft").textContent = "";
  try {
    Lumin.endGame();
  } catch (e) {}
  if (_cloudEnabled && !_cloudSession) {
    _gamesState.matches = _filterByName(_cloudGames, _gamesKeyword);
    _updateGamesCount();
    _gamesVirt.setItems(_gamesState.matches);
  }
}
function _exitStaleFullscreen(expectedTarget) {
  if (
    document.fullscreenElement &&
    document.fullscreenElement !== expectedTarget
  ) {
    document.exitFullscreen()["catch"](() => {});
  }
}
function toggleGameFullscreen() {
  const _0xg07b4d = _cloudSession
    ? document.getElementById("cloudVideoWrap")
    : document.getElementById("gameFrame");
  if (!document.fullscreenElement) _0xg07b4d.requestFullscreen();
  else document.exitFullscreen();
}
function _lockCloudKeyboard() {
  try {
    navigator.keyboard?.lock?.();
  } catch {}
}
function _unlockCloudKeyboard() {
  try {
    navigator.keyboard?.unlock?.();
  } catch {}
}
document.addEventListener(
  "fullscreenchange",
  function _gfsFc() {
    const _0x0f6ca = document.getElementById("gamePlayerFsIcon");
    if (_0x0f6ca) {
      _0x0f6ca.innerHTML = document.fullscreenElement
        ? '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>'
        : '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>';
    }
    if (_cloudSession) {
      if (document.fullscreenElement) _lockCloudKeyboard();
      else _unlockCloudKeyboard();
    }
  },
  true,
);
function toggleControllerMapper() {
  const _0x42f2b = document.getElementById("controllerMapperModal");
  const _0x56bee = document.getElementById("cloudVideoWrap");
  if (!_0x42f2b.classList.contains("open")) {
    _0x42f2b.classList.add("open");
    if (_0x56bee) _0x56bee.classList.remove("visible");
    updateMapperUI();
  } else {
    stopRemapping();
    _0x42f2b.classList.remove("open");
    if (_0x56bee) _0x56bee.classList.add("visible");
  }
}
function closeControllerMapper() {
  toggleControllerMapper();
}
function updateMapperUI() {
  const _0xaf899g = document.getElementById("leftStickToggle");
  const _0x6f2 = document.getElementById("rightStickToggle");
  if (_0xaf899g) _0xaf899g.textContent = controllerMap.leftStick;
  if (_0x6f2) _0x6f2.textContent = controllerMap.rightStick;
  document.querySelectorAll(".button-map").forEach((btn) => {
    const _0x9g811d = parseInt(btn.dataset.button);
    const _0x18ddfb = controllerMap.buttons[_0x9g811d];
    const _0x4b32a = btn.querySelector(".key-display");
    if (!_0x4b32a) return;
    let _0x2aa = null;
    if (_0x18ddfb === "MOUSE_LEFT") {
      _0x2aa = "Mouse Left";
    } else if (_0x18ddfb === "MOUSE_RIGHT") {
      _0x2aa = "Mouse Right";
    } else if (_0x18ddfb === "MOUSE_MIDDLE") {
      _0x2aa = "Mouse Middle";
    } else if (_0x18ddfb && _0x18ddfb.name) {
      _0x2aa = _0x18ddfb.name;
    }
    _0x4b32a.textContent = _0x2aa || "-";
    btn.classList.toggle("mapped", !!_0x2aa);
    btn.classList.toggle("unmapped", !_0x2aa);
  });
}
const _uiRoot = (typeof shadowRoot !== "undefined" && shadowRoot) || document;
_uiRoot.addEventListener("click", (e) => {
  const trash = e.target?.closest?.(".cm-trash");
  if (trash) {
    e.preventDefault();
    e.stopPropagation();
    clearMapping(trash.closest(".button-map"));
    return;
  }
  const row = e.target?.closest?.(".button-map");
  if (row) startRemapping(row);
});
let remappingButton = null;
let remappingCleanup = null;
const _CAP = {
  capture: true,
};
const _KEY_LABELS = {
  " ": "Space",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Escape: "Esc",
  Control: "Ctrl",
  ContextMenu: "Menu",
};
const _MOUSE_NAMES = {
  0: "MOUSE_LEFT",
  1: "MOUSE_MIDDLE",
  2: "MOUSE_RIGHT",
};
const _keyLabel = (e) =>
  _KEY_LABELS[e.key] || (e.key.length === 1 ? e.key.toUpperCase() : e.key);
const _kill = (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
};
const _swallowNext = (type, match) => {
  const fn = (ev) => {
    if (match && !match(ev)) return;
    _kill(ev);
    window.removeEventListener(type, fn, _CAP);
  };
  window.addEventListener(type, fn, _CAP);
  setTimeout(() => window.removeEventListener(type, fn, _CAP), 1000);
};
function stopRemapping() {
  if (remappingCleanup) remappingCleanup();
  remappingCleanup = null;
  if (remappingButton) remappingButton.classList.remove("remapping");
  remappingButton = null;
  updateMapperUI();
}
function assignMapping(buttonElement, value) {
  const i = parseInt(buttonElement.dataset.button);
  const _0x3c65bd = controllerMap.buttons[i];
  const _0xc9d7f =
    (_0x3c65bd && typeof _0x3c65bd === "object" && _0x3c65bd.label) ||
    `Button ${i}`;
  controllerMap.buttons[i] =
    typeof value === "string"
      ? value
      : {
          ...value,
          label: _0xc9d7f,
        };
  saveControllerMap();
  stopRemapping();
}
function clearMapping(buttonElement) {
  if (!buttonElement) return;
  controllerMap.buttons[parseInt(buttonElement.dataset.button)] = null;
  saveControllerMap();
  stopRemapping();
}
function startRemapping(buttonElement) {
  if (remappingButton === buttonElement) return;
  stopRemapping();
  remappingButton = buttonElement;
  buttonElement.classList.add("remapping");
  const _0x9d2a = buttonElement.querySelector(".key-display");
  if (_0x9d2a) _0x9d2a.textContent = "...";
  const _0x3ab = (e) => {
    _kill(e);
    if (e.repeat) return;
    const _0xce3bcf = e.keyCode || e.which;
    _swallowNext("keyup", (ev) => (ev.keyCode || ev.which) === _0xce3bcf);
    assignMapping(buttonElement, {
      key: _0xce3bcf,
      name: _keyLabel(e),
    });
  };
  const _0x29d3a = (e) => {
    if (e.target?.closest?.(".cm-trash")) return;
    if (e.target?.closest?.(".button-map") !== buttonElement) {
      stopRemapping();
      return;
    }
    const _0x31ed = _MOUSE_NAMES[e.button];
    if (!_0x31ed) return;
    _kill(e);
    _swallowNext("mouseup");
    _swallowNext("click");
    if (e.button === 2) _swallowNext("contextmenu");
    assignMapping(buttonElement, _0x31ed);
  };
  window.addEventListener("keydown", _0x3ab, _CAP);
  _uiRoot.addEventListener("mousedown", _0x29d3a, _CAP);
  remappingCleanup = () => {
    window.removeEventListener("keydown", _0x3ab, _CAP);
    _uiRoot.removeEventListener("mousedown", _0x29d3a, _CAP);
  };
}
function toggleStickMode(stick) {
  if (stick === "left") {
    controllerMap.leftStick =
      controllerMap.leftStick === "WASD" ? "MOUSE" : "WASD";
  } else {
    controllerMap.rightStick =
      controllerMap.rightStick === "WASD" ? "MOUSE" : "WASD";
  }
  saveControllerMap();
  updateMapperUI();
}
function resetControllerMap() {
  if (confirm("Reset all controller mappings to defaults?")) {
    controllerMap = JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP));
    saveControllerMap();
    updateMapperUI();
  }
}
document.getElementById("gamesSearch").addEventListener("input", function () {
  clearTimeout(_gamesSearchTimer);
  const _0x9d98cb = this.value.trim();
  _gamesSearchTimer = setTimeout(() => _gamesReload(_0x9d98cb || null), 350);
});
let _cloudEnabled = false;
let _cloudGames = [];
let _cloudSession = null;
let _cloudPc = null;
let _cloudDc = null;
let _cloudWs = null;
let _cloudTimers = [];
let _cloudInputActive = false;
let _cloudInputHandlers = null;
let _cloudStarting = false;
let _cloudJitterHandlers = null;
let _cloudEndedActive = false;
let _cloudPendingCandidates = [];
let _cloudMicStreamPromise = null;
const DEFAULT_CONTROLLER_MAP = {
  buttons: {
    0: {
      key: 32,
      name: "Space",
      label: "Jump/Interact",
    },
    1: {
      key: 69,
      name: "E",
      label: "Use/Interact",
    },
    2: {
      key: 82,
      name: "R",
      label: "Reload",
    },
    3: {
      key: 70,
      name: "F",
      label: "Action",
    },
    4: {
      key: 81,
      name: "Q",
      label: "Ability/Lean Left",
    },
    5: {
      key: 69,
      name: "E",
      label: "Ability/Lean Right",
    },
    6: {
      key: 16,
      name: "Shift",
      label: "Sprint/Aim",
    },
    7: "MOUSE_LEFT",
    8: {
      key: 27,
      name: "Escape",
      label: "Menu",
    },
    9: {
      key: 13,
      name: "Enter",
      label: "Pause",
    },
    10: {
      key: 86,
      name: "V",
      label: "Melee",
    },
    11: {
      key: 71,
      name: "G",
      label: "Grenade",
    },
    12: {
      key: 38,
      name: "↑",
      label: "Up",
    },
    13: {
      key: 40,
      name: "↓",
      label: "Down",
    },
    14: {
      key: 37,
      name: "←",
      label: "Left",
    },
    15: {
      key: 39,
      name: "→",
      label: "Right",
    },
  },
  leftStick: "WASD",
  rightStick: "MOUSE",
};
let controllerMap = (() => {
  try {
    const saved = localStorage.getItem("CTRLLERMAP");
    return saved
      ? JSON.parse(saved)
      : JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_CONTROLLER_MAP));
  }
})();
const saveControllerMap = () => {
  try {
    localStorage.setItem("CTRLLERMAP", JSON.stringify(controllerMap));
  } catch {}
};
function getBase(_0x5fc) {
  if (window.devMode) {
    _0x5fc = window.serverList?.[0] || "cdn.vipersfutbol.com";
  } else if (window.wlspServer?.includes("://")) {
    _0x5fc = window.wlspServer.split("://")[1].split("/")[0];
  } else {
    _0x5fc = "cdn.vipersfutbol.com";
  }
  if (_0x5fc.includes("://")) return _0x5fc.replace("/wi/", "");
  return `https://${_0x5fc}`;
}
window.getBase = getBase;
async function stratusApi(path, method = "GET", body) {
  const _0x500b = `${getBase()}/stratus`;
  const _0xf3ed = await fetch(`${_0x500b}/${path}`, {
    method: method,
    headers: body
      ? {
          "content-type": "application/json",
        }
      : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const _0xdc035f = await _0xf3ed.json()["catch"](() => ({}));
  if (!_0xf3ed.ok && !_0xdc035f.error)
    _0xdc035f.error = `HTTP ${_0xf3ed.status}`;
  return _0xdc035f;
}
function setCloudPhase(name, detail, spin) {
  document.getElementById("cloudPhase").textContent = name;
  document.getElementById("cloudPhaseDetail").textContent = detail || "";
  document.getElementById("cloudSpinner").classList.toggle("hidden", !spin);
}
function _quitCloudSession(uuid) {
  if (!uuid) return;
  fetch(`${getBase()}/stratus/session/${uuid}/quit`, {
    credentials: "include",
    method: "POST",
    keepalive: true,
  })["catch"](() => {});
}
function teardownCloud(quit) {
  if (quit && _cloudSession) _quitCloudSession(_cloudSession.uuid);
  _cloudInputActive = false;
  _cloudStarting = false;
  _unlockCloudKeyboard();
  if (_cloudInputHandlers) {
    const {
      mouseMoveHandler: mouseMoveHandler,
      mouseButtonHandler: mouseButtonHandler,
      contextMenuHandler: contextMenuHandler,
      wheelHandler: wheelHandler,
      videoClickHandler: videoClickHandler,
      keyDownHandler: keyDownHandler,
      keyUpHandler: keyUpHandler,
      video: video,
      pointerLockChangeHandler: pointerLockChangeHandler,
      relockHint: relockHint,
      invalidateRect: invalidateRect,
      gamepadState: gamepadState,
    } = _cloudInputHandlers;
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mousedown", mouseButtonHandler);
    document.removeEventListener("mouseup", mouseButtonHandler);
    document.removeEventListener("contextmenu", contextMenuHandler);
    document.removeEventListener("wheel", wheelHandler);
    video.removeEventListener("click", videoClickHandler);
    document.removeEventListener("keydown", keyDownHandler, true);
    document.removeEventListener("keyup", keyUpHandler, true);
    document.removeEventListener("pointerlockchange", pointerLockChangeHandler);
    window.removeEventListener("resize", invalidateRect);
    relockHint.removeEventListener("click", videoClickHandler);
    relockHint.classList.remove("visible");
    if (gamepadState && gamepadState.pollInterval) {
      clearInterval(gamepadState.pollInterval);
      gamepadState.pollInterval = null;
      gamepadState.connected.clear();
    }
    _cloudInputHandlers = null;
  }
  if (_cloudJitterHandlers) {
    const { video: video, bumpJitterTarget: bumpJitterTarget } =
      _cloudJitterHandlers;
    video.removeEventListener("waiting", bumpJitterTarget);
    video.removeEventListener("stalled", bumpJitterTarget);
    _cloudJitterHandlers = null;
  }
  _cloudTimers.forEach((t) => {
    clearInterval(t);
    clearTimeout(t);
  });
  _cloudTimers = [];
  try {
    _cloudDc && _cloudDc.close();
  } catch {}
  try {
    _cloudPc && _cloudPc.close();
  } catch {}
  try {
    _cloudWs && _cloudWs.close();
  } catch {}
  _cloudDc = null;
  _cloudPc = null;
  _cloudWs = null;
  _cloudSession = null;
  _cloudPendingCandidates = [];
  document.exitPointerLock?.();
  const _0x51ce = document.getElementById("cloudVideo");
  if (_0x51ce) _0x51ce.srcObject = null;
  if (_cloudMicStreamPromise) {
    _cloudMicStreamPromise
      .then((stream) => {
        stream && stream.getTracks().forEach((t) => t.stop());
      })
      ["catch"](() => {});
  }
  _cloudMicStreamPromise = null;
}
let _cloudGamesFetchPromise = null;
async function loadCloudGames() {
  const _0x8gac2d = await _loadGamesCacheEntry("cloudGames", Array.isArray);
  if (_0x8gac2d) return _0x8gac2d;
  if (!_cloudGamesFetchPromise) {
    _cloudGamesFetchPromise = (async () => {
      const r = await stratusApi("games");
      if (r.error) throw new Error(r.error);
      const _0x12_0xc9e = (r.games || []).map((g) => ({
        source: "cloud",
        name: g.name,
        key: g.key,
        cover: g.cover || g.image,
        displayName: g.name,
        _norm: _normalizeGameName(g.name),
      }));
      await _saveGamesCacheEntry("cloudGames", _0x12_0xc9e);
      return _0x12_0xc9e;
    })();
    _cloudGamesFetchPromise["catch"](() => {
      _cloudGamesFetchPromise = null;
    });
  }
  return _cloudGamesFetchPromise;
}
function toggleCloudGames() {
  _cloudEnabled = !_cloudEnabled;
  document.getElementById("cloudToggle").classList.toggle("on", _cloudEnabled);
  _gamesReload(_gamesKeyword);
}
document
  .getElementById("cloudToggle")
  .addEventListener("click", toggleCloudGames);
async function startCloudGame(gameKey, gameName) {
  if (_cloudStarting) return;
  _cloudStarting = true;
  resetGameCloseConfirm();
  teardownCloud(true);
  _cloudMicStreamPromise = navigator.mediaDevices
    .getUserMedia({
      audio: true,
    })
    ["catch"](() => null);
  _gamePlayerGen++;
  const _0xd59f8f = document.getElementById("gamePlayer");
  const _0x3e_0xc4c = document.getElementById("gameFrame");
  const _0x82b3ac = document.getElementById("cloudVideoWrap");
  const _0x6c_0x961 = document.getElementById("cloudVideo");
  const _0x07e4d = document.getElementById("cloudOverlay");
  const _0xfgcf9e = document.getElementById("gamePlayerLoading");
  const _0x301b = document.getElementById("gamePlayerId");
  _0x301b.textContent = `cloud/${gameName}`;
  document.getElementById("gamePlayerTimeLeft").textContent = "";
  _exitStaleFullscreen(_0x82b3ac);
  _0x3e_0xc4c.classList.remove("visible");
  _0x3e_0xc4c.src = "about:blank";
  _0xfgcf9e.classList.add("hidden");
  _0x82b3ac.classList.add("visible");
  _0x6c_0x961.srcObject = null;
  _0x6c_0x961.muted = true;
  _0x07e4d.classList.remove("hidden");
  _0xd59f8f.classList.add("open");
  try {
    const _0xaec12c = await stratusApi("status");
    const _0x980gc = _0xaec12c.pool?.idle || 0;
    setCloudPhase("requesting game", `${_0x980gc} idle accounts`, true);
    const s = await stratusApi("session", "POST", {
      game_key: gameKey,
    });
    if (s.error) throw new Error(s.error);
    _cloudSession = {
      uuid: s.uuid,
      state: s.state,
      gameKey: gameKey,
      deadlineAt: null,
    };
    if (s.state === "queued") {
      setCloudPhase("queued", `position #${s.queue_pos ?? "?"}`, false);
      while (_cloudSession && _cloudSession.uuid === s.uuid) {
        await new Promise((r) => _cloudTimers.push(setTimeout(r, 2000)));
        if (!_cloudSession || _cloudSession.uuid !== s.uuid) break;
        const _0x98df5d = await stratusApi(`session/${_cloudSession.uuid}`);
        if (_0x98df5d.error) throw new Error(_0x98df5d.error);
        if (_0x98df5d.state === "finished_queue") break;
        setCloudPhase(
          "queued",
          `position #${_0x98df5d.queue_pos ?? "?"}`,
          false,
        );
      }
      if (!_cloudSession || _cloudSession.uuid !== s.uuid) return;
    }
    setCloudPhase("starting", "booting instance", true);
    const _0x3b4g = await stratusApi(
      `session/${_cloudSession.uuid}/start`,
      "POST",
      {},
    );
    if (_0x3b4g.error) throw new Error(_0x3b4g.error);
    _cloudSession.deadlineAt = Date.now() + _0x3b4g.max_seconds * 1000;
    _cloudSession.signalingWs = _0x3b4g.signaling_ws;
    _cloudSession.iceServers = _0x3b4g.ice_servers;
    await connectCloudSignaling(_0x3b4g.signaling_ws, _0x3b4g.ice_servers);
    const _0x7d2 = setInterval(() => {
      if (!_cloudSession || !_cloudSession.deadlineAt) return;
      const _0x919b6b = Math.max(
        0,
        Math.round((_cloudSession.deadlineAt - Date.now()) / 1000),
      );
      document.getElementById("gamePlayerTimeLeft").textContent =
        `${Math.floor(_0x919b6b / 60)}:${String(_0x919b6b % 60).padStart(2, "0")}`;
    }, 500);
    _cloudTimers.push(_0x7d2);
  } catch (e) {
    if (_cloudSession) _quitCloudSession(_cloudSession.uuid);
    _cloudSession = null;
    setCloudPhase("error", e.message, false);
    _cloudStarting = false;
  }
}
const SOCKET_RECONNECT_DELAY_MS = 2000;
const SOCKET_RECONNECT_MAX_TRIES = 2;
function connectCloudSignaling(signalingWs, iceServers, isReconnect) {
  return new Promise((resolve, reject) => {
    const _0x6d03a = signalingWs.split("/").pop();
    const _0x0b63ec = `${getBase()}/stratus`;
    const _0xc6e76g = new URL(_0x0b63ec);
    const _0xade9b =
      (_0xc6e76g.protocol === "https:" ? "wss://" : "ws://") +
      _0xc6e76g.host +
      _0xc6e76g.pathname.replace(new RegExp("\\/$", ""), "") +
      "/signal/" +
      _0x6d03a;
    const _0xad9a = new WebSocket(_0xade9b);
    _cloudWs = _0xad9a;
    _0xad9a.onopen = () => {
      if (_cloudWs !== _0xad9a) return;
      if (!isReconnect)
        setCloudPhase(
          "starting",
          "signal connected, waiting for instance",
          true,
        );
      _flushPendingCandidates();
    };
    _0xad9a.onerror = () => {
      if (_cloudWs === _0xad9a && !isReconnect)
        reject(new Error("signaling failed"));
    };
    _0xad9a.onclose = () => {
      if (_cloudWs !== _0xad9a) return;
      _cloudWs = null;
      if (_cloudSession && _cloudPc) attemptCloudReconnect();
      else if (!isReconnect) reject(new Error("signaling closed"));
    };
    _0xad9a.onmessage = async (ev) => {
      if (_cloudWs !== _0xad9a) return;
      let m;
      try {
        m = JSON.parse(ev.data);
      } catch {
        return;
      }
      switch (m.type) {
        case "game_ready":
          if (!_cloudPc) {
            setCloudPhase("connecting", "negotiating webrtc", true);
            await createCloudPeer(iceServers);
          }
          resolve();
          break;
        case "rtc_answer":
          try {
            await _cloudPc.setRemoteDescription(
              new RTCSessionDescription(m.sdp),
            );
          } catch {}
          break;
        case "rtc_candidate":
          try {
            await _cloudPc.addIceCandidate(new RTCIceCandidate(m.candidate));
          } catch {}
          break;
        case "ping":
          if (_0xad9a.readyState === 1)
            _0xad9a.send(
              JSON.stringify({
                type: "ping",
              }),
            );
          break;
        case "time_left":
          if (_cloudSession && typeof m.time_left === "number") {
            _cloudSession.deadlineAt = Date.now() + m.time_left * 1000;
          }
          break;
        case "game_cap":
          showCloudEndedScreen("time is up", m.message);
          break;
        case "game_ended":
          showCloudEndedScreen("session ended", m.message);
          break;
      }
    };
  });
}
function attemptCloudReconnect() {
  const _0x34cba = _cloudSession;
  if (!_0x34cba || _0x34cba.reconnecting) return;
  _0x34cba.reconnecting = true;
  _0x34cba.reconnectTries = 0;
  let _0x85geec = false;
  document.getElementById("cloudOverlay").classList.remove("hidden");
  const _0xfc8b = document.getElementById("cloudRelockHint");
  if (_0xfc8b) _0xfc8b.classList.remove("visible");
  setCloudPhase("reconnecting", "signal lost, retrying…", true);
  const _0xg17e = () => {
    if (!_cloudSession || _cloudSession !== _0x34cba || _0x85geec) return;
    _0x34cba.reconnectTries++;
    connectCloudSignaling(_0x34cba.signalingWs, _0x34cba.iceServers, true)
      .then(() => {
        if (_0x85geec || !_cloudSession || _cloudSession !== _0x34cba) return;
        _0x85geec = true;
        _0x34cba.reconnecting = false;
        if (_cloudPc && _cloudPc.connectionState === "connected") {
          document.getElementById("cloudOverlay").classList.add("hidden");
        } else {
          setCloudPhase("connecting", "reconnected, restoring stream…", true);
        }
      })
      ["catch"](() => {});
    const _0xbf645c = setTimeout(() => {
      if (_0x85geec || !_cloudSession || _cloudSession !== _0x34cba) return;
      if (_0x34cba.reconnectTries >= SOCKET_RECONNECT_MAX_TRIES) {
        _0x85geec = true;
        showCloudEndedScreen(
          "session ended",
          "lost connection to the game server",
        );
        return;
      }
      try {
        _cloudWs && _cloudWs.close();
      } catch {}
      _cloudWs = null;
      _0xg17e();
    }, SOCKET_RECONNECT_DELAY_MS);
    _cloudTimers.push(_0xbf645c);
  };
  _0xg17e();
}
function showCloudEndedScreen(title, detail) {
  if (!_cloudSession) return;
  teardownCloud(true);
  _cloudEndedActive = true;
  const _0xb516a = document.getElementById("cloudVideoWrap");
  const _0xaef82d = document.getElementById("cloudOverlay");
  _0xb516a.classList.add("visible");
  _0xaef82d.classList.remove("hidden");
  setCloudPhase(title, detail || "", false);
}
function cloudSigSend(obj) {
  if (_cloudWs && _cloudWs.readyState === 1) {
    _cloudWs.send(JSON.stringify(obj));
  } else if (obj.type === "rtc_candidate") {
    _cloudPendingCandidates.push(obj);
  }
}
function _flushPendingCandidates() {
  if (!_cloudPendingCandidates.length) return;
  const _0xf3_0x945 = _cloudPendingCandidates;
  _cloudPendingCandidates = [];
  _0xf3_0x945.forEach((obj) => cloudSigSend(obj));
}
async function createCloudPeer(iceServers, _0xeb4bc, _0xg376be, _0x385c2b) {
  const _0x9159dd = document.getElementById("cloudVideo");
  _cloudPc = new RTCPeerConnection({
    iceServers: iceServers,
    bundlePolicy: "max-bundle",
    rtcpMuxPolicy: "require",
    iceCandidatePoolSize: 4,
  });
  _cloudPc.addTransceiver("audio", {
    direction: "recvonly",
  });
  const _0xe62gc = _cloudPc.addTransceiver("video", {
    direction: "recvonly",
  });
  try {
    const _0x8422e = RTCRtpReceiver.getCapabilities?.("video");
    if (_0x8422e?.codecs?.length && _0xe62gc.setCodecPreferences) {
      const _0x4883a = _0x8422e.codecs.filter((c) =>
        new RegExp("h264", "i").test(c.mimeType),
      );
      const _0x639d1c = _0x8422e.codecs.filter((c) =>
        new RegExp("av1", "i").test(c.mimeType),
      );
      const _0x746bg = _0x8422e.codecs.filter(
        (c) => !new RegExp("h264|av1", "i").test(c.mimeType),
      );
      let _0xg2fac = false;
      try {
        if (_0x639d1c.length && navigator.mediaCapabilities?.decodingInfo) {
          const _0xfa08bb = await navigator.mediaCapabilities.decodingInfo({
            type: "webrtc",
            video: {
              contentType: "video/AV1",
              width: 1920,
              height: 1080,
              bitrate: 4000000,
              framerate: 30,
            },
          });
          _0xg2fac = !!(_0xfa08bb.powerEfficient && _0xfa08bb.smooth);
        }
      } catch {}
      _0xe62gc.setCodecPreferences(
        _0xg2fac
          ? [..._0x639d1c, ..._0x4883a, ..._0x746bg]
          : [..._0x4883a, ..._0x639d1c, ..._0x746bg],
      );
    }
  } catch {}
  _cloudDc = _cloudPc.createDataChannel("JYSDK", {
    id: 1,
    ordered: false,
    maxRetransmits: 0,
    priority: "high",
  });
  _cloudDc.onopen = () => {};
  const _0xa2_0xg4c = _cloudPc;
  const _0xff_0x595 = _cloudDc;
  _0xff_0x595.onclose = () => {
    if (_cloudDc !== _0xff_0x595 || !_cloudSession) return;
    showCloudEndedScreen("session ended", "lost the input channel");
  };
  _0xff_0x595.onerror = () => {
    if (_cloudDc !== _0xff_0x595 || !_cloudSession) return;
    showCloudEndedScreen("session ended", "input channel error");
  };
  _0xeb4bc = 0;
  _0xg376be = 200;
  _0x385c2b = 40;
  let _0xf4_0x9d4 = _0xeb4bc;
  let _0x66eaf = null;
  let _0xf81dc = null;
  let _0xcgcaag = null;
  const _0xb0ed = () => {
    for (const _0x4e5gb of [_0x66eaf, _0xf81dc]) {
      if (!_0x4e5gb) continue;
      try {
        if ("jitterBufferTarget" in _0x4e5gb)
          _0x4e5gb.jitterBufferTarget = _0xf4_0x9d4;
      } catch {}
      try {
        if ("playoutDelayHint" in _0x4e5gb)
          _0x4e5gb.playoutDelayHint = _0xf4_0x9d4 / 1000;
      } catch {}
    }
  };
  const _0xa361a = () => {
    if (_0xcgcaag) {
      clearTimeout(_0xcgcaag);
      _0xcgcaag = null;
    }
    _0xf4_0x9d4 = Math.min(_0xg376be, _0xf4_0x9d4 + _0x385c2b);
    _0xb0ed();
    _0xcgcaag = setTimeout(() => {
      _0xf4_0x9d4 = Math.max(_0xeb4bc, _0xf4_0x9d4 - _0x385c2b);
      _0xb0ed();
    }, 15000);
    _cloudTimers.push(_0xcgcaag);
  };
  _0x9159dd.addEventListener("waiting", _0xa361a);
  _0x9159dd.addEventListener("stalled", _0xa361a);
  let _0xb5978f = null;
  let _0x1c2b = null;
  const _0xed3a = setInterval(async () => {
    if (!_cloudPc || _cloudPc !== _0xa2_0xg4c) return;
    let _0x894f7c;
    try {
      _0x894f7c = await _0xa2_0xg4c.getStats();
    } catch {
      return;
    }
    let _0x7c56fa = null,
      _0x485ff = null,
      _0xc4c = null,
      _0xc3_0x0b5 = null;
    _0x894f7c.forEach((s) => {
      if (
        s.type === "candidate-pair" &&
        s.state === "succeeded" &&
        typeof s.currentRoundTripTime === "number"
      ) {
        _0x7c56fa = s.currentRoundTripTime * 1000;
      }
      if (s.type === "inbound-rtp" && s.kind === "video") {
        if (typeof s.jitter === "number") _0x485ff = s.jitter * 1000;
        if (typeof s.packetsLost === "number") _0xc4c = s.packetsLost;
        if (typeof s.freezeCount === "number") _0xc3_0x0b5 = s.freezeCount;
      }
    });
    const _0xda53ba =
      _0xc4c !== null && _0xb5978f !== null ? _0xc4c - _0xb5978f : 0;
    const _0x13ec1e =
      _0xc3_0x0b5 !== null && _0x1c2b !== null ? _0xc3_0x0b5 - _0x1c2b : 0;
    _0xb5978f = _0xc4c;
    _0x1c2b = _0xc3_0x0b5;
    const _0xf9b62b =
      (_0x7c56fa !== null && _0x7c56fa > 150) ||
      (_0x485ff !== null && _0x485ff > 40) ||
      _0xda53ba > 0;
    if (_0xf9b62b) {
      _0xa361a();
    } else if (_0x13ec1e > 0 && _0xf4_0x9d4 === _0xeb4bc) {
    }
  }, 3000);
  _cloudTimers.push(_0xed3a);
  _cloudJitterHandlers = {
    video: _0x9159dd,
    bumpJitterTarget: _0xa361a,
  };
  _cloudPc.ontrack = (ev) => {
    if (!_0x9159dd.srcObject) _0x9159dd.srcObject = new MediaStream();
    _0x9159dd.srcObject.addTrack(ev.track);
    if (ev.track.kind === "video") {
      _0x66eaf = ev.receiver;
      _0xb0ed();
    } else if (ev.track.kind === "audio") {
      _0xf81dc = ev.receiver;
      _0xb0ed();
    }
  };
  _cloudPc.onicecandidate = (ev) => {
    if (ev.candidate)
      cloudSigSend({
        type: "rtc_candidate",
        candidate: ev.candidate.toJSON(),
      });
  };
  let _0x3ba5f = null;
  const _0x1g0def = () => {
    if (_0x3ba5f) {
      clearTimeout(_0x3ba5f);
      _0x3ba5f = null;
    }
  };
  _0xa2_0xg4c.onconnectionstatechange = () => {
    if (_cloudPc !== _0xa2_0xg4c) return;
    const _0x8c66g = _0xa2_0xg4c.connectionState;
    if (_0x8c66g === "connected") {
      _0x1g0def();
      document.getElementById("cloudOverlay").classList.add("hidden");
      _0x9159dd.muted = false;
      _0x9159dd.play()["catch"](() => {});
      _cloudInputActive = true;
      _cloudStarting = false;
      setupCloudInput();
      if (document.fullscreenElement) _lockCloudKeyboard();
      return;
    }
    if (_0x8c66g === "disconnected") {
      if (!_0x3ba5f) {
        _0x3ba5f = setTimeout(() => {
          if (
            _cloudPc === _0xa2_0xg4c &&
            _0xa2_0xg4c.connectionState === "disconnected"
          )
            endCloudGame();
        }, 6000);
        _cloudTimers.push(_0x3ba5f);
      }
      return;
    }
    if (["failed", "closed"].includes(_0x8c66g)) {
      _0x1g0def();
      showCloudEndedScreen("session ended", "lost connection to the stream");
    }
  };
  try {
    const _0x7fc = _cloudMicStreamPromise && (await _cloudMicStreamPromise);
    if (_0x7fc) {
      const _0xd87aa = _0x7fc.getAudioTracks()[0];
      _cloudPc.addTrack(_0xd87aa);
    }
  } catch {}
  const _0x2f4fa = await _cloudPc.createOffer();
  await _cloudPc.setLocalDescription(_0x2f4fa);
  cloudSigSend({
    type: "rtc_offer",
    sdp: _0x2f4fa.sdp,
  });
}
function setupCloudInput() {
  if (_cloudInputHandlers) return;
  const _0x89b6d = document.getElementById("cloudVideo");
  let _0xdg4d = 0,
    _0x3d15a = 0,
    _0x45b34d = 0,
    _0x7f0a = 0,
    _0xc4_0x512 = 0;
  const _0xd9c = new Set();
  const _0xb6ecag = {
    connected: new Map(),
    pollInterval: null,
    deadzone: 0.15,
  };
  let _0x1738fa = null;
  const _0xec5f = () => {
    if (!_0x1738fa) {
      const r = _0x89b6d.getBoundingClientRect();
      const _0x3e53f = _0x89b6d.videoWidth || 16,
        _0xca68eg = _0x89b6d.videoHeight || 9;
      const _0x68f9ad = Math.min(r.width / _0x3e53f, r.height / _0xca68eg);
      const w = _0x3e53f * _0x68f9ad,
        h = _0xca68eg * _0x68f9ad;
      _0x1738fa = {
        left: r.left + (r.width - w) / 2,
        top: r.top + (r.height - h) / 2,
        width: w,
        height: h,
      };
    }
    return _0x1738fa;
  };
  const _0xaefe = () => {
    _0x1738fa = null;
  };
  window.addEventListener("resize", _0xaefe);
  const _0xcf_0xf7g = (buf) => {
    try {
      if (_cloudDc && _cloudDc.readyState === "open") _cloudDc.send(buf);
    } catch {}
  };
  const _0x79a = (moveX = 0, moveY = 0, scroll = 0) => {
    if (!_cloudDc || _cloudDc.readyState !== "open") return;
    moveX = Math.max(-127, Math.min(127, moveX));
    moveY = Math.max(-127, Math.min(127, moveY));
    const r = _0xec5f();
    const _0x52d3ec = Math.floor(((_0xdg4d - r.left) / r.width) * 10000);
    const _0x18eg1d = Math.floor(((_0x3d15a - r.top) / r.height) * 10000);
    const buf = new ArrayBuffer(12),
      v = new DataView(buf);
    v.setUint8(0, 1);
    v.setUint8(1, 11);
    v.setUint8(2, 2);
    v.setUint8(3, 8);
    v.setUint16(4, Math.max(0, Math.min(10000, _0x52d3ec)));
    v.setUint16(6, Math.max(0, Math.min(10000, _0x18eg1d)));
    v.setInt8(8, moveX);
    v.setInt8(9, moveY);
    v.setUint8(10, _0xc4_0x512);
    v.setInt8(11, scroll);
    _0xcf_0xf7g(buf);
  };
  const _0xe2dded = (keyCode, isDown) => {
    if (isDown) _0xd9c.add(keyCode);
    else _0xd9c["delete"](keyCode);
    const buf = new ArrayBuffer(24),
      v = new DataView(buf);
    v.setUint8(0, 1);
    v.setUint8(2, 1);
    v.setUint8(3, 1);
    v.setUint16(4, keyCode);
    v.setUint8(6, isDown ? 1 : 0);
    let _0xaf05f = 7;
    for (const k of _0xd9c) {
      if (k !== keyCode && k > 0 && k < 255 && _0xaf05f < 21) {
        v.setUint16(_0xaf05f, k);
        _0xaf05f += 2;
        v.setUint8(_0xaf05f, 1);
        _0xaf05f++;
      }
    }
    v.setUint8(_0xaf05f++, 255);
    v.setUint8(1, _0xaf05f - 1);
    _0xcf_0xf7g(buf.slice(0, _0xaf05f));
  };
  const _0x74c6ad = [
    32, 69, 82, 70, 81, 67, 16, 17, 27, 13, 86, 71, 38, 40, 37, 39,
  ];
  const _0xa94cg = (value, deadzone) => {
    return Math.abs(value) < deadzone ? 0 : value;
  };
  const _0x62a = (index, gp) => {
    if (!_cloudDc || _cloudDc.readyState !== "open" || !_cloudInputActive)
      return;
    const prevState = _0xb6ecag.connected.get(index) || {
      buttons: [],
      axes: [],
    };
    gp.buttons.forEach((button, btnIndex) => {
      const _0x457fce = button.pressed || button.value > 0.5;
      const _0x87d9ec = prevState.buttons[btnIndex] || false;
      if (_0x457fce !== _0x87d9ec) {
        const _0x9cg1cd = controllerMap.buttons[btnIndex];
        if (_0x9cg1cd === null) return;
        const _0xeb9ff =
          _0x9cg1cd === "MOUSE_LEFT"
            ? 1
            : _0x9cg1cd === "MOUSE_RIGHT"
              ? 2
              : _0x9cg1cd === "MOUSE_MIDDLE"
                ? 4
                : 0;
        if (_0xeb9ff) {
          if (_0x457fce) {
            _0xc4_0x512 |= _0xeb9ff;
          } else {
            _0xc4_0x512 &= ~_0xeb9ff;
          }
          _0x79a(0, 0, 0);
        } else if (_0x9cg1cd && _0x9cg1cd.key) {
          _0xe2dded(_0x9cg1cd.key, _0x457fce);
        } else if (_0x9cg1cd === undefined && btnIndex < _0x74c6ad.length) {
          _0xe2dded(_0x74c6ad[btnIndex], _0x457fce);
        }
      }
    });
    const _0x8af = _0xa94cg(gp.axes[0] || 0, _0xb6ecag.deadzone);
    const _0x7d77da = _0xa94cg(gp.axes[1] || 0, _0xb6ecag.deadzone);
    const _0xf2cbf = _0xa94cg(gp.axes[2] || 0, _0xb6ecag.deadzone);
    const _0xaab3be = _0xa94cg(gp.axes[3] || 0, _0xb6ecag.deadzone);
    const _0x30e = _0xa94cg(prevState.axes[0] || 0, _0xb6ecag.deadzone);
    const _0x86d = _0xa94cg(prevState.axes[1] || 0, _0xb6ecag.deadzone);
    if (controllerMap.leftStick === "WASD") {
      if (Math.sign(_0x8af) !== Math.sign(_0x30e)) {
        if (_0x30e < 0) _0xe2dded(65, false);
        if (_0x30e > 0) _0xe2dded(68, false);
        if (_0x8af < 0) _0xe2dded(65, true);
        if (_0x8af > 0) _0xe2dded(68, true);
      }
      if (Math.sign(_0x7d77da) !== Math.sign(_0x86d)) {
        if (_0x86d < 0) _0xe2dded(87, false);
        if (_0x86d > 0) _0xe2dded(83, false);
        if (_0x7d77da < 0) _0xe2dded(87, true);
        if (_0x7d77da > 0) _0xe2dded(83, true);
      }
    } else if (controllerMap.leftStick === "MOUSE") {
      if (_0x8af !== 0 || _0x7d77da !== 0) {
        const sensitivity = 15;
        const moveX = Math.round(_0x8af * sensitivity);
        const moveY = Math.round(_0x7d77da * sensitivity);
        _0x79a(moveX, moveY, 0);
      }
    }
    if (controllerMap.rightStick === "MOUSE") {
      if (_0xf2cbf !== 0 || _0xaab3be !== 0) {
        const sensitivity = 15;
        const moveX = Math.round(_0xf2cbf * sensitivity);
        const moveY = Math.round(_0xaab3be * sensitivity);
        _0x79a(moveX, moveY, 0);
      }
    } else if (controllerMap.rightStick === "WASD") {
      const _0x8ad4gf = _0xa94cg(prevState.axes[2] || 0, _0xb6ecag.deadzone);
      const _0x4a7f6c = _0xa94cg(prevState.axes[3] || 0, _0xb6ecag.deadzone);
      if (Math.sign(_0xf2cbf) !== Math.sign(_0x8ad4gf)) {
        if (_0x8ad4gf < 0) _0xe2dded(65, false);
        if (_0x8ad4gf > 0) _0xe2dded(68, false);
        if (_0xf2cbf < 0) _0xe2dded(65, true);
        if (_0xf2cbf > 0) _0xe2dded(68, true);
      }
      if (Math.sign(_0xaab3be) !== Math.sign(_0x4a7f6c)) {
        if (_0x4a7f6c < 0) _0xe2dded(87, false);
        if (_0x4a7f6c > 0) _0xe2dded(83, false);
        if (_0xaab3be < 0) _0xe2dded(87, true);
        if (_0xaab3be > 0) _0xe2dded(83, true);
      }
    }
    _0xb6ecag.connected.set(index, {
      buttons: gp.buttons.map((b) => b.pressed || b.value > 0.5),
      axes: [...gp.axes],
    });
  };
  const _0xgg_0x498 = () => {
    if (!_cloudInputActive) return;
    const _0x18c5g = navigator.getGamepads ? navigator.getGamepads() : [];
    let _0x8284d = false;
    for (let i = 0; i < _0x18c5g.length; i++) {
      const _0x0e95c = _0x18c5g[i];
      if (_0x0e95c && _0x0e95c.connected) {
        _0x8284d = true;
        _0x62a(i, _0x0e95c);
      } else if (_0xb6ecag.connected.has(i)) {
        const prevState = _0xb6ecag.connected.get(i);
        prevState.buttons.forEach((pressed, btnIndex) => {
          if (pressed && btnIndex < _0x74c6ad.length) {
            _0xe2dded(_0x74c6ad[btnIndex], false);
          }
        });
        _0xe2dded(87, false);
        _0xe2dded(65, false);
        _0xe2dded(83, false);
        _0xe2dded(68, false);
        _0xb6ecag.connected["delete"](i);
      }
    }
    const _0x91d1cf = document.getElementById("gamePlayerController");
    if (_0x91d1cf) {
      _0x91d1cf.classList.toggle("hidden", !_0x8284d);
    }
  };
  _0xb6ecag.pollInterval = setInterval(_0xgg_0x498, 16);
  const _0xegbbff = (e) => {
    if (!_cloudInputActive) return;
    const moveX = e.movementX || 0,
      moveY = e.movementY || 0;
    if (document.pointerLockElement === _0x89b6d) {
      const r = _0xec5f();
      _0x45b34d = Math.max(0, Math.min(r.width, _0x45b34d + moveX));
      _0x7f0a = Math.max(0, Math.min(r.height, _0x7f0a + moveY));
      _0xdg4d = r.left + _0x45b34d;
      _0x3d15a = r.top + _0x7f0a;
    } else {
      _0xdg4d = e.clientX;
      _0x3d15a = e.clientY;
    }
    _0x79a(moveX, moveY, 0);
  };
  const _0xe9aff = (e) => {
    if (!_cloudInputActive) return;
    _0xc4_0x512 = e.buttons;
    _0x79a(0, 0, 0);
  };
  const _0xeaeceb = (e) => {
    if (_cloudInputActive) e.preventDefault();
  };
  const _0xd_0xb5b = (e) => {
    if (!_cloudInputActive) return;
    e.preventDefault();
    _0x79a(0, 0, e.deltaY > 0 ? -1 : 1);
  };
  const _0x3d3bca = document.getElementById("cloudRelockHint");
  const _0xfda8a = () => {
    if (!_cloudDc) return;
    if (document.pointerLockElement === _0x89b6d) return;
    _0xaefe();
    const r = _0xec5f();
    _0x45b34d = r.width / 2;
    _0x7f0a = r.height / 2;
    _0xdg4d = r.left + _0x45b34d;
    _0x3d15a = r.top + _0x7f0a;
    _0x89b6d.requestPointerLock?.();
  };
  const _0x3ea3g = () => {
    _0x3d3bca.classList.remove("visible");
    _0xfda8a();
  };
  let _0xf04ae = false;
  const _0xabgb3a = () => {
    if (!_cloudInputActive) return;
    if (document.pointerLockElement === _0x89b6d) {
      _0xf04ae = true;
      _0x3d3bca.classList.remove("visible");
    } else if (_0xf04ae) {
      const _0xe3dee = !document
        .getElementById("cloudOverlay")
        .classList.contains("hidden");
      _0x3d3bca.classList.toggle("visible", !_0xe3dee);
    }
  };
  document.addEventListener("pointerlockchange", _0xabgb3a);
  _0x3d3bca.addEventListener("click", _0x3ea3g);
  const _0xa3_0xc2a = (isDown) => (e) => {
    if (!_cloudInputActive) return;
    e.preventDefault();
    e.stopPropagation();
    if (isDown && e.repeat) return;
    _0xe2dded(e.keyCode, isDown);
  };
  const _0x9acg9f = _0xa3_0xc2a(true);
  const _0xeb1bb = _0xa3_0xc2a(false);
  document.addEventListener("mousemove", _0xegbbff);
  document.addEventListener("mousedown", _0xe9aff);
  document.addEventListener("mouseup", _0xe9aff);
  document.addEventListener("contextmenu", _0xeaeceb);
  document.addEventListener("wheel", _0xd_0xb5b, {
    passive: false,
  });
  _0x89b6d.addEventListener("click", _0x3ea3g);
  document.addEventListener("keydown", _0x9acg9f, {
    capture: true,
  });
  document.addEventListener("keyup", _0xeb1bb, {
    capture: true,
  });
  _cloudInputHandlers = {
    mouseMoveHandler: _0xegbbff,
    mouseButtonHandler: _0xe9aff,
    contextMenuHandler: _0xeaeceb,
    wheelHandler: _0xd_0xb5b,
    videoClickHandler: _0x3ea3g,
    keyDownHandler: _0x9acg9f,
    keyUpHandler: _0xeb1bb,
    video: _0x89b6d,
    invalidateRect: _0xaefe,
    pointerLockChangeHandler: _0xabgb3a,
    relockHint: _0x3d3bca,
    gamepadState: _0xb6ecag,
  };
}
function endCloudGame() {
  if (!_cloudSession) return;
  teardownCloud(true);
  _cloudEndedActive = false;
  const _0xgbb = document.getElementById("cloudVideoWrap");
  const _0x4gafbb = document.getElementById("gamePlayerLoading");
  _0xgbb.classList.remove("visible");
  _0x4gafbb.classList.remove("hidden");
  _0x4gafbb.textContent = "loading…";
  document.getElementById("gamePlayerTimeLeft").textContent = "";
  setCloudPhase("idle", "", false);
}
const originalHandleGamePlayerClose = handleGamePlayerClose;
handleGamePlayerClose = function () {
  if (_cloudEndedActive) {
    _cloudEndedActive = false;
    closeGamePlayer();
    return;
  }
  if (_cloudSession) {
    _armOrConfirmClose(() => {
      endCloudGame();
      closeGamePlayer();
    });
    return;
  }
  originalHandleGamePlayerClose();
};
window.addEventListener("beforeunload", () => {
  if (_cloudSession) _quitCloudSession(_cloudSession.uuid);
});
document.addEventListener("visibilitychange", () => {
  if (_cloudSession && document.hidden) {
    if (_cloudWs && _cloudWs.readyState === 1) {
      _cloudWs.send(
        JSON.stringify({
          type: "ping",
        }),
      );
    }
  }
});
const originalGameCardOnClick = _gameCardOnClick;
_gameCardOnClick = function (g) {
  if (g.source === "cloud") return () => startCloudGame(g.key, g.name);
  return originalGameCardOnClick(g);
};
(() => {
  const el = document.getElementById("pingDisplay");
  if (el) {
    if (window.devMode) el.textContent = "ping: DEVELOPER";
    else if (window.WlspIsBackup) el.textContent = "ping: BACKUP";
    else
      el.textContent =
        typeof window.WlspPing === "number"
          ? `ping: ${window.WlspPing}ms`
          : "ping: --";
  }
  const baseEl = document.getElementById("baseDisplay");
  if (baseEl) {
    try {
      baseEl.textContent = `base: ${new URL(window.assetsBase).hostname}`;
    } catch {
      if (window.devMode) {
        baseEl.textContent = "base: DEVELOPER";
      } else {
        baseEl.textContent = "base: --";
      }
    }
  }
})();
document.body.firstElementChild?.remove();
const AI_WS_PATH = "/ai";
let _aiWs = null;
let _aiWsReady = false;
let _aiModelsGrouped = {};
let _aiSelectedModel = null;
let _aiWebSearchEnabled = false;
let _aiChats = [];
let _aiCurrentChatId = null;
let _aiStreaming = false;
let _aiHandlersBound = false;
let _streamShell = null;
let _streamPlaceholder = null;
let _streamContent = "";
let _streamReasoning = "";
let _streamUsage = null;
let _streamStartedAt = 0;
let _streamFirstTokenAt = 0;
let _streamTitle = "";
let _streamMedia = null;
let _streamAsstId = null;
let _pendingUserMsg = null;
let _aiAttachedFile = null;
let _aiAttachedPreviewUrl = null;
let _pendingMediaResolve = null;
let _pendingDeleteChatId = null;
const SOLVE_QUESTION_PROMPT =
  "Answer any questions on this page correctly; think step by step internally, give plain answers unless special input like graphing/formatting is needed (then briefly explain how to input it), and label multiple questions by number/letter (e.g., 1:, 2A:, 2B:).";
let _screenshareStream = null;
let _screenshareVideo = null;
let _screenshareChatId = null;
let _screenshareWin = null;
let _screenshareStreaming = false;
let _screenshareContent = "";
let _screenshareReasoning = "";
let _screenshareAsstId = null;
let _screenshareUi = null;
let _pendingScreenshareUserMsg = null;
let _pendingScreenshareMediaResolve = null;
const AI_IMAGE_MIME_RE = new RegExp("^image\\/(png|jpeg|jpg|webp|gif)$", "");
const AI_IMAGE_MAX_BYTES = 11 * 1024 * 1024;
const AI_MEDIA_CHUNK_CHARS = 800000;
let _idCounter = 0;
function _newId() {
  return "m" + ++_idCounter + "_" + Math.random().toString(36).slice(2, 10);
}
async function _loadAllChats() {
  try {
    const _0x5f86fd = await _oDB();
    const _0xc1a = await new Promise((resolve, reject) => {
      const _0x4cc4a = _0x5f86fd.transaction("chats", "readonly");
      const _0x2d6b5b = _0x4cc4a.objectStore("chats").getAll();
      _0x2d6b5b.onsuccess = () => resolve(_0x2d6b5b.result || []);
      _0x2d6b5b.onerror = () => reject(_0x2d6b5b.error);
    });
    _0xc1a.forEach((chat) => {
      chat.messages.forEach((msg) => {
        if (msg.media && msg.media.blob) {
          try {
            msg.media.url = URL.createObjectURL(msg.media.blob);
          } catch (e) {}
        }
      });
    });
    _0xc1a.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return _0xc1a;
  } catch (e) {
    console.error("[O] chats load failed:", e);
    return [];
  }
}
function _persistChat(chat) {
  if (!chat) return;
  chat.updatedAt = Date.now();
  _oDB()
    .then((db) => {
      const _0xb9296e = db.transaction("chats", "readwrite");
      _0xb9296e.objectStore("chats").put(chat);
    })
    ["catch"]((e) => {
      console.error("[O] chat save failed:", chat.id, e);
    });
}
let _aiChatsLoadPromise = null;
function _ensureAIChatsLoaded() {
  if (_aiChatsLoadPromise) return _aiChatsLoadPromise;
  _aiChatsLoadPromise = _loadAllChats().then((chats) => {
    _aiChats = chats;
    _renderRecents();
  });
  return _aiChatsLoadPromise;
}
function _aiWsUrl() {
  try {
    const u = new URL(getBase());
    u.protocol = u.protocol === "http:" ? "ws:" : "wss:";
    u.pathname = AI_WS_PATH;
    u.search = "";
    u.hash = "";
    return u.toString();
  } catch (e) {
    return "wss://cdn.vipersfutbol.com" + AI_WS_PATH;
  }
}
function openAI() {
  const _0x4512cb = document.getElementById("aiScreen");
  if (_0x4512cb) _0x4512cb.classList.add("open");
  _ensureAIWs();
  _ensureAIChatsLoaded();
  setTimeout(() => _initAIInputHandlers(), 50);
}
function closeAI() {
  const _0x1b3abd = document.getElementById("aiScreen");
  if (_0x1b3abd) _0x1b3abd.classList.remove("open");
}
function _ensureAIWs() {
  if (
    _aiWs &&
    (_aiWs.readyState === WebSocket.CONNECTING ||
      _aiWs.readyState === WebSocket.OPEN)
  )
    return;
  _connectAI();
}
function _connectAI() {
  try {
    if (_aiWs) _aiWs.close();
  } catch (e) {}
  _aiWsReady = false;
  _setAIStatus("connecting…");
  const _0x43af = new WebSocket(_aiWsUrl());
  _aiWs = _0x43af;
  _0x43af.onopen = () => {
    _aiWsReady = true;
  };
  _0x43af.onmessage = (ev) => _handleAIMessage(ev.data);
  _0x43af.onclose = () => {
    _aiWsReady = false;
    _setAIStatus("disconnected - reconnecting…");
    _aiWs = null;
    if (_aiStreaming) _onStreamError("connection lost");
    setTimeout(_ensureAIWs, 2000);
  };
  _0x43af.onerror = () => {
    _setAIStatus("connection error");
  };
}
function _handleAIMessage(raw, m) {
  try {
    m = JSON.parse(raw);
  } catch (e) {
    return;
  }
  if (
    _screenshareStreaming &&
    (!_screenshareChatId || m.conversationId === _screenshareChatId) &&
    [
      "message",
      "thinking",
      "content",
      "processing",
      "usage",
      "image",
      "video",
      "done",
      "error",
    ].includes(m.type)
  ) {
    _handleScreenshareMessage(m);
    return;
  }
  switch (m.type) {
    case "toast":
      _toast(m.text || "connected");
      break;
    case "models":
      _aiModelsGrouped = m.models || {};
      _renderModelSelect(_aiModelsGrouped);
      break;
    case "newChat":
      _aiCurrentChatId = m.conversationId;
      _clearAIMessages();
      _showAIWelcome(true);
      break;
    case "message":
      _onStreamStart(m);
      break;
    case "thinking":
      _onStreamThinking(m.delta);
      break;
    case "content":
      _onStreamContent(m.delta);
      break;
    case "processing":
      _onStreamProcessing(m.text || "");
      break;
    case "status":
      _setAIStatus(m.text || "");
      break;
    case "usage":
      _streamUsage = m;
      break;
    case "image":
      _onStreamMedia("image", m.url);
      break;
    case "video":
      _onStreamMedia("video", m.url);
      break;
    case "requestMediaId":
      if (_pendingScreenshareMediaResolve) {
        _pendingScreenshareMediaResolve(m.mediaId);
        _pendingScreenshareMediaResolve = null;
      } else if (_pendingMediaResolve) {
        _pendingMediaResolve(m.mediaId);
        _pendingMediaResolve = null;
      }
      break;
    case "done":
      _onStreamDone();
      break;
    case "deleted":
      _onConversationDeleted(m.conversationId);
      break;
    case "cancelled":
      _onStreamError(m.text || "cancelled");
      break;
    case "error":
      if (_pendingMediaResolve) _pendingMediaResolve = null;
      if (m.code === "not_found" && _pendingDeleteChatId) {
        const _0x556b6a = _pendingDeleteChatId;
        _pendingDeleteChatId = null;
        _onConversationDeleted(_0x556b6a);
        break;
      }
      _onStreamError(m.text || "error");
      break;
    case "ping":
      if (_aiWs && _aiWs.readyState === 1)
        _aiWs.send(
          JSON.stringify({
            type: "pong",
          }),
        );
      break;
  }
}
function _setAIStatus(text) {
  const _0x2c_0x3f0 = document.getElementById("aiStatus");
  if (!_0x2c_0x3f0) return;
  _0x2c_0x3f0.textContent = text;
  _0x2c_0x3f0.classList.toggle("show", !!text);
}
function _toast(text) {
  _setAIStatus(text);
  setTimeout(() => {
    const _0x13_0x3d3 = document.getElementById("aiStatus");
    if (_0x13_0x3d3) _0x13_0x3d3.textContent = "";
  }, 2500);
}
function _showAIWelcome(show) {
  const _0x37a = document.getElementById("aiWelcome");
  if (_0x37a) _0x37a.classList.toggle("hidden", !show);
}
function _clearAIMessages() {
  const c = document.getElementById("aiMessages");
  if (c) c.innerHTML = "";
}
function _closeModelPopup() {
  const _0xe6a8b = document.getElementById("aiModelWrap");
  if (_0xe6a8b) _0xe6a8b.classList.remove("open");
}
function _selectModel(id) {
  _aiSelectedModel = id || null;
  const _0x4ge18f = document.getElementById("aiModelLabel");
  if (_0x4ge18f) _0x4ge18f.textContent = id || "";
  const _0xd5gbf = document.getElementById("aiModelPopup");
  if (_0xd5gbf) {
    _0xd5gbf.querySelectorAll(".ai-model-item").forEach((el) => {
      el.classList.toggle("selected", el.dataset.modelId === id);
    });
  }
  if (_aiCurrentChatId) {
    const _0x3957ec = _getChat(_aiCurrentChatId);
    _0x3957ec.model = _aiSelectedModel;
    _persistChat(_0x3957ec);
  }
}
function _renderModelSelect(grouped) {
  const _0xbc7b = document.getElementById("aiModelPopup");
  if (!_0xbc7b) return;
  _0xbc7b.innerHTML = "";
  const _0x3eae = [
    "gpt",
    "gemma",
    "llama",
    "grok",
    "deepseek",
    "qwen",
    "kimi",
    "image",
    "video",
  ];
  const _0x0155cd = (k) => {
    const i = _0x3eae.indexOf(k);
    return i === -1 ? 99 : i;
  };
  const _0xb2754d = Object.keys(grouped).sort(
    (a, b) => _0x0155cd(a) - _0x0155cd(b),
  );
  let _0xd33c = null;
  _0xb2754d.forEach((key) => {
    const _0x2a9bg = document.createElement("div");
    _0x2a9bg.className = "ai-model-group-label";
    _0x2a9bg.textContent = key.toUpperCase();
    _0xbc7b.appendChild(_0x2a9bg);
    grouped[key].forEach((id) => {
      const _0xe86aa = document.createElement("div");
      _0xe86aa.className = "ai-model-item";
      _0xe86aa.textContent = id;
      _0xe86aa.dataset.modelId = id;
      _0xe86aa.onclick = () => {
        _selectModel(id);
        _closeModelPopup();
      };
      _0xbc7b.appendChild(_0xe86aa);
      if (!_0xd33c && key !== "image" && key !== "video") _0xd33c = id;
    });
  });
  const _0xf5_0x14e = _aiCurrentChatId
    ? _aiChats.find((c) => c.id === _aiCurrentChatId)
    : null;
  if (_0xf5_0x14e && _0xf5_0x14e.model) _aiSelectedModel = _0xf5_0x14e.model;
  if (!_aiSelectedModel) _aiSelectedModel = _0xd33c;
  _selectModel(_aiSelectedModel);
}
function _initModelDropdown() {
  const _0xa6641b = document.getElementById("aiModelWrap");
  const _0x1b31dc = document.getElementById("aiModelTrigger");
  if (!_0xa6641b || !_0x1b31dc) return;
  _0x1b31dc.onclick = (e) => {
    e.stopPropagation();
    _0xa6641b.classList.toggle("open");
  };
  document.addEventListener("click", (e) => {
    if (!_0xa6641b.contains(e.target)) _closeModelPopup();
  });
}
function _initAIInputHandlers() {
  if (_aiHandlersBound) return;
  _aiHandlersBound = true;
  _initModelDropdown();
  const _0x2b7bb = document.getElementById("aiInput");
  const _0x0e5c = document.getElementById("aiSendBtn");
  const _0x5c_0x4e4 = () => {
    const _0x6687d = _0x2b7bb && _0x2b7bb.value.trim().length > 0;
    if (_0x0e5c)
      _0x0e5c.classList.toggle("hidden", !(_0x6687d || _aiAttachedFile));
  };
  if (_0x2b7bb) {
    _0x2b7bb.addEventListener("input", () => {
      _0x5c_0x4e4();
      _0x2b7bb.style.height = "auto";
      const _0xb2a3c = Math.min(_0x2b7bb.scrollHeight, 110);
      _0x2b7bb.style.height = _0xb2a3c + "px";
      _0x2b7bb.style.overflowY = _0xb2a3c >= 110 ? "auto" : "hidden";
    });
    _0x2b7bb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if ((_0x2b7bb.value.trim() || _aiAttachedFile) && _aiSelectedModel)
          _sendMessage();
      }
    });
  }
  if (_0x0e5c) _0x0e5c.onclick = _sendMessage;
  const _0x12affc = document.getElementById("aiNewChatBtn");
  if (_0x12affc) _0x12affc.onclick = _newChat;
  const _0xda_0xd15 = document.getElementById("aiImageBtn");
  const _0x65ca = document.getElementById("aiImageInput");
  if (_0xda_0xd15 && _0x65ca) {
    _0xda_0xd15.onclick = () => _0x65ca.click();
    _0x65ca.addEventListener("change", () => {
      const file = _0x65ca.files && _0x65ca.files[0];
      _0x65ca.value = "";
      if (!file) return;
      _setAttachedFile(file);
      _0x5c_0x4e4();
    });
  }
  const _0x14_0xg6c = document.getElementById("aiAttachRemove");
  if (_0x14_0xg6c)
    _0x14_0xg6c.onclick = () => {
      _setAttachedFile(null);
      _0x5c_0x4e4();
    };
  const _0xcaag = document.getElementById("aiWebSearchBtn");
  if (_0xcaag) {
    _0xcaag.onclick = () => {
      _aiWebSearchEnabled = !_aiWebSearchEnabled;
      _0xcaag.classList.toggle("active", _aiWebSearchEnabled);
    };
  }
  if (_0x2b7bb) {
    _0x2b7bb.addEventListener("paste", (e) => {
      const _0xa8a84g = e.clipboardData && e.clipboardData.items;
      if (!_0xa8a84g) return;
      for (const _0xd3443g of _0xa8a84g) {
        if (
          _0xd3443g.kind === "file" &&
          AI_IMAGE_MIME_RE.test(_0xd3443g.type)
        ) {
          const file = _0xd3443g.getAsFile();
          if (file) {
            e.preventDefault();
            _setAttachedFile(file);
            _0x5c_0x4e4();
          }
          break;
        }
      }
    });
  }
  const _0xbg61a = document.getElementById("aiScreenshareBtn");
  if (_0xbg61a) _0xbg61a.onclick = _startScreenshare;
}
function _setAttachedFile(file) {
  if (_aiAttachedPreviewUrl) {
    URL.revokeObjectURL(_aiAttachedPreviewUrl);
    _aiAttachedPreviewUrl = null;
  }
  _aiAttachedFile = null;
  const _0x270e5c = document.getElementById("aiAttachPreview");
  const _0xf3327c = document.getElementById("aiAttachThumb");
  const _0xd80fbc = document.getElementById("aiAttachName");
  if (!file) {
    if (_0x270e5c) _0x270e5c.classList.remove("show");
    return;
  }
  if (!AI_IMAGE_MIME_RE.test(file.type)) {
    _toast("unsupported image type");
    return;
  }
  if (file.size > AI_IMAGE_MAX_BYTES) {
    _toast("image too large (max 11MB)");
    return;
  }
  _aiAttachedFile = file;
  _aiAttachedPreviewUrl = URL.createObjectURL(file);
  if (_0xf3327c) _0xf3327c.src = _aiAttachedPreviewUrl;
  if (_0xd80fbc) _0xd80fbc.textContent = file.name;
  if (_0x270e5c) _0x270e5c.classList.add("show");
}
function _newChat() {
  if (_aiStreaming) return;
  _aiCurrentChatId = null;
  _clearAIMessages();
  _showAIWelcome(true);
  const _0xd7c = document.getElementById("aiInput");
  if (_0xd7c) {
    _0xd7c.value = "";
    _0xd7c.style.height = "auto";
  }
  const _0x0a6aa = document.getElementById("aiSendBtn");
  if (_0x0a6aa) _0x0a6aa.classList.add("hidden");
  if (_aiWsReady && _aiWs)
    _aiWs.send(
      JSON.stringify({
        type: "newChat",
      }),
    );
}
function _sendMessage() {
  const _0xgece4c = document.getElementById("aiInput");
  const _0x68d0fa = (_0xgece4c.value || "").trim();
  const _0x12398d = _aiAttachedFile;
  if (
    (!_0x68d0fa && !_0x12398d) ||
    !_aiSelectedModel ||
    _aiStreaming ||
    _screenshareStreaming
  )
    return;
  if (!_aiWsReady || !_aiWs) {
    _setAIStatus("not connected");
    _ensureAIWs();
    return;
  }
  _showAIWelcome(false);
  const _0x4g27b = _newId();
  const _0x3d571b = _0x12398d ? _aiAttachedPreviewUrl : null;
  _pendingUserMsg = {
    id: _0x4g27b,
    content: _0x68d0fa,
    media: _0x12398d
      ? {
          url: _0x3d571b,
          blob: _0x12398d,
        }
      : undefined,
  };
  _renderUserMessage(_0x4g27b, _0x68d0fa, _0x3d571b);
  _streamPlaceholder = _showThinkingIndicator();
  _0xgece4c.value = "";
  _0xgece4c.style.height = "auto";
  const _0xe58e2e = document.getElementById("aiSendBtn");
  if (_0xe58e2e) {
    _0xe58e2e.classList.add("hidden");
    _0xe58e2e.disabled = true;
  }
  _aiStreaming = true;
  _streamMedia = null;
  if (_0x12398d) {
    _aiAttachedFile = null;
    _aiAttachedPreviewUrl = null;
    const _0x6cad3d = document.getElementById("aiAttachPreview");
    if (_0x6cad3d) _0x6cad3d.classList.remove("show");
    _sendMediaMessage(_0x12398d, _0x68d0fa)["catch"]((err) =>
      _onStreamError(err.message || "upload failed"),
    );
  } else {
    _aiWs.send(
      JSON.stringify({
        type: "sendMessage",
        conversationId: _aiCurrentChatId,
        content: _0x68d0fa,
        model: _aiSelectedModel,
        webSearch: _aiWebSearchEnabled,
      }),
    );
  }
}
function _fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const _0x9a61df = new FileReader();
    _0x9a61df.onload = () =>
      resolve(String(_0x9a61df.result).split(",")[1] || "");
    _0x9a61df.onerror = () => reject(new Error("could not read file"));
    _0x9a61df.readAsDataURL(file);
  });
}
async function _sendMediaMessage(file, prompt) {
  const _0x4b39b = await _fileToBase64(file);
  const _0x45807f = await new Promise((resolve, reject) => {
    _pendingMediaResolve = resolve;
    _aiWs.send(
      JSON.stringify({
        type: "mediaStart",
        model: _aiSelectedModel,
        mime: file.type,
        conversationId: _aiCurrentChatId || undefined,
      }),
    );
    setTimeout(() => {
      if (_pendingMediaResolve === resolve) {
        _pendingMediaResolve = null;
        reject(new Error("upload timed out"));
      }
    }, 15000);
  });
  for (let i = 0; i < _0x4b39b.length; i += AI_MEDIA_CHUNK_CHARS) {
    _aiWs.send(
      JSON.stringify({
        type: "mediaChunk",
        mediaId: _0x45807f,
        chunk: _0x4b39b.slice(i, i + AI_MEDIA_CHUNK_CHARS),
      }),
    );
  }
  _aiWs.send(
    JSON.stringify({
      type: "mediaDone",
      mediaId: _0x45807f,
      prompt: prompt,
      webSearch: _aiWebSearchEnabled,
    }),
  );
}
function _onStreamStart(m) {
  _aiCurrentChatId = m.conversationId;
  _streamContent = "";
  _streamReasoning = "";
  _streamUsage = null;
  _streamMedia = null;
  _streamStartedAt = performance.now();
  _streamFirstTokenAt = 0;
  _streamTitle = m.title || "";
  _streamAsstId = _newId();
  const _0xaea = _getChat(_aiCurrentChatId);
  if (!_0xaea.title) _0xaea.title = _streamTitle;
  if (m.model) _0xaea.model = m.model;
  if (_pendingUserMsg) {
    const _0xb1d = m.messageId || _pendingUserMsg.id;
    _0xaea.messages.push({
      id: _0xb1d,
      role: "user",
      content: _pendingUserMsg.content,
      media: _pendingUserMsg.media,
    });
    if (_0xb1d !== _pendingUserMsg.id) {
      const _0x3626ca = document.querySelector(
        `[data-msg-id="${_pendingUserMsg.id}"]`,
      );
      if (_0x3626ca) _0x3626ca.dataset.msgId = _0xb1d;
    }
    _pendingUserMsg = null;
    _persistChat(_0xaea);
  }
  if (_streamPlaceholder) {
    _streamPlaceholder.remove();
    _streamPlaceholder = null;
  }
  _streamShell = _createAssistantShell();
  if (_aiWebSearchEnabled) {
    _streamShell.statusDiv.classList.remove("hidden");
    _streamShell.statusDiv.textContent = "Searching the web…";
  }
  const _0xc00f6g = document.getElementById("aiMessages");
  if (_0xc00f6g) _0xc00f6g.appendChild(_streamShell.messageDiv);
  _scrollChatToBottom();
}
function _onStreamThinking(delta) {
  if (!_streamShell) return;
  if (!_streamReasoning) {
    if (!_streamFirstTokenAt) _streamFirstTokenAt = performance.now();
    _streamShell.waitDiv.classList.add("hidden");
    _streamShell.statusDiv.classList.add("hidden");
    _streamShell.reasoningLabel.textContent = "Reasoning…";
  }
  _streamReasoning += delta;
  _streamShell.reasoningDetails.classList.remove("hidden");
  _streamShell.reasoningBody.textContent = _streamReasoning;
  _scrollChatToBottom();
}
function _onStreamContent(delta) {
  if (!_streamShell) return;
  if (!_streamContent) {
    if (!_streamFirstTokenAt) _streamFirstTokenAt = performance.now();
    _streamShell.waitDiv.classList.add("hidden");
    _streamShell.statusDiv.classList.add("hidden");
    _streamShell.reasoningDetails.open = false;
    _streamShell.reasoningLabel.textContent = "Reasoning";
    _mountTextDiv(_streamShell);
  }
  _streamContent += delta;
  _renderMarkdown(_streamShell.textDiv, _streamContent);
  _scrollChatToBottom();
}
function _onStreamProcessing(text) {
  if (!_streamShell) return;
  _streamShell.waitDiv.classList.add("hidden");
  _streamShell.statusDiv.classList.remove("hidden");
  _streamShell.statusDiv.textContent = text;
  _scrollChatToBottom();
}
function _onStreamMedia(kind, url) {
  _streamMedia = {
    kind: kind,
    url: url,
  };
  if (_streamShell) {
    _streamShell.waitDiv.classList.add("hidden");
    _streamShell.statusDiv.classList.add("hidden");
    _mountTextDiv(_streamShell);
    _appendMedia(_streamShell.textDiv, kind, url);
  }
  _scrollChatToBottom();
}
function _onStreamDone() {
  const _0x1d_0xbf9 = _streamShell;
  const _0x0g_0x0db = _streamContent;
  const _0x7ee = _streamReasoning;
  const _0x33def = _streamMedia;
  const _0x6954b = _streamAsstId;
  if (_0x1d_0xbf9) {
    _0x1d_0xbf9.waitDiv.classList.add("hidden");
    _0x1d_0xbf9.statusDiv.classList.add("hidden");
    _0x1d_0xbf9.statsDiv.textContent = _formatStats({
      startedAt: _streamStartedAt,
      firstTokenAt: _streamFirstTokenAt,
      usage: _streamUsage,
    });
    _addCopyAction(_0x1d_0xbf9.actionsDiv, () =>
      _0x33def ? _0x33def.url : _0x0g_0x0db,
    );
    _addRetryAction(_0x1d_0xbf9.actionsDiv, () => _retryMessage(_0x6954b));
  }
  const _0x7299c = _getChat(_aiCurrentChatId);
  if (_0x7299c) {
    const i = _0x7299c.messages.findIndex((x) => x.id === _0x6954b);
    const _0x15_0x6a3 = {
      id: _0x6954b,
      role: "assistant",
      content: _0x0g_0x0db,
      reasoning: _0x7ee || undefined,
      media: _0x33def || undefined,
    };
    if (i !== -1) _0x7299c.messages[i] = _0x15_0x6a3;
    else _0x7299c.messages.push(_0x15_0x6a3);
    _persistChat(_0x7299c);
  }
  _renderRecents();
  _streamShell = null;
  _aiStreaming = false;
  const _0xfc_0xd23 = document.getElementById("aiSendBtn");
  if (_0xfc_0xd23) _0xfc_0xd23.disabled = false;
}
function _onStreamError(text) {
  if (_streamPlaceholder) {
    _streamPlaceholder.remove();
    _streamPlaceholder = null;
  }
  if (_streamShell) {
    _streamShell.messageDiv.remove();
    _streamShell = null;
  }
  if (_pendingUserMsg) {
    const _0xd6ab1f = document.querySelector(
      `[data-msg-id="${_pendingUserMsg.id}"]`,
    );
    if (_0xd6ab1f) _0xd6ab1f.remove();
    _pendingUserMsg = null;
  }
  _pendingMediaResolve = null;
  _showError(text);
  _aiStreaming = false;
  const _0x50e7c = document.getElementById("aiSendBtn");
  if (_0x50e7c) _0x50e7c.disabled = false;
}
function _escapeHtml(str) {
  return str.replace(
    new RegExp("[&<>\"']", "g"),
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );
}
if (typeof marked !== "undefined") {
  marked.setOptions({
    breaks: true,
  });
  if (typeof markedKatex !== "undefined")
    marked.use(
      markedKatex({
        throwOnError: false,
      }),
    );
  if (typeof markedHighlight !== "undefined" && typeof hljs !== "undefined") {
    marked.use(
      markedHighlight.markedHighlight({
        langPrefix: "hljs language-",
        highlight(code, lang) {
          const language = hljs.getLanguage(lang) ? lang : "plaintext";
          return hljs.highlight(code, {
            language: language,
          }).value;
        },
      }),
    );
  }
}
function _formatMessage(content) {
  if (typeof marked === "undefined")
    return _escapeHtml(content).replace(new RegExp("\\n", "g"), "<br>");
  const _0x57a = marked.parse(content);
  return typeof DOMPurify !== "undefined" ? DOMPurify.sanitize(_0x57a) : _0x57a;
}
function _renderMarkdown(el, content) {
  el.innerHTML = _formatMessage(content);
  el.querySelectorAll("a").forEach((a) => {
    a.target = "_blank";
    a.rel = "noreferrer";
  });
}
function _scrollChatToBottom() {
  const _0x0daf = document.getElementById("aiChatContainer");
  if (_0x0daf) _0x0daf.scrollTop = _0x0daf.scrollHeight;
}
function _showError(message) {
  const _0x5d1cc = document.getElementById("aiChatContainer");
  if (!_0x5d1cc) return;
  const _0xd2_0xd8e = document.createElement("div");
  _0xd2_0xd8e.className = "ai-error-box";
  _0xd2_0xd8e.textContent = message;
  _0x5d1cc.appendChild(_0xd2_0xd8e);
  setTimeout(() => _0xd2_0xd8e.remove(), 5000);
}
function _addCopyAction(actionsDiv, getContent) {
  const _0x199f0f = document.createElement("button");
  _0x199f0f.className = "ai-message-action-btn";
  _0x199f0f.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  _0x199f0f.title = "Copy";
  _0x199f0f.onclick = () => {
    navigator.clipboard.writeText(getContent());
    _0x199f0f.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => {
      _0x199f0f.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    }, 1500);
  };
  actionsDiv.appendChild(_0x199f0f);
}
function _addRetryAction(actionsDiv, onRetry) {
  const _0xg14ae = document.createElement("button");
  _0xg14ae.className = "ai-message-action-btn";
  _0xg14ae.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>';
  _0xg14ae.title = "Retry";
  _0xg14ae.onclick = onRetry;
  actionsDiv.appendChild(_0xg14ae);
}
function _addEditAction(actionsDiv, onEdit) {
  const _0x77fe = document.createElement("button");
  _0x77fe.className = "ai-message-action-btn";
  _0x77fe.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
  _0x77fe.title = "Edit";
  _0x77fe.onclick = onEdit;
  actionsDiv.appendChild(_0x77fe);
}
function _renderUserMessage(id, content, mediaUrl) {
  const _0xd82cbf = document.getElementById("aiMessages");
  const _0xd5a5dc = document.createElement("div");
  _0xd5a5dc.className = "ai-message user";
  _0xd5a5dc.dataset.msgId = id;
  if (mediaUrl) {
    const _0x0478cc = document.createElement("img");
    _0x0478cc.className = "ai-message-user-media";
    _0x0478cc.src = mediaUrl;
    _0x0478cc.alt = "";
    _0xd5a5dc.appendChild(_0x0478cc);
  }
  if (content) {
    const _0x082f4d = document.createElement("div");
    _0x082f4d.className = "ai-message-text";
    _renderMarkdown(_0x082f4d, content);
    _0xd5a5dc.appendChild(_0x082f4d);
  }
  const _0x99f7d = document.createElement("div");
  _0x99f7d.className = "ai-message-actions";
  _addCopyAction(_0x99f7d, () => content);
  _addEditAction(_0x99f7d, () => _editMessage(_0xd5a5dc, content));
  _0xd5a5dc.appendChild(_0x99f7d);
  _0xd82cbf.appendChild(_0xd5a5dc);
  _scrollChatToBottom();
  return _0xd5a5dc;
}
function _createAssistantShell() {
  const _0x25287a = document.createElement("div");
  _0x25287a.className = "ai-message assistant";
  const _0xe0557g = document.createElement("details");
  _0xe0557g.className = "ai-reasoning hidden";
  const _0x8egca = document.createElement("summary");
  _0x8egca.className = "ai-reasoning-summary";
  _0x8egca.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0-6 6c0 1.887.833 3.32 2.09 4.264.55.417.91 1.05.91 1.736v.5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-.5c0-.686.36-1.319.91-1.736A6.001 6.001 0 0 0 18 9a6 6 0 0 0-6-6z"/><path d="M9.663 17h4.673"/></svg><span class="ai-reasoning-label">Reasoning</span><svg class="ai-reasoning-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
  const _0xg9a = _0x8egca.querySelector(".ai-reasoning-label");
  const _0x64154c = document.createElement("div");
  _0x64154c.className = "ai-reasoning-body";
  _0xe0557g.appendChild(_0x8egca);
  _0xe0557g.appendChild(_0x64154c);
  const _0xbb9f = document.createElement("div");
  _0xbb9f.className = "ai-message-text";
  const _0x3f_0x79c = document.createElement("div");
  _0x3f_0x79c.className = "ai-message-actions";
  const _0xd9fe = document.createElement("div");
  _0xd9fe.className = "ai-message-stats";
  const _0x9213a = document.createElement("div");
  _0x9213a.className = "ai-thinking-dots";
  _0x9213a.innerHTML =
    '<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>';
  const _0x9e383a = document.createElement("div");
  _0x9e383a.className = "ai-message-status hidden";
  _0x25287a.appendChild(_0xe0557g);
  _0x25287a.appendChild(_0x9213a);
  _0x25287a.appendChild(_0x9e383a);
  _0x25287a.appendChild(_0x3f_0x79c);
  _0x25287a.appendChild(_0xd9fe);
  return {
    messageDiv: _0x25287a,
    reasoningDetails: _0xe0557g,
    reasoningBody: _0x64154c,
    reasoningLabel: _0xg9a,
    textDiv: _0xbb9f,
    actionsDiv: _0x3f_0x79c,
    statsDiv: _0xd9fe,
    waitDiv: _0x9213a,
    statusDiv: _0x9e383a,
  };
}
function _mountTextDiv(shell) {
  if (!shell.textDiv.isConnected)
    shell.messageDiv.insertBefore(shell.textDiv, shell.actionsDiv);
}
function _appendMedia(parent, kind, url) {
  const _0x8g_0x2fd = document.createElement("div");
  _0x8g_0x2fd.className = "ai-message-media";
  const _0xf436dd = sjEncode(url);
  if (kind === "image") {
    const _0xf5g = document.createElement("img");
    _0xf5g.src = _0xf436dd;
    _0xf5g.alt = "";
    _0xf5g.onclick = () => window.open(_0xf436dd, "_blank");
    _0x8g_0x2fd.appendChild(_0xf5g);
  } else {
    const _0x99aefa = document.createElement("video");
    _0x99aefa.src = _0xf436dd;
    _0x99aefa.controls = true;
    _0x99aefa.playsInline = true;
    _0x8g_0x2fd.appendChild(_0x99aefa);
  }
  parent.appendChild(_0x8g_0x2fd);
}
function _renderAssistantMessage(msg) {
  const _0x95df = document.getElementById("aiMessages");
  const _0xb5a13d = _createAssistantShell();
  _0xb5a13d.messageDiv.dataset.msgId = msg.id;
  if (msg.reasoning) {
    _0xb5a13d.reasoningDetails.classList.remove("hidden");
    _0xb5a13d.reasoningBody.textContent = msg.reasoning;
  }
  _0xb5a13d.waitDiv.classList.add("hidden");
  _mountTextDiv(_0xb5a13d);
  _renderMarkdown(_0xb5a13d.textDiv, msg.content);
  if (msg.media) _appendMedia(_0xb5a13d.textDiv, msg.media.kind, msg.media.url);
  _addCopyAction(_0xb5a13d.actionsDiv, () =>
    msg.media ? msg.media.url : msg.content,
  );
  _addRetryAction(_0xb5a13d.actionsDiv, () => _retryMessage(msg.id));
  _0x95df.appendChild(_0xb5a13d.messageDiv);
  _scrollChatToBottom();
  return _0xb5a13d.messageDiv;
}
function _showThinkingIndicator() {
  const _0x845cd = document.getElementById("aiMessages");
  const _0xc5_0x4g5 = document.createElement("div");
  _0xc5_0x4g5.className = "ai-message assistant";
  if (_aiWebSearchEnabled) {
    const _0xbe2da = document.createElement("div");
    _0xbe2da.className = "ai-message-status";
    _0xbe2da.textContent = "Searching the web…";
    _0xc5_0x4g5.appendChild(_0xbe2da);
  }
  const _0x9g_0x519 = document.createElement("div");
  _0x9g_0x519.className = "ai-blink-dots";
  _0x9g_0x519.innerHTML =
    '<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>';
  _0xc5_0x4g5.appendChild(_0x9g_0x519);
  _0x845cd.appendChild(_0xc5_0x4g5);
  _scrollChatToBottom();
  return _0xc5_0x4g5;
}
function _formatStats({
  startedAt: startedAt,
  firstTokenAt: firstTokenAt,
  usage: usage,
}) {
  const _0xcf934a = [((performance.now() - startedAt) / 1000).toFixed(1) + "s"];
  if (firstTokenAt)
    _0xcf934a.push(`TTFT ${((firstTokenAt - startedAt) / 1000).toFixed(1)}s`);
  if (usage) {
    const _0x9e9e =
      usage.total_tokens ??
      (usage.prompt_tokens ?? 0) + (usage.completion_tokens ?? 0);
    if (_0x9e9e) _0xcf934a.push(`${_0x9e9e} tokens total`);
  }
  return _0xcf934a.join(" · ");
}
function _retryMessage(asstId) {
  if (_aiStreaming) return;
  if (!_aiWsReady || !_aiWs) {
    _setAIStatus("not connected");
    _ensureAIWs();
    return;
  }
  if (!asstId || !_aiCurrentChatId) return;
  const _0xc9e93d = _getChat(_aiCurrentChatId);
  const _0x82a48c = _0xc9e93d.messages.findIndex((x) => x.id === asstId);
  if (_0x82a48c !== -1) {
    _0xc9e93d.messages = _0xc9e93d.messages.slice(0, _0x82a48c);
    _persistChat(_0xc9e93d);
  }
  _clearAIMessages();
  _0xc9e93d.messages.forEach((msg) => {
    if (msg.role === "user")
      _renderUserMessage(msg.id, msg.content, msg.media ? msg.media.url : null);
    else _renderAssistantMessage(msg);
  });
  _aiStreaming = true;
  _streamMedia = null;
  _streamAsstId = asstId;
  _streamPlaceholder = _showThinkingIndicator();
  _aiWs.send(
    JSON.stringify({
      type: "retry",
      conversationId: _aiCurrentChatId,
      model: _aiSelectedModel,
      webSearch: _aiWebSearchEnabled,
    }),
  );
}
function _editMessage(messageDiv, originalContent) {
  if (_aiStreaming) return;
  const _0x6558c = messageDiv.querySelector(".ai-message-actions");
  const _0x6f6a6f = messageDiv.querySelector(".ai-message-text");
  if (!_0x6f6a6f) return;
  const _0xd0de = document.createElement("textarea");
  _0xd0de.value = originalContent;
  _0xd0de.className = "ai-message-text ai-edit-textarea";
  const _0x663ga = document.createElement("div");
  _0x663ga.className = "ai-edit-actions";
  const _0xb09dgb = document.createElement("button");
  _0xb09dgb.textContent = "Cancel";
  _0xb09dgb.className = "ai-edit-cancel-btn";
  _0xb09dgb.onclick = () => {
    const _0xde53g = document.createElement("div");
    _0xde53g.className = "ai-message-text";
    _renderMarkdown(_0xde53g, originalContent);
    _0xd0de.replaceWith(_0xde53g);
    _0x663ga.remove();
    if (_0x6558c) _0x6558c.classList.remove("hidden");
  };
  const _0x7f6b = document.createElement("button");
  _0x7f6b.textContent = "Save & send";
  _0x7f6b.className = "ai-edit-save-btn";
  _0x7f6b.onclick = () => {
    const _0xc3d = _0xd0de.value.trim();
    if (!_0xc3d) return;
    _editAndResend(messageDiv.dataset.msgId, _0xc3d);
  };
  _0x663ga.appendChild(_0xb09dgb);
  _0x663ga.appendChild(_0x7f6b);
  _0x6f6a6f.replaceWith(_0xd0de);
  if (_0x6558c) _0x6558c.classList.add("hidden");
  _0xd0de.insertAdjacentElement("afterend", _0x663ga);
  _0xd0de.focus();
}
function _editAndResend(userMsgId, newContent) {
  if (_aiStreaming) return;
  if (!_aiWsReady || !_aiWs) {
    _setAIStatus("not connected");
    _ensureAIWs();
    return;
  }
  if (!_aiCurrentChatId) return;
  const _0x0cabba = _getChat(_aiCurrentChatId);
  const _0xef9b2d = _0x0cabba.messages.findIndex((x) => x.id === userMsgId);
  const _0x4dc = _0xef9b2d !== -1 ? _0x0cabba.messages[_0xef9b2d].media : null;
  if (_0xef9b2d !== -1)
    _0x0cabba.messages = _0x0cabba.messages.slice(0, _0xef9b2d);
  _persistChat(_0x0cabba);
  _clearAIMessages();
  _0x0cabba.messages.forEach((msg) => {
    if (msg.role === "user")
      _renderUserMessage(msg.id, msg.content, msg.media ? msg.media.url : null);
    else _renderAssistantMessage(msg);
  });
  _showAIWelcome(false);
  _renderUserMessage(userMsgId, newContent, _0x4dc ? _0x4dc.url : null);
  _streamPlaceholder = _showThinkingIndicator();
  _aiStreaming = true;
  _streamMedia = null;
  _pendingUserMsg = {
    id: userMsgId,
    content: newContent,
    media: _0x4dc,
  };
  _aiWs.send(
    JSON.stringify({
      type: "edit",
      conversationId: _aiCurrentChatId,
      messageId: userMsgId,
      userMessageId: userMsgId,
      content: newContent,
      model: _aiSelectedModel,
      webSearch: _aiWebSearchEnabled,
    }),
  );
}
function _getChat(id) {
  let _0x71fcb = _aiChats.find((c) => c.id === id);
  if (!_0x71fcb) {
    _0x71fcb = {
      id: id,
      title: "",
      messages: [],
    };
    _aiChats.unshift(_0x71fcb);
  }
  return _0x71fcb;
}
function _renderRecents() {
  const _0xac9fc = document.getElementById("aiRecentsList");
  if (!_0xac9fc) return;
  _0xac9fc.innerHTML = "";
  if (_aiChats.length === 0) {
    const _0x033bba = document.createElement("div");
    _0x033bba.className = "ai-empty-state";
    _0x033bba.textContent = "No recent chats";
    _0xac9fc.appendChild(_0x033bba);
    return;
  }
  _aiChats.forEach((chat) => {
    const _0x7eae = document.createElement("div");
    _0x7eae.className =
      "ai-recent-item" + (chat.id === _aiCurrentChatId ? " active" : "");
    _0x7eae.dataset.chatId = chat.id;
    const _0x0218b = document.createElement("span");
    _0x0218b.className = "ai-recent-item-title";
    _0x0218b.textContent = chat.title || "untitled";
    _0x0218b.onclick = () => _loadChat(chat.id);
    _0x7eae.appendChild(_0x0218b);
    const _0x0ad = document.createElement("button");
    _0x0ad.className = "ai-recent-item-delete";
    _0x0ad.type = "button";
    _0x0ad.title = "Delete conversation";
    _0x0ad.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
    _0x0ad.onclick = (e) => {
      e.stopPropagation();
      _deleteChat(chat.id);
    };
    _0x7eae.appendChild(_0x0ad);
    _0xac9fc.appendChild(_0x7eae);
  });
}
function _deleteChatRecord(id) {
  _oDB()
    .then((db) => {
      const _0xd73ce = db.transaction("chats", "readwrite");
      _0xd73ce.objectStore("chats")["delete"](id);
    })
    ["catch"]((e) => {
      console.error("[O] chat delete failed:", id, e);
    });
}
function _deleteChat(chatId) {
  if (!chatId) return;
  if (!_aiWsReady || !_aiWs) {
    _setAIStatus("not connected");
    _ensureAIWs();
    return;
  }
  _pendingDeleteChatId = chatId;
  _aiWs.send(
    JSON.stringify({
      type: "deleteConversation",
      conversationId: chatId,
    }),
  );
}
function _onConversationDeleted(conversationId) {
  if (!conversationId) return;
  if (_pendingDeleteChatId === conversationId) _pendingDeleteChatId = null;
  _aiChats = _aiChats.filter((c) => c.id !== conversationId);
  _deleteChatRecord(conversationId);
  if (_aiCurrentChatId === conversationId) {
    _aiCurrentChatId = null;
    _clearAIMessages();
    _showAIWelcome(true);
  }
  _renderRecents();
}
function _loadChat(chatId) {
  if (_aiStreaming) return;
  const _0xbf_0x2b8 = _aiChats.find((c) => c.id === chatId);
  if (!_0xbf_0x2b8) return;
  _aiCurrentChatId = chatId;
  _showAIWelcome(false);
  const _0xae2b0d = document.getElementById("aiMessages");
  if (_0xae2b0d) _0xae2b0d.innerHTML = "";
  _0xbf_0x2b8.messages.forEach((msg) => {
    if (msg.role === "user")
      _renderUserMessage(msg.id, msg.content, msg.media ? msg.media.url : null);
    else _renderAssistantMessage(msg);
  });
  if (_0xbf_0x2b8.model) {
    const _0xe533g = document.getElementById("aiModelPopup");
    if (
      _0xe533g &&
      _0xe533g.querySelector(
        `.ai-model-item[data-model-id="${_0xbf_0x2b8.model}"]`,
      )
    )
      _selectModel(_0xbf_0x2b8.model);
  }
  _renderRecents();
}
function _startScreenshare() {
  if (_screenshareStream) {
    _toast("screenshare already active");
    return;
  }
  if (!(
    window.documentPictureInPicture &&
    window.documentPictureInPicture.requestWindow
  )) {
    _toast("Picture-in-Picture is not supported in this browser");
    return;
  }
  alert(
    "Choose the tab or window to screenshare, NOT your entire screen.\nThe model currently selected will be used for screenshare.",
  );
  navigator.mediaDevices
    .getDisplayMedia({
      video: {
        displaySurface: "browser",
      },
      audio: false,
    })
    .then((stream) => _initScreenshareStream(stream))
    ["catch"]((err) => {
      if (err && err.name !== "NotAllowedError")
        _toast("screenshare failed: " + (err.message || err));
    });
}
async function _initScreenshareStream(stream) {
  _screenshareStream = stream;
  const _0x16_0x583 = document.createElement("video");
  _0x16_0x583.muted = true;
  _0x16_0x583.playsInline = true;
  _0x16_0x583.srcObject = stream;
  try {
    await _0x16_0x583.play();
  } catch (e) {}
  _screenshareVideo = _0x16_0x583;
  const _0x78b = stream.getVideoTracks()[0];
  if (_0x78b) _0x78b.addEventListener("ended", _stopScreenshare);
  _screenshareChatId = null;
  await _openScreenshareWindow();
}
function _stopScreenshare() {
  if (_screenshareStream) {
    _screenshareStream.getTracks().forEach((t) => t.stop());
    _screenshareStream = null;
  }
  _screenshareVideo = null;
  if (_screenshareWin) {
    try {
      _screenshareWin.close();
    } catch (e) {}
    _screenshareWin = null;
  }
  _screenshareUi = null;
  _screenshareStreaming = false;
  _screenshareChatId = null;
  _screenshareAsstId = null;
  _screenshareContent = "";
  _screenshareReasoning = "";
  _pendingScreenshareUserMsg = null;
  _pendingScreenshareMediaResolve = null;
}
function _captureScreenshot() {
  return new Promise((resolve, reject) => {
    try {
      const _0xc68dae = _screenshareVideo;
      if (!_0xc68dae) {
        reject(new Error("no active screenshare"));
        return;
      }
      const _0xcf2f5d = document.createElement("canvas");
      _0xcf2f5d.width = _0xc68dae.videoWidth || 1280;
      _0xcf2f5d.height = _0xc68dae.videoHeight || 720;
      const _0xga11de = _0xcf2f5d.getContext("2d");
      _0xga11de.drawImage(_0xc68dae, 0, 0, _0xcf2f5d.width, _0xcf2f5d.height);
      _0xcf2f5d.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("capture failed"));
      }, "image/png");
    } catch (e) {
      reject(e);
    }
  });
}
async function _openScreenshareWindow(_0x4b15fd) {
  try {
    _0x4b15fd = await window.documentPictureInPicture.requestWindow({
      width: 380,
      height: 520,
    });
  } catch (e) {
    _toast("could not open the AI screenshare window");
    _stopScreenshare();
    return;
  }
  _screenshareWin = _0x4b15fd;
  const _0xgg59ga = _0x4b15fd.document.createElement("style");
  _0xgg59ga.textContent = `
        * { box-sizing: border-box; }
        html, body { margin: 0; height: 100%; background: #0c0c14; color: #e8e8f0; font-family: 'Inter', system-ui, sans-serif; }
        .ss-wrap { display: flex; flex-direction: column; height: 100%; }
        .ss-header { padding: 10px 12px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.5); letter-spacing: .02em; border-bottom: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .ss-messages { flex: 1; overflow-y: auto; padding: 10px 12px; display: flex; flex-direction: column; gap: 12px; }
        .ss-turn { display: flex; flex-direction: column; gap: 6px; }
        .ss-user { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; white-space: pre-wrap; }
        .ss-assistant { font-size: 13.5px; line-height: 1.5; color: rgba(255,255,255,0.92); word-wrap: break-word; }
        .ss-assistant a { color: #a78bfa; }
        .ss-assistant p { margin: 0 0 8px; }
        .ss-assistant p:last-child { margin-bottom: 0; }
        .ss-status { font-size: 11px; color: rgba(255,255,255,0.4); padding: 0 12px 4px; min-height: 14px; flex-shrink: 0; }
        .ss-inputrow { display: flex; gap: 6px; padding: 8px 10px; border-top: 1px solid rgba(255,255,255,0.08); flex-shrink: 0; }
        .ss-textarea { flex: 1; resize: none; min-height: 34px; max-height: 90px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; padding: 8px 10px; font-family: inherit; font-size: 13px; }
        .ss-textarea:focus { outline: none; border-color: rgba(167,139,250,0.5); }
        .ss-btn { border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ss-send { width: 34px; height: 34px; background: #8b7cf6; color: #fff; }
        .ss-send:disabled, .ss-solve:disabled { opacity: .4; cursor: default; }
        .ss-solverow { padding: 0 10px 8px; flex-shrink: 0; }
        .ss-solve { width: 100%; padding: 8px; background: rgba(167,139,250,0.15); color: #cbb8ff; font-size: 12.5px; font-weight: 500; border: 1px solid rgba(167,139,250,0.3); }
        .ss-solve:hover:not(:disabled) { background: rgba(167,139,250,0.25); }
        .ss-dots { display: flex; gap: 4px; padding: 2px 0; }
        .ss-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.4); animation: ssBlink 1.2s infinite ease-in-out; }
        .ss-dot:nth-child(2) { animation-delay: .15s; }
        .ss-dot:nth-child(3) { animation-delay: .3s; }
        @keyframes ssBlink { 0%, 80%, 100% { opacity: .25; } 40% { opacity: 1; } }
    `;
  _0x4b15fd.document.head.appendChild(_0xgg59ga);
  const _0xa829a = _0x4b15fd.document.createElement("div");
  _0xa829a.className = "ss-wrap";
  const _0x257c = _0x4b15fd.document.createElement("div");
  _0x257c.className = "ss-header";
  _0x257c.textContent = "lucianland AI - screenshare";
  _0xa829a.appendChild(_0x257c);
  const _0xa78ccf = _0x4b15fd.document.createElement("div");
  _0xa78ccf.className = "ss-messages";
  _0xa829a.appendChild(_0xa78ccf);
  const _0x0a0e = _0x4b15fd.document.createElement("div");
  _0x0a0e.className = "ss-status";
  _0xa829a.appendChild(_0x0a0e);
  const _0x43bb = _0x4b15fd.document.createElement("div");
  _0x43bb.className = "ss-solverow";
  const _0x85815d = _0x4b15fd.document.createElement("button");
  _0x85815d.type = "button";
  _0x85815d.className = "ss-btn ss-solve";
  _0x85815d.textContent = "Solve question on this page";
  _0x43bb.appendChild(_0x85815d);
  _0xa829a.appendChild(_0x43bb);
  const _0x0cef9f = _0x4b15fd.document.createElement("div");
  _0x0cef9f.className = "ss-inputrow";
  const _0x8eef3d = _0x4b15fd.document.createElement("textarea");
  _0x8eef3d.className = "ss-textarea";
  _0x8eef3d.placeholder = "Ask about this tab…";
  _0x8eef3d.rows = 1;
  const _0xf6_0xf5b = _0x4b15fd.document.createElement("button");
  _0xf6_0xf5b.type = "button";
  _0xf6_0xf5b.className = "ss-btn ss-send";
  _0xf6_0xf5b.innerHTML =
    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 7-7 7 7M12 19V5"/></svg>';
  _0x0cef9f.appendChild(_0x8eef3d);
  _0x0cef9f.appendChild(_0xf6_0xf5b);
  _0xa829a.appendChild(_0x0cef9f);
  _0x4b15fd.document.body.appendChild(_0xa829a);
  const _0xc4096d = () => {
    const _0x4c1g7g = _0x8eef3d.value.trim();
    if (!_0x4c1g7g || _screenshareStreaming) return;
    _0x8eef3d.value = "";
    _sendScreenshareMessage(_0x4c1g7g);
  };
  _0xf6_0xf5b.onclick = _0xc4096d;
  _0x8eef3d.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      _0xc4096d();
    }
  });
  _0x85815d.onclick = () => {
    if (!_screenshareStreaming) _sendScreenshareMessage(SOLVE_QUESTION_PROMPT);
  };
  _0x4b15fd.addEventListener("pagehide", _stopScreenshare, {
    once: true,
  });
  _screenshareUi = {
    messages: _0xa78ccf,
    status: _0x0a0e,
    sendBtn: _0xf6_0xf5b,
    solveBtn: _0x85815d,
    textarea: _0x8eef3d,
    currentTurn: null,
    currentAssistantEl: null,
    currentDots: null,
  };
}
function _screenshareSetStatus(text) {
  if (_screenshareUi && _screenshareUi.status)
    _screenshareUi.status.textContent = text || "";
}
function _screenshareRenderUser(text) {
  if (!_screenshareUi || !_screenshareWin) return;
  const _0x17de9d = _screenshareWin.document;
  const _0x17_0xe82 = _0x17de9d.createElement("div");
  _0x17_0xe82.className = "ss-turn";
  const _0xgaf0c = _0x17de9d.createElement("div");
  _0xgaf0c.className = "ss-user";
  _0xgaf0c.textContent = "📸 " + text;
  _0x17_0xe82.appendChild(_0xgaf0c);
  _screenshareUi.messages.appendChild(_0x17_0xe82);
  _screenshareUi.currentTurn = _0x17_0xe82;
  _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
}
function _screenshareShowThinking() {
  if (!_screenshareUi || !_screenshareUi.currentTurn || !_screenshareWin)
    return;
  const _0xb245g = _screenshareWin.document.createElement("div");
  _0xb245g.className = "ss-dots";
  _0xb245g.innerHTML =
    '<span class="ss-dot"></span><span class="ss-dot"></span><span class="ss-dot"></span>';
  _screenshareUi.currentTurn.appendChild(_0xb245g);
  _screenshareUi.currentDots = _0xb245g;
}
function _screenshareUpdateResponse() {
  if (!_screenshareUi || !_screenshareUi.currentTurn || !_screenshareWin)
    return;
  if (_screenshareUi.currentDots) {
    _screenshareUi.currentDots.remove();
    _screenshareUi.currentDots = null;
  }
  if (!_screenshareUi.currentAssistantEl) {
    const _0xae990a = _screenshareWin.document.createElement("div");
    _0xae990a.className = "ss-assistant";
    _screenshareUi.currentTurn.appendChild(_0xae990a);
    _screenshareUi.currentAssistantEl = _0xae990a;
  }
  _renderMarkdown(_screenshareUi.currentAssistantEl, _screenshareContent || "");
  _screenshareUi.messages.scrollTop = _screenshareUi.messages.scrollHeight;
}
async function _sendScreenshareMessage(promptText, _0xb4_0x44d) {
  if (_screenshareStreaming) return;
  if (!promptText) return;
  if (_aiStreaming) {
    _screenshareSetStatus("main chat is busy, try again in a moment");
    return;
  }
  if (!_screenshareVideo) {
    _screenshareSetStatus("no tab is being shared");
    return;
  }
  if (!_aiWsReady || !_aiWs) {
    _ensureAIWs();
    _screenshareSetStatus("not connected");
    return;
  }
  if (_screenshareUi) {
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = true;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = true;
  }
  _screenshareSetStatus("capturing screenshot…");
  try {
    _0xb4_0x44d = await _captureScreenshot();
  } catch (e) {
    _screenshareOnError("screenshot failed");
    return;
  }
  const _0x95g = new File([_0xb4_0x44d], "screenshot.png", {
    type: "image/png",
  });
  const _0xcae54c = URL.createObjectURL(_0xb4_0x44d);
  _screenshareRenderUser(promptText);
  _screenshareShowThinking();
  _screenshareStreaming = true;
  _screenshareContent = "";
  _screenshareReasoning = "";
  _screenshareAsstId = _newId();
  _pendingScreenshareUserMsg = {
    id: _newId(),
    content: promptText,
    media: {
      url: _0xcae54c,
      blob: _0x95g,
    },
  };
  _screenshareSetStatus("uploading screenshot…");
  try {
    const _0xd8006f = await _fileToBase64(_0x95g);
    const _0x85561f = await new Promise((resolve, reject) => {
      _pendingScreenshareMediaResolve = resolve;
      _aiWs.send(
        JSON.stringify({
          type: "mediaStart",
          model: _aiSelectedModel,
          mime: _0x95g.type,
          conversationId: _screenshareChatId || undefined,
        }),
      );
      setTimeout(() => {
        if (_pendingScreenshareMediaResolve === resolve) {
          _pendingScreenshareMediaResolve = null;
          reject(new Error("upload timed out"));
        }
      }, 15000);
    });
    for (let i = 0; i < _0xd8006f.length; i += AI_MEDIA_CHUNK_CHARS) {
      _aiWs.send(
        JSON.stringify({
          type: "mediaChunk",
          mediaId: _0x85561f,
          chunk: _0xd8006f.slice(i, i + AI_MEDIA_CHUNK_CHARS),
        }),
      );
    }
    _aiWs.send(
      JSON.stringify({
        type: "mediaDone",
        mediaId: _0x85561f,
        prompt: promptText,
      }),
    );
    _screenshareSetStatus("");
  } catch (err) {
    _screenshareOnError(err.message || "upload failed");
  }
}
function _handleScreenshareMessage(m) {
  switch (m.type) {
    case "message": {
      _screenshareChatId = m.conversationId;
      if (_pendingScreenshareUserMsg) {
        const _0xdgfab = _getChat(_screenshareChatId);
        if (!_0xdgfab.title) _0xdgfab.title = m.title || "Screenshare";
        _0xdgfab.model = m.model || _aiSelectedModel;
        const _0xf94cfc = m.messageId || _pendingScreenshareUserMsg.id;
        _0xdgfab.messages.push({
          id: _0xf94cfc,
          role: "user",
          content: _pendingScreenshareUserMsg.content,
          media: _pendingScreenshareUserMsg.media,
        });
        _persistChat(_0xdgfab);
        _pendingScreenshareUserMsg = null;
      }
      _renderRecents();
      break;
    }
    case "thinking":
      if (!_screenshareReasoning) _screenshareSetStatus("Reasoning…");
      _screenshareReasoning += m.delta || "";
      break;
    case "content":
      if (!_screenshareContent) _screenshareSetStatus("");
      _screenshareContent += m.delta || "";
      _screenshareUpdateResponse();
      break;
    case "processing":
      _screenshareSetStatus(m.text || "");
      break;
    case "usage":
      break;
    case "image":
    case "video":
      _screenshareContent +=
        (_screenshareContent ? "\n\n" : "") + `[${m.type}](${m.url})`;
      _screenshareUpdateResponse();
      break;
    case "done":
      _screenshareFinish();
      break;
    case "error":
      if (_pendingScreenshareMediaResolve)
        _pendingScreenshareMediaResolve = null;
      _screenshareOnError(m.text || "error");
      break;
  }
}
function _screenshareFinish() {
  const _0x14900d = _getChat(_screenshareChatId);
  if (_0x14900d) {
    const _0xefc6c = {
      id: _screenshareAsstId,
      role: "assistant",
      content: _screenshareContent,
      reasoning: _screenshareReasoning || undefined,
    };
    _0x14900d.messages.push(_0xefc6c);
    _persistChat(_0x14900d);
  }
  _renderRecents();
  if (_screenshareUi) {
    _screenshareUi.currentTurn = null;
    _screenshareUi.currentAssistantEl = null;
    _screenshareUi.currentDots = null;
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = false;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = false;
  }
  _screenshareStreaming = false;
  _screenshareSetStatus("");
}
function _screenshareOnError(text) {
  _screenshareSetStatus(text);
  if (_screenshareUi) {
    if (_screenshareUi.currentDots) {
      _screenshareUi.currentDots.remove();
      _screenshareUi.currentDots = null;
    }
    _screenshareUi.currentTurn = null;
    _screenshareUi.currentAssistantEl = null;
    if (_screenshareUi.sendBtn) _screenshareUi.sendBtn.disabled = false;
    if (_screenshareUi.solveBtn) _screenshareUi.solveBtn.disabled = false;
  }
  _pendingScreenshareUserMsg = null;
  _pendingScreenshareMediaResolve = null;
  _screenshareStreaming = false;
}

// Load the editable startup README after the application has initialized.
(() => {
  const base = document.currentScript.src;
  for (const file of ["ui.js", "readme.js"]) {
    const script = document.createElement("script");
    script.src = new URL(file, base).href;
    script.onload = () => script.remove();
    document.head.appendChild(script);
  }
})();
