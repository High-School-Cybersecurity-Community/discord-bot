import {
	ActivityType,
	ChatInputCommandInteraction,
	Client,
	Events,
	GatewayIntentBits,
	REST,
	Routes,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js';

import { doTags } from './tags';
import { doClose, doSupport, ensureSupportPanel, handleSupportButton } from './support';
import { logger } from './logger';

import { env } from '../env';

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception', { error });
});

process.on('unhandledRejection', (reason) => {
	logger.error('Unhandled rejection', { reason });
});

const commands = [
	new SlashCommandBuilder().setName('support').setDescription('Open a private support ticket.'),
	new SlashCommandBuilder().setName('close').setDescription('Close the current support ticket.'),
	new SlashCommandBuilder()
		.setName('tags')
		.setDescription('Get a Markdown tag')
		.addStringOption(new SlashCommandStringOption().setName('tag_name').setDescription('ID of the tag you want to retrieve').setRequired(true))
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName('ephemeral')
				.setDescription('Whether to hide it to just yourself or post it publicly.')
				.setRequired(false),
		),
];

const commandMap: Record<string, (interaction: ChatInputCommandInteraction) => Promise<void>> = {
	support: doSupport,
	close: doClose,
	tags: doTags,
};

const rest = new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN);

try {
	logger.info('Started refreshing application (/) commands.');

	await rest.put(Routes.applicationCommands(env.DISCORD_CLIENT_ID), { body: commands });

	logger.info('Successfully reloaded application (/) commands.');
} catch (error) {
	logger.error('Failed to refresh application (/) commands', { error });
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once(Events.ClientReady, (c) => {
	c.user.setPresence({
		activities: [
			{
				name: `:robot: Version ${env.PUBLIC_BUILD_VERSION}`,
				type: ActivityType.Custom,
			},
		],
		status: 'online',
	});
	ensureSupportPanel(c).catch((error) => logger.error('Failed to ensure support panel', { error }));
});

client.on(Events.Error, (error) => {
	logger.error('Client error', { error });
});

client.on(Events.ShardError, (error) => {
	logger.error('Shard error', { error });
});

client.on(Events.InteractionCreate, async (m) => {
	try {
		if (m.isButton()) {
			await handleSupportButton(m);
			return;
		}
		if (m.isChatInputCommand()) {
			const command = commandMap[m.commandName];
			if (!command) {
				await m.reply({
					content: 'Unknown command!',
					flags: ['Ephemeral'],
				});
				return;
			} else {
				await command(m);
			}
		}
	} catch (error) {
		logger.error('Failed to handle interaction', {
			error,
			customId: m.isButton() ? m.customId : undefined,
			commandName: m.isCommand() ? m.commandName : undefined,
		});
		if (m.isRepliable() && !m.replied && !m.deferred) {
			await m
				.reply({ content: 'Something went wrong while processing that. Please try again.', flags: ['Ephemeral'] })
				.catch((replyError) => logger.error('Failed to send error reply', { error: replyError }));
		}
	}
});

client.on(Events.MessageCreate, async (m) => {
	try {
		if (m.channelId === '1541374516524220426') {
			// what is this number??? put in dotenv plz
			await m.forward('1541235184450543646');
		}
	} catch (error) {
		logger.error('Failed to handle message', { error, messageId: m.id });
	}
});

await client.login(env.DISCORD_BOT_TOKEN).then(() => {
	logger.info('Ding! Fries are done!');
});
