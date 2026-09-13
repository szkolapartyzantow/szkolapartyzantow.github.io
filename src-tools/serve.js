import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join } from "node:path";

const port = 4000;
const hostname = "0.0.0.0";
const rootDir = process.cwd() + "/../narzedzia";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function filePathFromUrl(url) {
  const decoded = decodeURIComponent(url.pathname);
  const safePath = decoded.replaceAll("..", "");
  const pathname = safePath === "/" ? "index.html" : safePath;
  return join(rootDir, pathname);
}

createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const filePath = filePathFromUrl(url);

  if (!existsSync(filePath)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  res.writeHead(200, {
    "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
}).listen(port, hostname);

console.log(`Serving ${rootDir}`);
console.log(`LAN:  http://<your-mac-ip>:${port}`);
console.log(`Local: http://127.0.0.1:${port}`);
