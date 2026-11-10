import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, CustomId } from '@seedcord/gateway';
import { ButtonStyle } from 'discord.js';

/** The id the panel's button carries now, minted so a click routes to `SupportCreate`. */
export const SupportCreateId = new CustomId('support-create');

/** The id the panel's button carried in the raw discord.js bot before the port. */
export const LegacySupportCreateId = 'support:create';

/**
 * The message pinned above the support channel: a heading, a line of text,
 * and the button that opens a ticket.
 */
export class SupportPanelCard extends BuilderComponent<'container'> {
    constructor() {
        super('container');

        this.instance
            .addTextDisplayComponents(
                (text) => text.setContent('## Support Ticket'),
                (text) => text.setContent('Create a ticket to speak to the mods')
            )
            .addActionRowComponents((row) =>
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(SupportCreateId.encode({}))
                        .setLabel('Create ticket')
                        .setStyle(ButtonStyle.Primary)
                )
            );
    }
}
