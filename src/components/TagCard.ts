import { BuilderComponent, Notice } from '@seedcord/gateway';

import type { Tag } from 'content-collections';

/**
 * Thrown when a tag id arrives that no tag file in `src/data/tags` declares.
 * Renders seedcord's refusal card with the message below.
 */
export class UnknownTag extends Notice {
    constructor() {
        super("I couldn't find a tag by that ID!");
    }
}

/**
 * A tag rendered as a ComponentsV2 card: the tag title as a heading, its
 * markdown body, and a subtext line with the author and the tag's id.
 */
export class TagCard extends BuilderComponent<'container'> {
    constructor(tag: Tag) {
        super('container');

        this.instance.addTextDisplayComponents(
            (text) => text.setContent(`## ${tag.title}`),
            (text) => text.setContent(tag.content),
            (text) => text.setContent(`-# ${tag.footer ?? `Tag ID: ${tag._meta.fileName}`} · Author: ${tag.author}`)
        );
    }
}
