import { ButtonBuilder } from '@discordjs/builders';
import { BuilderComponent, CustomId } from '@seedcord/gateway';
import { ButtonStyle } from 'discord.js';

/** The id the panel's button carries now, minted so a click routes to `SupportCreate`. */
export const SupportCreateId = new CustomId('support-create');
export const ChallengeHelpId = new CustomId('support-oo-challenge');
export const ReportPlayerId = new CustomId('support-oo-report');

/** The id the panel's button carried in the raw discord.js bot before the port. */
export const LegacySupportCreateId = 'support:create';
export const ChallengeSupportId = 'oo:challenge-help';
export const PlayerReportId = 'oo:player-report';

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
                (text) => text.setContent('Create a ticket to speak to the mods'),
                (text) => text.setContent('-# If the button does not work, please DM a person with the <@&1541225527317110824> role.'),
            )
            .addActionRowComponents((row) =>
                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId(SupportCreateId.encode({}))
                        .setLabel('General ticket')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(ChallengeHelpId.encode({}))
                        .setLabel('I need help on challenges!')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId(ReportPlayerId.encode({}))
                        .setLabel('Report a team/player')
                        .setStyle(ButtonStyle.Secondary),
                ),
            );
    }
}
