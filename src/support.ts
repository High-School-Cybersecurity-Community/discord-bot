import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ChannelType,
	Client,
	ComponentType,
	EmbedBuilder,
	PermissionFlagsBits,
	TextChannel,
} from 'discord.js';

import {env} from '../env'

const moderatorRole = env.MOD_ROLE;
const panelChannelId = env.SUPPORT_SERVER_CHANNEL;
const ticketCategoryId = env.SUPPORT_TICKET_CATEGORY;

const panelEmbed = new EmbedBuilder().setTitle('Support Ticket').setDescription('Create a ticket to speak to the mods');
const panelRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
	new ButtonBuilder().setCustomId('support:create').setLabel('Create ticket').setStyle(ButtonStyle.Primary),
);

export async function ensureSupportPanel(client: Client<true>) {
	if (!panelChannelId) return;
	const channel = await client.channels.fetch(panelChannelId);
	if (!channel || !channel.isTextBased() || channel.isDMBased()) {
		console.error('SUPPORT_SERVER_CHANNEL must be a server text channel');
		return;
	}

	const messages = await channel.messages.fetch({ limit: 100 });
	const existing = messages.find(
		(message) =>
			message.author.id === client.user.id &&
			message.components.some(
				(row) => row.type === ComponentType.ActionRow && row.components.some((component) => component.customId === 'support:create'),
			),
	);
	const currentButton = existing?.components.some((row) => {
		if (row.type !== ComponentType.ActionRow) return false;
		return row.components.some(
			(component) =>
				component.type === ComponentType.Button &&
				component.customId === 'support:create' &&
				component.label === 'Create ticket' &&
				component.style === ButtonStyle.Primary,
		);
	});
	const current = existing
		? existing.embeds[0]?.title === panelEmbed.data.title && existing.embeds[0]?.description === panelEmbed.data.description && currentButton
		: false;
	if (existing) {
		if (!current) await existing.edit({ embeds: [panelEmbed], components: [panelRow] });
		return;
	}
	await channel.send({ embeds: [panelEmbed], components: [panelRow] });
}

export async function doSupport(interaction: ChatInputCommandInteraction) {
	await ensureSupportPanel(interaction.client);
	await interaction.reply({ content: 'Support panel checked.', flags: ['Ephemeral'] });
}

export async function handleSupportButton(interaction: ButtonInteraction) {
	if (interaction.customId !== 'support:create') return;
	await createTicket(interaction);
}

async function createTicket(interaction: ButtonInteraction) {
	if (!interaction.guild) {
		await interaction.reply({ content: 'Tickets can only be opened in a server.', flags: ['Ephemeral'] });
		return;
	}
	if (!moderatorRole || !panelChannelId) {
		await interaction.reply({ content: 'The ticket system is not configured.', flags: ['Ephemeral'] });
		return;
	}
	const panelChannel = await interaction.client.channels.fetch(panelChannelId);
	const ticketCategory = ticketCategoryId ?? (panelChannel?.isTextBased() && !panelChannel.isDMBased() ? panelChannel.parentId : null);
	if (!ticketCategory) {
		await interaction.reply({ content: 'The ticket category is not configured.', flags: ['Ephemeral'] });
		return;
	}

	const existing = interaction.guild.channels.cache.find(
		(channel) =>
			channel.type === ChannelType.GuildText && channel.parentId === ticketCategory && channel.topic === `ticket-owner:${interaction.user.id}`,
	);
	if (existing) {
		await interaction.reply({ content: `You already have an open ticket: <#${existing.id}>`, flags: ['Ephemeral'] });
		return;
	}

	const channel = await interaction.guild.channels.create({
		name: `ticket-${interaction.user.username
			.toLowerCase()
			.replace(/[^a-z0-9-_]/g, '-')
			.slice(0, 83)}`,
		type: ChannelType.GuildText,
		parent: ticketCategory,
		topic: `ticket-owner:${interaction.user.id}`,
		permissionOverwrites: [
			{ id: interaction.guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
			{
				id: interaction.user.id,
				allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
			},
			{
				id: moderatorRole,
				allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
			},
			{
				id: interaction.client.user.id,
				allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
			},
		],
	});

	await channel.send(`Welcome <@${interaction.user.id}>! A moderator will be with you shortly.`);
	await interaction.reply({ content: `Your ticket is ready: <#${channel.id}>`, flags: ['Ephemeral'] });
}

export async function doClose(interaction: ChatInputCommandInteraction) {
	if (!interaction.channel || interaction.channel.type !== ChannelType.GuildText) {
		await interaction.reply({ content: 'This command can only be used in a ticket channel.', flags: ['Ephemeral'] });
		return;
	}

	const channel = interaction.channel as TextChannel;
	if (!channel.topic?.startsWith('ticket-owner:')) {
		await interaction.reply({ content: 'This is not a ticket channel.', flags: ['Ephemeral'] });
		return;
	}

	const isOwner = channel.topic === `ticket-owner:${interaction.user.id}`;
	const isModerator = interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels) ?? false;
	if (!isOwner && !isModerator) {
		await interaction.reply({ content: 'Only the ticket owner or a moderator can close this ticket.', flags: ['Ephemeral'] });
		return;
	}

	await interaction.reply('Closing this ticket...');
	await channel.delete();
}
