import 'dotenv/config'

import { ActivityType, ChatInputCommandInteraction, Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'

import { doTags } from "./tags"

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env
if (!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error('DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID must be set')
}

const commands = [
    new SlashCommandBuilder()
        .setName('tags')
        .setDescription('Get a Markdown tag')
        .addStringOption(
            new SlashCommandStringOption()
                .setName('tag_name')
                .setDescription('ID of the tag you want to retrieve')
                .setRequired(true)
        )
        .addBooleanOption(
            new SlashCommandBooleanOption()
                .setName('ephemeral')
                .setDescription('Whether to hide it to just yourself or post it publicly.')
                .setRequired(false)
        )
]

const commandMap: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
    tags: doTags
}

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN)

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

client.once(Events.ClientReady, (c) => {
    c.user.setPresence({
        activities: [
            {
                name: `:robot: Version ${process.env.PUBLIC_BUILD_VERSION}`,
                type: ActivityType.Custom
            }
        ],
        status: 'online'
    })
})

client.on(Events.InteractionCreate, async (m) => {
    if (m.isChatInputCommand()) {
        const command = commandMap[m.commandName]
        if (!command) {
            await m.reply({
                content: 'Unknown command!',
                flags: ["Ephemeral"]
            })
            return
        } else {
            await command(m)
        }
    }
})

client.on(Events.MessageCreate, async (m) => {
    if (m.channelId === '1541374516524220426') { // what is this number??? put in dotenv plz
        await m.forward('1541235184450543646')
    }
})

await client.login(DISCORD_BOT_TOKEN).then(()=>{
    console.log("Ding! Fries are done!");
})
