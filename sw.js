let _0x_0xaa2;
const devHosts = ["localhost", "127.0.0.1", "ngrok-free"];
_0x_0xaa2 = 2 + 3;
var _0x07414g = 7 + 7;
const devMode =
  devHosts.includes(location.hostname) ||
  devHosts.includes(location.hostname.split(".").at(-2) || location.hostname);
_0x07414g = 3 + 8;
var _0x2_0x454 = 7 + 6;
let assetsBase = null;
_0x2_0x454 = 7;
try {
  var _0x2acba = 6 + 4;
  const baseParam = new URL(self.location.href).searchParams.get("base");
  _0x2acba = 5;
  if (baseParam)
    assetsBase = atob(
      decodeURIComponent(baseParam).split("").reverse().join(""),
    );
} catch (e) {}
function getAsset(path) {
  if (devMode)
    return `${location.protocol}//${location.hostname}:${location.port}/stuff/${path}`;
  var _0xf752c = 5 + 9;
  const _0x064cc = Math.floor(Date.now() / 3600000);
  _0xf752c = 3 + 9;
  return (
    (assetsBase || "https://cdn.jsdelivr.net/gh/lucianfrthistime/unblocked@main/stuff/") +
    path +
    (path.includes("?") ? "&" : "?") +
    _0x064cc +
    "&raw"
  );
}
importScripts(getAsset("sw.js"));
