// server.ts
import { join } from "node:path";

const port = 4000;
const hostname = "0.0.0.0";

// Serve files from the current directory (adjust if you want)
const rootDir = process.cwd() + "/../narzedzia";

function filePathFromUrl(url: URL) {
  // Prevent .. path traversal and decode URL paths
  const decoded = decodeURIComponent(url.pathname);
  const safePath = decoded.replaceAll("..", "");
  const pathname = safePath === "/" ? "index.html" : safePath;
  return join(rootDir, pathname);
}

Bun.serve({
  hostname,
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // Basic: only serve GET/HEAD
    if (req.method !== "GET" && req.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const path = filePathFromUrl(url);
    const file = Bun.file(path);

    if (!(await file.exists())) {
      return new Response("Not Found", { status: 404 });
    }

    // Bun will infer Content-Type from file extension
    return new Response(file);
  },
});

console.log(`Serving ${rootDir}`);
console.log(`LAN:  http://<your-mac-ip>:${port}`);
console.log(`Local: http://127.0.0.1:${port}`);
