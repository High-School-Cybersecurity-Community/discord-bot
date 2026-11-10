import { ButtonHandler, ButtonRoute } from '@seedcord/gateway';
import { ChannelType, PermissionFlagsBits } from 'discord.js';

import { SupportCreateId } from '#components/SupportPanel';

// `ticket-` plus the slug has to fit inside Discord's 100 character channel name cap
const ticketNameSlugCap = 83;

@ButtonRoute(SupportCreateId)
export class SupportCreate extends ButtonHandler<[typeof SupportCreateId]> {
    public async execute(): Promise<void> {
        const guild = this.event.guild;

        const support = this.core.support;
        const owner = this.user.id;

        const existing = guild.channels.cache.find(
            (channel) =>
                channel.type === ChannelType.GuildText &&
                channel.parentId === support.ticketCategory &&
                channel.topic === `ticket-owner:${owner}`
        );
        if (existing) {
            await this.reply(`You already have an open ticket: <#${existing.id}>`);
            return;
        }

        const channel = await guild.channels.create({
            name: `ticket-${this.user.username
                .toLowerCase()
                .replaceAll(/[^a-z0-9-_]/g, '-')
                .slice(0, ticketNameSlugCap)}`,
            type: ChannelType.GuildText,
            parent: support.ticketCategory,
            topic: `ticket-owner:${owner}`,
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

        await channel.send(`Welcome <@${owner}>! A moderator will be with you shortly.`);
        await this.reply(`Your ticket is ready: <#${channel.id}>`);
    }
}
