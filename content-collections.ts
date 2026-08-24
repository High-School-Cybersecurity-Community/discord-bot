import { defineCollection, defineConfig } from '@content-collections/core';
import z from 'zod';

const tags = defineCollection({
	name: 'tags',
	directory: 'data/tags',
	include: '*.md',
	schema: z.object({
		title: z.string(),
		author: z.string(),
		footer: z.string().optional(),
		content: z.string(),
	}),
});

export default defineConfig({
	content: [tags],
});
