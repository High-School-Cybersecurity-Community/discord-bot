import { allTags } from '@content';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export async function doTags(interaction: ChatInputCommandInteraction) {
	const tag = allTags.find((v) => v._meta.fileName);
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
