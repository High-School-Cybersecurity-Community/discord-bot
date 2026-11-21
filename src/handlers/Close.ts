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

        // The topic carries `ticket-owner:<id>` first, then a `;`-separated
        // kind marker, so a split reads the owner whether the marker is
        // there or not, including tickets from before the marker existed.
        const [ownerPart] = (channel.topic ?? '').split(';');
        if (ownerPart?.startsWith('ticket-owner:') !== true) throw new NotATicket();

        const isOwner = ownerPart === `ticket-owner:${this.user.id}`;
        const isModerator = this.event.memberPermissions.has(PermissionFlagsBits.ManageChannels);
        if (!isOwner && !isModerator) throw new NotTicketOwner();

        // Acknowledge before the delete: under request-queue pressure the
        // delete can wait long enough to outlast the reply window.
        await this.defer();
        await channel.delete();
    }
}
