const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET" ||
      new URL(req.url, "http://localhost").pathname !== "/news.txt") {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  fs.readFile(path.join(__dirname, "news.txt"), "utf8", (error, text) => {
    if (error) {
      console.error("Could not read news:", error);
      res.writeHead(500);
      res.end("Unable to load news.");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    });
    res.end(text);
  });
}).listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log(`News server listening on port ${process.env.PORT || 3000}`);
});