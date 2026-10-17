const devHosts = ["localhost", "127.0.0.1", "ngrok-free"];
window.devMode =
  devHosts.includes(location.hostname) ||
  devHosts.includes(location.hostname.split(".").at(-2) || location.hostname);
const serverList = [
  "cdn.northstreetumc.org",
  "cdn.vipersfutbol.com",
  "cdn.pcesc.org",
  "cdn.kcchallengevbc.com",
  "cdn.slcbmooc.org",
  "cdn.topstargym.net",
  "cdn.goaplytexas.org",
  "wss://athollcottage.com/connection/",
  "wss://api.personalloanonline.net/ws/",
];
window.controller = null;
window.transport = null;
window.shadowRoot = null;
function wlspUrl(entry) {
  if (entry.includes("://")) return entry;
  return `wss://${entry}/`;
}
function isBackupServer(entry) {
  return entry.includes("://");
}
function testWlspDomain(entry) {
  return new Promise((resolve) => {
    let _0xg8ec8b;
    try {
      _0xg8ec8b = new WebSocket(wlspUrl(entry));
    } catch {
      resolve(null);
      return;
    }
    _0xg8ec8b.binaryType = "arraybuffer";
    let _0xc074f = false;
    let t = 0;
    const _0x9e32f = (Math.floor(Math.random() * 4294967294) + 1) >>> 0;
    const _0xfe3ae = setTimeout(() => {
      try {
        _0xg8ec8b.close();
      } catch {}
      resolve(null);
    }, 3000);
    const _0x8cd3d = (ping) => {
      clearTimeout(_0xfe3ae);
      _0xg8ec8b.onmessage = _0xg8ec8b.onerror = _0xg8ec8b.onclose = null;
      try {
        _0xg8ec8b.close();
      } catch {}
      resolve(ping);
    };
    _0xg8ec8b.onmessage = (e) => {
      const _0x4da = new DataView(e.data);
      const _0x181e0d = _0x4da.getUint8(0);
      const _0x_0xed8 = _0x4da.getUint32(1, true);
      if (!_0xc074f) {
        if (_0x181e0d === 5 && _0x_0xed8 === 0) {
          _0xg8ec8b.send(new Uint8Array([5, 0, 0, 0, 0, 2, 1]));
        } else if (_0x181e0d === 3 && _0x_0xed8 === 0) {
          _0xc074f = true;
          const _0xdf626b = new TextEncoder().encode("127.0.0.1");
          const _0xe849e = new ArrayBuffer(8 + _0xdf626b.length);
          const v = new DataView(_0xe849e);
          v.setUint8(0, 1);
          v.setUint32(1, _0x9e32f, true);
          v.setUint8(5, 1);
          v.setUint16(6, 69, true);
          new Uint8Array(_0xe849e).set(_0xdf626b, 8);
          t = performance.now();
          _0xg8ec8b.send(_0xe849e);
        }
        return;
      }
      if (_0x_0xed8 !== _0x9e32f) return;
      _0x8cd3d(Math.round(performance.now() - t));
    };
    _0xg8ec8b.onerror = _0xg8ec8b.onclose = () => _0x8cd3d(null);
  });
}
async function getWlsp() {
  const _0xd_0x26f = localStorage.WID;
  const _0x9186f = +_0xd_0x26f;
  const _0xd29c =
    _0xd_0x26f !== undefined &&
    _0xd_0x26f !== "" &&
    Number.isInteger(_0x9186f) &&
    _0x9186f >= 0 &&
    _0x9186f < serverList.length &&
    !isBackupServer(serverList[_0x9186f]);
  if (_0xd29c) {
    const ping = await testWlspDomain(serverList[_0x9186f]);
    if (ping !== null) {
      window.WlspPing = ping;
      window.WlspIsBackup = false;
      return wlspUrl(serverList[_0x9186f]);
    }
  }
  for (let i = 0; i < serverList.length; i++) {
    const ping = await testWlspDomain(serverList[i]);
    if (ping !== null) {
      if (!isBackupServer(serverList[i])) localStorage.WID = i;
      window.WlspPing = ping;
      window.WlspIsBackup = isBackupServer(serverList[i]);
      return wlspUrl(serverList[i]);
    }
  }
  window.WlspIsBackup = isBackupServer(serverList[serverList.length - 1]);
  return wlspUrl(serverList[serverList.length - 1]);
}
window.getAsset = (path) => {
  if (devMode)
    return `${location.protocol}//${location.hostname}:${location.port}/stuff/${path}`;
  const hour = Math.floor(Date.now() / 3600000);
  return (
    (window.assetsBase ||
      "https://cdn.jsdelivr.net/gh/lucianfrthistime/unblocked@main/stuff/") +
    path +
    (path.includes("?") ? "&" : "?") +
    hour +
    "&raw"
  );
};
function preload(href) {
  const _0xe06d = document.createElement("link");
  _0xe06d.rel = "preload";
  _0xe06d.as = "script";
  _0xe06d.href = href;
  document.head.appendChild(_0xe06d);
}
window.loadScript = (src, onload, onerror, id, parent) => {
  return new Promise((res, rej) => {
    const el = document.createElement("script");
    el.src = src;
    id && (el.id = id);
    el.onload = () => {
      if (onload) onload();
      else el.remove();
      res();
    };
    el.onerror = () => {
      if (onerror) onerror();
      else el.remove();
      rej();
    };
    (parent || document.head || document.documentElement).appendChild(el);
  });
};
async function initTransport(client) {
  for (let i = 0; i < 1000; i++) {
    try {
      await client.init();
      return;
    } catch (e) {
      if (!String(e).includes("wasm not loaded")) throw e;
      await new Promise((r) => setTimeout(r, 10));
    }
  }
  throw new Error("transport init timed out");
}
function withTimeout(p, ms) {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error("timed out")), ms)),
  ]);
}
(async () => {
  while (document.body.firstChild)
    document.body.removeChild(document.body.firstChild);
  [...document.head.childNodes].forEach((n) => {
    if (
      n.nodeType === 1 &&
      n.tagName === "LINK" &&
      (n.rel === "preconnect" || n.rel === "dns-prefetch")
    )
      return;
    n.remove();
  });
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647";
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({
    mode: "closed",
  });
  const loader = document.createElement("div");
  loader.innerText = "start";
  Object.assign(loader.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background: "#000",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "999999",
    fontSize: "20px",
    fontFamily: "sans-serif",
  });
  shadow.appendChild(loader);
  const isSingleFile = (() => {
    try {
      const url = new URL(location.href);
      if (url.searchParams.has("sf")) return true;
    } catch {}
    return new RegExp("(?:[?&])sf(?:[=&]|$)", "").test(location.href);
  })();
  if (window.top !== window.self && isSingleFile) {
    loader.innerText = "singlefile, waiting for top frame";
    const nonce = Math.random().toString(36).slice(2);
    await new Promise((resolve) => {
      const onMessage = (e) => {
        if (e.data !== nonce) return;
        window.removeEventListener("message", onMessage);
        resolve();
      };
      window.addEventListener("message", onMessage);
      window.top.postMessage(nonce, "*");
    });
  }
  loader.innerText = "loading jet";
  const apiUrl = getAsset("sj/jet.api.js");
  const utilsUrl = getAsset("sj/jet.utils.js");
  preload(apiUrl);
  preload(utilsUrl);
  await loadScript(getAsset("sj/jet.core.js"));
  await loadScript(apiUrl);
  await loadScript(utilsUrl);
  loader.innerText =
    "registering service worker (if you are stuck here, try CTRL + SHIFT + R)";
  const swBase = window.assetsBase
    ? "?raw&base=" +
      encodeURIComponent(btoa(window.assetsBase).split("").reverse().join(""))
    : "";
  const swUrl = (window.swPath || "sw.js") + swBase;
  const swHref = new URL(swUrl, location.href).href;
  try {
    const existingRegs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      existingRegs.map((r) => r.unregister()["catch"](() => {})),
    );
  } catch {}
  let reg;
  try {
    reg = await withTimeout(
      navigator.serviceWorker.register(swUrl, {
        updateViaCache: "none",
      }),
      5000,
    );
  } catch (e) {
    location.reload();
    return;
  }
  try {
    await withTimeout(reg.update(), 3000);
  } catch {}
  const sw = reg.installing || reg.waiting || reg.active;
  if (sw && sw.state !== "activated") {
    try {
      await withTimeout(
        new Promise((resolve, reject) => {
          sw.addEventListener("statechange", function () {
            if (this.state === "activated") resolve();
            else if (this.state === "redundant") reject(new Error("redundant"));
          });
        }),
        5000,
      );
    } catch (e) {
      location.reload();
      return;
    }
  }
  try {
    await withTimeout(navigator.serviceWorker.ready, 5000);
  } catch (e) {
    location.reload();
    return;
  }
  const isNew = () => navigator.serviceWorker.controller?.scriptURL === swHref;
  if (!isNew()) {
    await new Promise((r) => {
      navigator.serviceWorker.addEventListener(
        "controllerchange",
        () => isNew() && r(),
      );
      setTimeout(r, 2000);
    });
    if (!isNew() && !sessionStorage.swReloaded) {
      sessionStorage.swReloaded = 1;
      location.reload();
      return;
    }
  }
  sessionStorage.removeItem("swReloaded");
  let swAlive = false;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(new URL("__sw_alive", reg.scope).href, {
        cache: "no-store",
      });
      if ((await res.text()) === "true") {
        swAlive = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 10));
  }
  if (!swAlive) {
    try {
      await reg.unregister();
    } catch {}
    location.reload();
    return;
  }
  setInterval(async () => {
    try {
      const res = await fetch(new URL("__sw_alive", reg.scope).href, {
        cache: "no-store",
      });
      if ((await res.text()) !== "true") throw 0;
    } catch {
      try {
        const existingRegs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          existingRegs.map((r) => r.unregister()["catch"](() => {})),
        );
      } catch {}
      reg = await navigator.serviceWorker.register(swUrl, {
        updateViaCache: "none",
      });
      await navigator.serviceWorker.ready;
    }
    controller.serviceWorkerController = navigator.serviceWorker.controller;
    controller.setupMessagePort();
  }, 20 * 1000);
  loader.innerText = "finding unblocked lucianland server";
  if (!window.wlspServer) {
    window.wlspServer = devMode
      ? (location.protocol.includes("s") ? "wss://" : "ws://") +
        location.host +
        "/"
      : await getWlsp();
  }
  loader.innerText = "initializing transport";
  const transportUrl = getAsset(localStorage.TRNSPRT || "curl/index.mjs");
  const { default: TransportClient } = await import(transportUrl);
  transport = new TransportClient({
    wisp: window.wlspServer,
  });
  await initTransport(transport);
  loader.innerText = "initializing SJ";
  const { Controller: Controller } = $jetController;
  controller = new Controller({
    serviceworker: navigator.serviceWorker.controller,
    transport: transport,
    jetConfig: {
      maskedfiles: ["jet.inject.js", "jet.wasm.js"],
      flags: {
        syncxhr: false,
        disableComputedWrap: false,
        rewriterLogs: false,
        captureErrors: false,
        cleanErrors: false,
        scramitize: false,
        sourcemaps: false,
        destructureRewrites: true,
        allowInvalidJs: true,
        debugTrampolines: false,
        debugSourceURL: false,
        allowFailedIntercepts: true,
        encapsulateWorkers: true,
      },
    },
    config: {
      jetPath: getAsset("sj/jet.core.js"),
      wasmPath: getAsset("sj/jet.wasm"),
      injectPath: getAsset("sj/jet.inject.js"),
      virtualWasmPath: "jet.wasm.js",
      codec: {
        encode: (url) => {
          if (!url) return url;
          let g = globalThis.__jck;
          if (!g) {
            const s =
              location.origin +
              new Date().getUTCMonth() +
              navigator.userAgent +
              navigator.hardwareConcurrency +
              new Date().getTimezoneOffset();
            let h1 = 2166136261,
              h2 = 2654435769;
            for (let i = 0; i < s.length; i++) {
              h1 ^= s.charCodeAt(i);
              h1 = Math.imul(h1, 16777619);
              h2 = Math.imul(h2 ^ s.charCodeAt(i), 2246822507);
            }
            g = globalThis.__jck = {
              s1: h1 >>> 0,
              s2: h2 >>> 0,
              enc: new TextEncoder(),
              dec: new TextDecoder(),
            };
          }
          const d = g.enc.encode(url);
          const words = d.length >> 2;
          const view = new Uint32Array(d.buffer, d.byteOffset, words);
          let s1 = g.s1,
            s2 = g.s2;
          for (let w = 0; w < words; w++) {
            s1 = (s1 + 1831565813) | 0;
            let t1 = Math.imul(s1 ^ (s1 >>> 15), 1 | s1);
            t1 = (t1 + Math.imul(t1 ^ (t1 >>> 7), 61 | t1)) ^ t1;
            s2 = (s2 + 2654435769) | 0;
            let t2 = Math.imul(s2 ^ (s2 >>> 15), 1 | s2);
            t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
            view[w] ^= t1 ^ (t1 >>> 14) ^ (t2 ^ (t2 >>> 14));
          }
          for (let i = words * 4; i < d.length; i++) {
            s1 = (s1 + 1831565813) | 0;
            let t1 = Math.imul(s1 ^ (s1 >>> 15), 1 | s1);
            t1 = (t1 + Math.imul(t1 ^ (t1 >>> 7), 61 | t1)) ^ t1;
            s2 = (s2 + 2654435769) | 0;
            let t2 = Math.imul(s2 ^ (s2 >>> 15), 1 | s2);
            t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
            d[i] ^= (t1 ^ (t1 >>> 14) ^ (t2 ^ (t2 >>> 14))) & 255;
          }
          return btoa(String.fromCharCode.apply(null, d))
            .replace(new RegExp("\\+", "g"), "-")
            .replace(new RegExp("\\/", "g"), "_")
            .replace(new RegExp("=+$", ""), "");
        },
        decode: (url) => {
          if (!url) return url;
          let g = globalThis.__jck;
          if (!g) {
            const s =
              location.origin +
              new Date().getUTCMonth() +
              navigator.userAgent +
              navigator.hardwareConcurrency +
              new Date().getTimezoneOffset();
            let h1 = 2166136261,
              h2 = 2654435769;
            for (let i = 0; i < s.length; i++) {
              h1 ^= s.charCodeAt(i);
              h1 = Math.imul(h1, 16777619);
              h2 = Math.imul(h2 ^ s.charCodeAt(i), 2246822507);
            }
            g = globalThis.__jck = {
              s1: h1 >>> 0,
              s2: h2 >>> 0,
              enc: new TextEncoder(),
              dec: new TextDecoder(),
            };
          }
          const bin = atob(
            url
              .replace(new RegExp("-", "g"), "+")
              .replace(new RegExp("_", "g"), "/")
              .padEnd(url.length + ((4 - (url.length % 4)) % 4), "="),
          );
          const len = bin.length;
          const o = new Uint8Array(len);
          const words = len >> 2;
          const view = new Uint32Array(o.buffer, 0, words);
          let s1 = g.s1,
            s2 = g.s2;
          let i = 0;
          for (let w = 0; w < words; w++, i += 4) {
            s1 = (s1 + 1831565813) | 0;
            let t1 = Math.imul(s1 ^ (s1 >>> 15), 1 | s1);
            t1 = (t1 + Math.imul(t1 ^ (t1 >>> 7), 61 | t1)) ^ t1;
            s2 = (s2 + 2654435769) | 0;
            let t2 = Math.imul(s2 ^ (s2 >>> 15), 1 | s2);
            t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
            const k = t1 ^ (t1 >>> 14) ^ (t2 ^ (t2 >>> 14));
            view[w] =
              (bin.charCodeAt(i) |
                (bin.charCodeAt(i + 1) << 8) |
                (bin.charCodeAt(i + 2) << 16) |
                (bin.charCodeAt(i + 3) << 24)) ^
              k;
          }
          for (; i < len; i++) {
            s1 = (s1 + 1831565813) | 0;
            let t1 = Math.imul(s1 ^ (s1 >>> 15), 1 | s1);
            t1 = (t1 + Math.imul(t1 ^ (t1 >>> 7), 61 | t1)) ^ t1;
            s2 = (s2 + 2654435769) | 0;
            let t2 = Math.imul(s2 ^ (s2 >>> 15), 1 | s2);
            t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
            o[i] =
              bin.charCodeAt(i) ^
              ((t1 ^ (t1 >>> 14) ^ (t2 ^ (t2 >>> 14))) & 255);
          }
          return g.dec.decode(o);
        },
      },
      prefix: new URL("./~/", location.href).pathname,
    },
  });
  await controller.wait();
  controller.guardServiceWorkerRevive = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    controller.serviceWorkerController = navigator.serviceWorker.controller;
    controller.setupMessagePort();
  });
  loader.innerText = "loading UI";
  const res = await fetch(getAsset("main.html"));
  const html = await res.text();
  const parsed = new DOMParser().parseFromString(html, "text/html");
  for (const el of [...parsed.head.children]) {
    if (el.tagName === "LINK") document.head.appendChild(el.cloneNode(true));
    else if (el.tagName === "STYLE") {
      const styleClone = el.cloneNode(true);
      styleClone.textContent = styleClone.textContent.replace(
        new RegExp(":root\\b", "g"),
        ":host",
      );
      shadow.appendChild(styleClone);
    }
  }
  shadowRoot = shadow;
  const shadowBody = document.createElement("div");
  Object.assign(shadowBody.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "calc(var(--vh, 1vh) * 100)",
    overflow: "hidden",
    background: "#080810",
    fontFamily: "'Inter', sans-serif",
    color: "#e0e0e0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  });
  shadow.appendChild(shadowBody);
  for (const el of [...parsed.body.children]) {
    if (el.tagName !== "SCRIPT") shadowBody.appendChild(el.cloneNode(true));
  }
  const _gEBI = Document.prototype.getElementById;
  Document.prototype.getElementById = function (id) {
    return shadow.querySelector("#" + CSS.escape(id)) || _gEBI.call(this, id);
  };
  const _qS = Document.prototype.querySelector;
  Document.prototype.querySelector = function (sel) {
    try {
      return shadow.querySelector(sel) || _qS.call(this, sel);
    } catch (e) {
      return _qS.call(this, sel);
    }
  };
  const _qSA = Document.prototype.querySelectorAll;
  Document.prototype.querySelectorAll = function (sel) {
    try {
      const r = shadow.querySelectorAll(sel);
      if (r.length) return r;
    } catch (e) {}
    return _qSA.call(this, sel);
  };
  loader.remove();
  const scripts = [
    ...parsed.head.querySelectorAll("script"),
    ...parsed.body.querySelectorAll("script"),
  ];
  for (const orig of scripts) {
    await new Promise((r) => {
      const s = document.createElement("script");
      if (orig.src) {
        s.src = orig.src;
        s.onload = s.onerror = () => {
          s.remove();
          r();
        };
        document.head.appendChild(s);
      } else {
        s.textContent = orig.textContent;
        document.head.appendChild(s);
        s.remove();
        r();
      }
    });
  }
})();
const schoolList = [
  "deledao",
  "goguardian",
  "lightspeed",
  "linewize",
  "securly",
  ".edu/",
];
function isBlockedDomain(url) {
  try {
    const _0xcbb11d = new URL(url, location.origin).hostname + "/";
    return schoolList.some((school) => _0xcbb11d.includes(school));
  } catch (e) {
    return false;
  }
}
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (isBlockedDomain(url)) return Promise.reject(new Error("Blocked"));
  return originalFetch.apply(this, arguments);
};
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
  if (isBlockedDomain(url)) throw new Error("Blocked");
  return originalOpen.apply(this, arguments);
};
HTMLCanvasElement.prototype.toDataURL = function () {
  return "";
};
