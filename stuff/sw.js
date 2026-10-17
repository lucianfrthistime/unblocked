importScripts(getAsset("sj/jet.sw.js"));
self.addEventListener("install", () => {
  void self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("error", function (event) {
  if (isIdbNotFound(event.error ?? event)) {
    try {
      event.preventDefault();
    } catch {}
    cleanup();
  }
});
self.addEventListener("unhandledrejection", function (event) {
  if (isIdbNotFound(event.reason ?? event)) {
    try {
      event.preventDefault();
    } catch {}
    cleanup();
  }
});
function isIdbNotFound(e) {
  const s = (e?.message ?? String(e)) || "";
  if (!new RegExp("NotFound", "i").test(s)) return false;
  if (new RegExp("cache", "i").test(s)) return false;
  return new RegExp(
    "IDB|IndexedDB|IDBDatabase|IDBObjectStore|'transaction' on|'open' on|deleteDatabase|object store",
    "i",
  ).test(s);
}
async function cleanup() {
  try {
    const _0x08cf = (name) =>
      new Promise((res) => {
        const _0x693f9e = indexedDB.open(name);
        _0x693f9e.onsuccess = () => {
          _0x693f9e.result.close();
          _0xg2bgbb();
        };
        _0x693f9e.onerror = _0xg2bgbb;
        const _0xg2bgbb = () => {
          const _0x9ded = indexedDB.deleteDatabase(name);
          _0x9ded.onsuccess = _0x9ded.onerror = _0x9ded.onblocked = res;
        };
      });
    await _0x08cf("__jet_controller");
    const _0x03bb2d = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });
    const _0xa71a = await caches.keys();
    await Promise.all(_0xa71a.map((name) => caches["delete"](name)));
    await self.registration.unregister();
    for (const _0xd475g of _0x03bb2d) _0xd475g.navigate(_0xd475g.url);
    console.log("[sw] attempted to fix self");
  } catch (err) {
    console.error("failed to fix:", err);
  }
}
function isNextDnsSslError(e) {
  const s = (e?.message ?? String(e)) || "";
  return (
    new RegExp("error code 60", "i").test(s) ||
    new RegExp("SSL peer certificate", "i").test(s)
  );
}
async function headText(res) {
  const _0x362fb = res.clone();
  try {
    const _0xf181ae = _0x362fb.body.getReader();
    const { value: value } = await _0xf181ae.read();
    await _0xf181ae.cancel();
    return new TextDecoder().decode(value ?? new Uint8Array());
  } catch {
    return "";
  }
}
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (new URL(event.request.url).pathname.endsWith("/__sw_alive")) {
        return new Response("true", {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      }
      try {
        if ($jetController.shouldRoute(event)) {
          const sjRes = await $jetController.route(event);
          if (
            sjRes.status === 500 &&
            isNextDnsSslError(await headText(sjRes))
          ) {
            return new Response("blocked by DNS for privacy/security", {
              status: 200,
              headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Cache-Control": "no-store",
              },
            });
          }
          return sjRes;
        }
      } catch (e) {
        if (isIdbNotFound(e)) {
          cleanup();
        }
      }
      const path = new URL(event.request.url).pathname;
      if (path.split("/")[1] === "~") {
        const clientsList = await self.clients.matchAll({
          includeUncontrolled: true,
        });
        for (const client of clientsList) {
          client.postMessage({
            $controller$swrevive: {},
          });
        }
        return new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="1"></head><body style="font:16px system-ui;display:grid;place-items:center;height:100vh"><div>proxy warming up, please wait...</div></body></html>',
          {
            status: 503,
            headers: {
              "Content-Type": "text/html; charset=utf-8",
              "Cache-Control": "no-store",
            },
          },
        );
      }
      const res = await fetch(event.request);
      if (
        res.status === 404 &&
        new URL(event.request.url).origin === self.location.origin
      ) {
        const html = await (await fetch(getAsset("404.html"))).text();
        return new Response(html, {
          status: 404,
          headers: {
            "Content-Type": "text/html; charset=utf-8",
          },
        });
      }
      return res;
    })(),
  );
});
