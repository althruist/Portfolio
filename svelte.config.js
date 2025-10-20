import adapter from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';

const config = {
	kit: {
		adapter: adapter(),
	},
	preprocess: preprocess(),
};

export default config;