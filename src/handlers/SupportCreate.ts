import { ButtonHandler, ButtonRoute } from '@seedcord/gateway';
import { ChannelType, PermissionFlagsBits } from 'discord.js';

import { ChallengeHelpId, ReportPlayerId, SupportCreateId } from '#components/SupportPanel';

// The channel name is `<prefix>-` plus this many characters of the owner's
// username, sized so the longest prefix, `challenge-`, stays inside Discord's
// 100 character channel name cap.
const ticketNameSlugCap = 83;

/** What sets one panel button's ticket apart from another's. */
interface TicketKind {
    /** The word the ticket channel's name starts with. */
    channelPrefix: string;
    /** The marker the channel's topic carries, so each kind gets its own ticket. */
    topicType: string;
    /** The first message sent into the fresh channel. */
    welcome: (owner: string) => string;
}

/**
 * Serves every ticket button on the support panel. The three kinds share one
 * open-ticket rule, one channel shape, and one `/close` format, so they belong
 * in one handler and branch on the clicked button's prefix.
 */
@ButtonRoute(SupportCreateId, ChallengeHelpId, ReportPlayerId)
export class SupportCreate extends ButtonHandler<
    [typeof SupportCreateId, typeof ChallengeHelpId, typeof ReportPlayerId]
> {
    public async execute(): Promise<void> {
        const kind = await this.match({
            'support-create': (): TicketKind => ({
                channelPrefix: 'ticket',
                topicType: 'general',
                welcome: (owner) => `Welcome <@${owner}>! A moderator will be with you shortly.`
            }),
            'support-oo-challenge': (): TicketKind => ({
                channelPrefix: 'challenge',
                topicType: 'challenge',
                welcome: (owner) =>
                    `Welcome <@${owner}>! Tell us which challenge you are stuck on and what you have tried so far, and a challenge helper will be with you shortly.`
            }),
            'support-oo-report': (): TicketKind => ({
                channelPrefix: 'report',
                topicType: 'report',
                welcome: (owner) =>
                    `Welcome <@${owner}>! Tell us which team or player you are reporting and include any evidence you have. A moderator will be with you shortly.`
            })
        });

        const guild = this.event.guild;

        const support = this.core.support;
        const owner = this.user.id;
        const topic = `ticket-owner:${owner};ticket-type:${kind.topicType}`;

        const existing = guild.channels.cache.find(
            (channel) =>
                channel.type === ChannelType.GuildText &&
                channel.parentId === support.ticketCategory &&
                channel.topic === topic
        );
        if (existing) {
            await this.reply(`You already have an open ${kind.topicType} ticket: <#${existing.id}>`);
            return;
        }

        const channel = await guild.channels.create({
            name: `${kind.channelPrefix}-${this.user.username
                .toLowerCase()
                .replaceAll(/[^a-z0-9-_]/g, '-')
                .slice(0, ticketNameSlugCap)}`,
            type: ChannelType.GuildText,
            parent: support.ticketCategory,
            topic,
            permissionOverwrites: [
                { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
                {
                    id: owner,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: support.modRole,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: this.event.client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                }
            ]
        });

        await channel.send(kind.welcome(owner));
        await this.reply(`Your ticket is ready: <#${channel.id}>`);
    }
}
