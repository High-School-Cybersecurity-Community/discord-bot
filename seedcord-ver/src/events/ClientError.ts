import { EventHandler, RegisterEvent } from '@seedcord/gateway';
import { Events } from 'discord.js';

/** Logs every client-level error the gateway hands the bot. */
@RegisterEvent([Events.Error])
export class ClientError extends EventHandler<Events.Error> {
    public execute(): void {
        const [error] = this.event;

        this.logger.error('Client error', error);
    }
}
