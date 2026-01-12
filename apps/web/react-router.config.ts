import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: true,
	// Prerendering runs the server bundle at build time.
	// This app's server bundle initializes DB/auth/websocket-related modules,
	// so prerendering can hang or fail in CI/Vercel and result in a "blank screen".
	prerender: [],
} satisfies Config;
