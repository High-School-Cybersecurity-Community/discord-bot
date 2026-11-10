import { resolve } from 'node:path';

import contentCollections from '@content-collections/vite';
import { defineConfig } from 'seedcord';

export default defineConfig({
    root: './src',
    instance: './bot.ts',
    build: { start: './index.ts' },
    // content-collections compiles src/data/tags, so handlers can `import { allTags } from 'content-collections'`
    // in dev, codegen, and the build alike.
    vitePlugins: () => [
        contentCollections({
            configPath: resolve(import.meta.dirname, 'content-collections.ts')
        })
    ],
    // set false to hold the running arc and live dot still, which cuts idle redraws by ~80%
    idleAnimation: true,
    hmr: {
        // set true to run tsc --watch alongside the bot, at the cost of a second node process
        typecheck: false
    }
});