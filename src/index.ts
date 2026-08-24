import { ActivityType, Client, Events, GatewayIntentBits } from 'discord.js'
import { env } from '../env'

const client = new Client({
    intents: [GatewayIntentBits.MessageContent]
})

client.once(Events.ClientReady, (c) => {
    c.user.setPresence({
        activities: [
            {
                name: `:robot: Version ${env.PUBLIC_BUILD_VERSION}`,
                type: ActivityType.Custom
            }
        ],
        status: 'online'
    })
})

client.on(Events.MessageCreate, async (m) => {
    if (m.channelId === '1541374516524220426') {
        await m.forward('1541235184450543646')
    }
})

await client.login(env.DISCORD_BOT_TOKEN)
