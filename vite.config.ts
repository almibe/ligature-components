import { defineConfig } from 'vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import postcssLit from 'rollup-plugin-postcss-lit';

export default defineConfig({
  plugins: [
    wasm(),
    topLevelAwait(),
    postcssLit(),
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
  