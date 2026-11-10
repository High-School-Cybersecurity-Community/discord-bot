import { SlashHandler, SlashRoute } from '@seedcord/gateway';

@SlashRoute('support')
export class Support extends SlashHandler<'support'> {
    public async execute(): Promise<void> {
        await this.core.support.ensurePanel(this.event.client);

        await this.reply('Support panel checked.');
    }
}
