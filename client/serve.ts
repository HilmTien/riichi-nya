const DIST = new URL("./dist", import.meta.url).pathname;

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname === "/" ? "/index.html" : url.pathname;

    const file = Bun.file(`${DIST}${path}`);
    if (await file.exists()) {
      return new Response(file);
    }

    // SPA fallback
    return new Response(Bun.file(`${DIST}/index.html`));
  },
});

console.log("Serving dist/ on :3000");