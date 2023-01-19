// import adapter from "@sveltejs/adapter-auto";
import adapter from '@sveltejs/adapter-node'
// import adapter from "@sveltejs/adapter-static";

import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $components: 'src/components',
      $types: 'sockets/types',
      $store: 'src/store',
      $sockets: 'sockets/',
      $routes: 'src/routes/',
    },
    env: {
      dir: './',
    },
  },
}

export default config
