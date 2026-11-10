import { Seedcord, WinstonConsoleSink, WinstonFileSink } from '@seedcord/gateway';
import { GatewayIntentBits } from 'discord.js';
import { Converters, Envapter } from 'envapt';

import { Support } from '#plugins/Support';
import { Uptime } from '#plugins/Uptime';

export const seedcord = new Seedcord({
    bot: {
        clientOptions: {
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
        },
        interactions: {
            path: './handlers'
        },
        commands: {
            path: './commands',
            guilds: Envapter.getAs('TESTING_GUILD_IDS', Converters.array(), [])
        },
        events: {
            path: './events'
        }
    },
    subscribers: {
        path: null
    },
    botColor: 'Red',
    notifications: {
        developerUsername: 'KTrain5369'
    },
    logger: {
        // winston like the old bot: readable columns on the console, one json file per run
        sinks: [new WinstonConsoleSink(), new WinstonFileSink({ format: 'json' })]
    }
})
    .attach('uptime', Uptime)
    .attach('support', Support);

export default seedcord;
