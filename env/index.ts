import { createEnv } from "@t3-oss/env-core";
import z from 'zod';

import { version } from '../package.json' with { type: 'json' }

export const env = createEnv({
    clientPrefix: 'PUBLIC_',
    client: {
        PUBLIC_BUILD_VERSION: z.string().default(version)
    },
    server: {
        DISCORD_BOT_TOKEN: z.string(),
        DISCORD_CLIENT_ID: z.string(),

        MOD_ROLE: z.string(),

        // support
        SUPPORT_SERVER_CHANNEL: z.string(),
        SUPPORT_TICKET_CATEGORY: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})