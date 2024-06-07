import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors

  // Note: This also enables usage of TailwindCSS
  preprocess: vitePreprocess(),
}
