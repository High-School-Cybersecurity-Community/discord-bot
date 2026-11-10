import { isDeepStrictEqual } from 'node:util';

import { Plugin } from '@seedcord/gateway';
import { ComponentType, MessageFlags } from 'discord.js';

import { SupportPanelCard, LegacySupportCreateId } from '#components/SupportPanel';
import { SupportEnv } from '#src/env';

import type { Client, Message } from 'discord.js';

/**
 * Keeps the support panel in its server channel up to date.
 *
 * On every startup it posts a `SupportPanelCard` to `SUPPORT_SERVER_CHANNEL`
 * when there is none, and rewrites one in place when it has aged out of the
 * current shape. An old message from the previous raw discord.js bot, which
 * carried the same button under the id in `LegacySupportCreateId`, is replaced
 * the same way, so the panel keeps its spot in the channel history.
 */
export class Support extends Plugin {
    public modRole = '';
    public panelChannel = '';
    public ticketCategory = '';

    public init(): Promise<void> {
        // Every read throws MissingEnvValue naming its key, which stops the bot at startup.
        this.modRole = SupportEnv.modRole;
        this.panelChannel = SupportEnv.panelChannel;
        this.ticketCategory = SupportEnv.ticketCategory;

        return Promise.resolve();
    }

    public override async ready(): Promise<void> {
        try {
            await this.ensurePanel(this.core.bot.client);
        } catch (error) {
            this.logger.error('Failed to ensure support panel', error);
        }
    }

    public async ensurePanel(client: Client<boolean>): Promise<void> {
        if (this.panelChannel.length === 0) return;

        const channel = await client.channels.fetch(this.panelChannel);
        if (!channel || !channel.isTextBased() || channel.isDMBased()) {
            this.logger.error('SUPPORT_SERVER_CHANNEL must be a server text channel');
            return;
        }
        if (client.user === null) {
            this.logger.error('Support panel check ran before the client was ready');
            return;
        }
        const self = client.user;

        const messages = await channel.messages.fetch({ limit: 100 });
        const existing = messages.find((message) => this.ownsPanel(message, self.id));

        if (existing === undefined) {
            await channel.send({ components: [new SupportPanelCard().component], flags: MessageFlags.IsComponentsV2 });
            this.logger.info('Posted the support panel');
            return;
        }

        if (this.isCurrentPanel(existing)) return;

        // Editing an embed panel into a ComponentsV2 message clears its embeds;
        // Discord rejects an edit that still sends both formats.
        await existing.edit({ components: [new SupportPanelCard().component], flags: MessageFlags.IsComponentsV2 });
        this.logger.info('Updated the support panel in place');
    }

    private ownsPanel(message: Message, selfId: string): boolean {
        if (message.author.id !== selfId) return false;

        if (message.flags.has(MessageFlags.IsComponentsV2)) return message.components.length > 0;

        return message.components.some(
            (row) =>
                row.type === ComponentType.ActionRow &&
                row.components.some(
                    (component) =>
                        component.type === ComponentType.Button && component.customId === LegacySupportCreateId
                )
        );
    }

    private isCurrentPanel(message: Message): boolean {
        if (!message.flags.has(MessageFlags.IsComponentsV2)) return false;
        if (message.components.length !== 1) return false;

        const [component] = message.components;
        if (component === undefined) return false;

        return isDeepStrictEqual(component.toJSON(), new SupportPanelCard().component.toJSON());
    }
}
