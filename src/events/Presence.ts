import { EventHandler, RegisterEvent } from '@seedcord/gateway';
import { ActivityType, Events } from 'discord.js';
import { Envapter } from 'envapt';

import { version } from '../../package.json' with { type: 'json' };

/** Sets the bot's presence once, right after the READY handshake. */
@RegisterEvent([Events.ClientReady, { frequency: 'once' }])
export class Presence extends EventHandler<Events.ClientReady> {
    public execute(): void {
        const [client] = this.event;

        client.user.setPresence({
            activities: [
                {
                    // A runtime override wins, like the old Dockerfile set it; otherwise the package version.
                    name: `:robot: Version ${Envapter.get('VITE_BUILD_VERSION', version)}`,
                    type: ActivityType.Custom
                }
            ],
            status: 'online'
        });
    }
}
