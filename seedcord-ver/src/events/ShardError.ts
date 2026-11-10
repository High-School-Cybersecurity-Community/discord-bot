import { EventHandler, RegisterEvent } from '@seedcord/gateway';
import { Events } from 'discord.js';

/** Logs every error a shard reports, with the shard's place in the tuple. */
@RegisterEvent([Events.ShardError])
export class ShardError extends EventHandler<Events.ShardError> {
    public execute(): void {
        const [error, shardId] = this.event;

        this.logger.error('Shard error', `shard ${shardId}`, error);
    }
}
