import { SlashHandler, SlashRoute } from '@seedcord/gateway';

import { TagCard, UnknownTag } from '#components/TagCard';
import { allTags } from 'content-collections';

@SlashRoute('tags')
export class Tags extends SlashHandler<'tags'> {
    public async execute(): Promise<void> {
        const id = this.options.getString('tag_name');
        const ephemeral = this.options.getBoolean('ephemeral');

        const tag = allTags.find((candidate) => candidate._meta.path === id);
        if (tag === undefined) throw new UnknownTag();

        // The old bot posted tags to the channel unless "ephemeral" got a value.
        await this.reply({ components: [new TagCard(tag).component] }, { ephemeral: ephemeral ?? false });
    }
}
