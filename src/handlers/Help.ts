import { SlashHandler, SlashRoute } from '@seedcord/gateway';

import { TagCard, UnknownTag } from '#components/TagCard';
import { allTags } from 'content-collections';

@SlashRoute('help')
export class Help extends SlashHandler<'help'> {
    public async execute(): Promise<void> {
        const help = allTags.find((tag) => tag._meta.path === 'help');
        if (help === undefined) throw new UnknownTag();

        await this.reply({ components: [new TagCard(help).component] });
    }
}
