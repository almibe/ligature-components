import { defineConfig } from 'vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait()
  ]
});

// old config
// export default defineConfig({
//     build: {
//       lib: {
//         entry: 'src/wander-lang.ts',
//         formats: ['es'],
//       },
//       rollupOptions: {
//         external: /^lit/,
//       },
//     },
//   })
  