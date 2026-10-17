# Recovered browser source

This directory now contains readable JavaScript and HTML recovered from the supplied loaders and the public assets they reference. This is a reconstruction of distributed client code, not the original author's complete development repository.

## Files to edit

- `stuff/main.html`: application layout and styles.
- `stuff/main.js`: application UI logic, settings, shortcuts, and navigation.
- `stuff/loader.js`: startup, transport selection, service worker registration, and UI loading.
- `index.html`: HTML entry point and asset mirror selection.
- `index.svg` and `icon.svg`: SVG entry points with embedded HTML and JavaScript (these are not ordinary icons).
- `sw.js`: service worker bootstrap; `stuff/sw.js`: service worker implementation.
- `stuff/jet/` and `stuff/sj/`: distributed proxy runtime libraries.
- `stuff/curl/index.mjs` and `stuff/pox/index.mjs`: transport libraries with embedded WebAssembly.
- `stuff/ckv.json` and `stuff/ugs.json`: supplied data catalogs.
- `wasm-source/`: extracted binaries and readable `.wat` instruction listings for all four WebAssembly modules. The two Jet binaries are duplicates supplied at separate paths.

`original/` preserves the five supplied files and untouched downloaded assets. `recovery-manifest.json` records the repository revision, download URLs, sizes, and SHA-256 hashes. All 21 repository assets were downloaded from revision `67da5570d1c74070346ebddee437ee7bdf1fc43f` of `TongSherbet/storage`; they represent that available revision, which may differ from the version originally used with your loaders.

## Run and edit

Use Node.js 24 or newer (Python 3 is only needed for the recovery tools):

```sh
npm ci
npm run serve
```

Open `http://127.0.0.1:8000`. The original localhost branch loads files from `stuff/`. Service workers require HTTP on localhost or HTTPS; opening HTML directly as a file does not work.

The local server explicitly serves `.js` and `.mjs` as `text/javascript` and `.wasm` as `application/wasm`, avoiding Windows MIME mappings that can cause module imports to fail. If an older server is running, stop it with Ctrl+C and restart with `npm run serve`, then refresh the page. To use another port, run `npm run serve -- --port 8001`.

The Node development server includes a Wisp WebSocket backend on the same port, using `@mercuryworkshop/wisp-js`. It binds only to `127.0.0.1` and accepts browser WebSocket connections from the local site. `npm run serve` starts both the static site and backend. The older `tools/serve.py` serves static files only. No backend was present in the recovered snapshot; this backend was added for local operation.

External fonts, analytics, game links, and network services remain external dependencies. Module MIME types and an outbound HTTP request through Wisp v1 have been verified; full browser navigation has not yet been verified.

## Recovery and verification

```sh
npm run deobfuscate
npm run disassemble
npm run verify
```

`deobfuscate` regenerates the readable files from `original/` and overwrites edits to those generated files. `disassemble` regenerates `wasm-source/`. Only run these again if you intend to regenerate the output.

`tools/recover.py` downloads the currently published upstream revision and refreshes `original/stuff/`, `stuff/`, and the manifest. It requires network access and should not be used to reproduce the pinned snapshot; the preserved originals already provide that snapshot.

The JavaScript transforms statically decode string escapes, reversed string literals, constant XOR expressions, property access, and boolean obfuscation. No downloaded application code is executed by the recovery scripts. HTML is parsed and serialized to normalize the upstream minified markup before formatting. Existing meaningful names are preserved; unknown obfuscated and minified names remain rather than inventing original names.

Validation compares normalized syntax trees for all 30 JavaScript files and inline scripts against the statically decoded originals, allowing harmless formatting differences. Data and binary files are checked byte-for-byte. All four extracted WebAssembly binaries pass WABT and Node validation. WAT output is disassembly, not recovered Rust/C/C++ source. WAT reassembly was checked for Jet and curl during recovery; the WABT JavaScript parser exceeded its memory/stack capacity on the deeply nested pox text, so that text's round trip was not verified.

## Recovery limits

Original comments, original names replaced by obfuscation/minification, original module boundaries/build configuration, and high-level WebAssembly source cannot be reconstructed exactly from these artifacts. No source maps were found in the recovered file list. The original empty `favicon.ico` is preserved. Recovery does not grant or change rights to the upstream code; the downloaded asset tree did not contain a license file.

## Local startup fixes

Shortcut icons use `no-referrer` to avoid passing the unproxied homepage as a proxy referrer. Advertising script loaders, their anti-adblock page replacement, and banner containers have been removed. The Discord shortcut has also been removed. The unsupported `pointer-lock` iframe Permissions Policy token was removed. The recovery verifier explicitly accounts for the favicon referrer change, removal of the original advertising block and Discord shortcut, and the README startup hook while continuing to compare the remaining syntax against the originals. Regenerating recovered files overwrites these fixes.

## Startup README

Edit `stuff/README.md` to change the popup shown on every page load. `stuff/readme.js` fetches it without caching and renders sanitized Markdown, with a plain-text fallback if the formatting libraries are unavailable. Continue, the close button, or Escape dismisses the popup. Fetch failures show a dismissible message. The content and script resolve relative to the loaded application script, so they can be served from a subdirectory.

## Interface design

The shared interface theme is the `interface-system` style block in `stuff/main.html`. Its variables control the mint accent, charcoal surfaces, text colors, and navigation rail width. Desktop uses a left navigation rail; layouts at 760px and below use a floating bottom dock. Home, Library, Effects, Settings, AI, browser controls, and the controller mapper share this theme. `stuff/ui.js` supplies accessible search labels, keyboard shortcut activation, and navigation state. The README dialog uses the same theme variables without changing `stuff/README.md`.

Run `npm test` for recovery checks and DOM interaction checks. The DOM tests cover preserved control IDs, CSS parsing, keyboard shortcuts, dynamic bookmarks, navigation state, and README loading/dismissal/error handling. Native dialog behavior and visual layout still need browser verification; jsdom simulates the dialog API.

## GitHub and jsDelivr deployment

The production entry points and asset fallbacks now use `https://cdn.jsdelivr.net/gh/lucianfrthistime/unblocked@main/stuff/`. Upload the entire `stuff/` directory along with `index.html`, `index.svg`, `icon.svg`, `sw.js`, `favicon.ico`, and `.nojekyll` to the repository root. Keep the directory structure intact. The source archive and `node_modules/` are not needed for frontend hosting.

For GitHub Pages, choose Settings > Pages > Deploy from a branch > main > /(root). The entry page will be at `https://lucianfrthistime.github.io/unblocked/` after publication. jsDelivr serves assets, not the website entry page or backend. The service worker bootstrap must stay on the website origin.

A production Wisp endpoint is still required. Set `window.wlspServer` to your `wss://` endpoint before loading the application to override the inherited server selection. No production backend URL has been supplied yet. The local server remains bound to loopback and is not configured for public deployment. For versioned releases, replace `@main` in the entry points and fallback URLs with the same commit hash.
