import { allTags } from '@content';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export const TAGS = allTags
	.filter((t) => t._meta.path !== 'help')
	.map((t) => ({
		name: t.title,
		value: t._meta.path,
	}));

async function sendTags(interaction: ChatInputCommandInteraction, id: string) {
	const tag = allTags.find((v) => v._meta.path === id);
	if (!tag) {
		await interaction.reply({
			content: "I couldn't find a tag by that ID!",
			flags: ['Ephemeral'],
		});
		return;
	}
	const embed = new EmbedBuilder()
		.setTitle(tag.title)
		.setDescription(tag.content)
		.setAuthor({
			name: tag.author,
		})
		.setFooter({
			text: tag.footer ?? `Tag ID: ${tag._meta.fileName}`,
		});
	await interaction.reply({
		embeds: [embed],
		flags: interaction.options.getBoolean('ephemeral', false) ? ['Ephemeral'] : [],
	});
	return;
}

export async function doTags(interaction: ChatInputCommandInteraction) {
	const id = interaction.options.getString('tag_name', true);
	await sendTags(interaction, id);
}

export async function doHelp(interaction: ChatInputCommandInteraction) {
	await sendTags(interaction, 'help');
}
