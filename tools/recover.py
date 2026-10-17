"""Download a pinned copy of the public assets referenced by the original loader."""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import shutil
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
ORIGINAL = ROOT / "original"
ORIGINAL.mkdir(exist_ok=True)
for name in ("index.html", "index.svg", "icon.svg", "sw.js", "favicon.ico"):
    if not (ORIGINAL / name).exists():
        shutil.copy2(ROOT / name, ORIGINAL / name)

def read(url):
    with urllib.request.urlopen(url, timeout=60) as response:
        return response.read()

tree = json.loads(read("https://api.github.com/repos/TongSherbet/storage/git/trees/main?recursive=1"))
assert not tree.get("truncated"), "Incomplete repository listing"
revision = tree["sha"]

def download(entry):
    relative = Path(entry["path"])
    assert not relative.is_absolute() and ".." not in relative.parts
    url = f"https://raw.githubusercontent.com/TongSherbet/storage/{revision}/{entry['path']}"
    data = read(url)
    expected = entry["sha"]
    actual = hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()
    assert actual == expected, entry["path"]
    for directory in (ORIGINAL / "stuff", ROOT / "stuff"):
        target = directory / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    return {"path": entry["path"], "url": url, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}

with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
    files = list(executor.map(download, [e for e in tree["tree"] if e["type"] == "blob"]))
(ROOT / "recovery-manifest.json").write_text(json.dumps({"repository": "TongSherbet/storage", "revision": revision, "files": files}, indent=2) + "\n")
print(f"Recovered and verified {len(files)} files at {revision}")
