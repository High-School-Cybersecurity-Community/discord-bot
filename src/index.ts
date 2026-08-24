import { ActivityType, ChatInputCommandInteraction, Client, EmbedBuilder, Events, GatewayIntentBits, REST, Routes, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js'

import { env } from '../env'
import { allTags } from '@content'

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
    tags: async (interaction: ChatInputCommandInteraction) => {
        const tag = allTags.find((v) => v._meta.fileName)
        if (!tag) {
            await interaction.reply({
                content: 'I couldn\'t find a tag by that ID!',
                flags: ["Ephemeral"]
            })
            return
        }
        const embed = new EmbedBuilder()
            .setTitle(tag.title)
            .setDescription(tag.content)
            .setAuthor({
                name: tag.author
            })
            .setFooter({
                text: tag.footer ?? `Tag ID: ${tag._meta.fileName}`
            })
        await interaction.reply({
            embeds: [embed],
            flags: interaction.options.getBoolean('ephemeral', false) ? ["Ephemeral"] : []
        })
        return
    }
}

const rest = new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN)

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}

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
    if (m.channelId === '1541374516524220426') {
        await m.forward('1541235184450543646')
    }
})

await client.login(env.DISCORD_BOT_TOKEN)
