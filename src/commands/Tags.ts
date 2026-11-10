import { BuilderComponent, RegisterCommand } from '@seedcord/gateway';

import { allTags } from 'content-collections';

const tagChoices = allTags
    .filter((tag) => tag._meta.path !== 'help')
    .map((tag) => ({ name: tag.title, value: tag._meta.path }));

@RegisterCommand()
export class Tags extends BuilderComponent<'command'> {
    constructor() {
        super('command');

        this.instance
            .setName('tags')
            .setDescription('Get a Markdown tag')
            .addStringOption((option) =>
                option
                    .setName('tag_name')
                    .setDescription('ID of the tag you want to retrieve')
                    .setRequired(true)
                    .addChoices(...tagChoices)
            )
            .addBooleanOption((option) =>
                option.setName('ephemeral').setDescription('Whether to hide it to just yourself or post it publicly.')
            );
    }
}
