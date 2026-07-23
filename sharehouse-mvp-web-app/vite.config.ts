import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "inline-all",
      enforce: "post",
      generateBundle(_, bundle) {
        const html = bundle["index.html"];
        if (!html || html.type !== "asset") return;
        let source = typeof html.source === "string" ? html.source : new TextDecoder().decode(html.source);
        for (const [name, chunk] of Object.entries(bundle)) {
          if (name === "index.html") continue;
          if (chunk.type === "chunk") {
            source = source.replace(
              new RegExp(`<script[^>]*src=["'][^"']*${chunk.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*></script>`),
              `<script type="module">${chunk.code}</script>`
            );
            delete bundle[name];
          } else if (chunk.type === "asset" && name.endsWith(".css")) {
            const css = typeof chunk.source === "string" ? chunk.source : new TextDecoder().decode(chunk.source);
            source = source.replace(
              new RegExp(`<link[^>]*href=["'][^"']*${chunk.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`),
              `<style>${css}</style>`
            );
            delete bundle[name];
          }
        }
        html.source = source;
      },
    },
  ],
  base: "./",
  build: {
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
