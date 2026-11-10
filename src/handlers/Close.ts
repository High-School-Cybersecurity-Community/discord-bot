import { Notice, SlashHandler, SlashRoute } from '@seedcord/gateway';
import { ChannelType, PermissionFlagsBits } from 'discord.js';

class NotTicketChannel extends Notice {
    constructor() {
        super('This command can only be used in a ticket channel.');
    }
}

class NotATicket extends Notice {
    constructor() {
        super('This is not a ticket channel.');
    }
}

class NotTicketOwner extends Notice {
    constructor() {
        super('Only the ticket owner or a moderator can close this ticket.');
    }
}

@SlashRoute('close')
export class Close extends SlashHandler<'close'> {
    public async execute(): Promise<void> {
        const channel = this.event.channel;
        if (channel?.type !== ChannelType.GuildText) throw new NotTicketChannel();

        if (channel.topic?.startsWith('ticket-owner:') !== true) throw new NotATicket();

        const isOwner = channel.topic === `ticket-owner:${this.user.id}`;
        const isModerator = this.event.memberPermissions.has(PermissionFlagsBits.ManageChannels);
        if (!isOwner && !isModerator) throw new NotTicketOwner();

        await this.reply('Closing this ticket...');
        await channel.delete();
    }
}
