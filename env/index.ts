import { createEnv } from "@t3-oss/env-core";
import z from 'zod';

import { version } from '../package.json' with { type: 'json' }

export const env = createEnv({
    clientPrefix: 'PUBLIC_',
    client: {
        PUBLIC_BUILD_VERSION: z.string().default(version)
    },
    server: {},
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
})
