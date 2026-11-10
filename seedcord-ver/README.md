# seedcord-ver

A Discord bot built with [seedcord](https://seedcord.org) on the gateway transport.

## Running it

```sh
pnpm run dev
```

That starts the dev server with hot reload.

## Scripts

<!-- prettier-ignore-start -->

| script | what it does |
| --- | --- |
| `pnpm run dev` | dev server with hot reload |
| `pnpm run build` | compile to `dist/` |
| `pnpm run start` | run the compiled build |
| `pnpm run codegen` | regenerate `src/seedcord-gen.ts` |
| `pnpm run make` | write a new command, button, select menu, modal, or event from `templates/` |
| `pnpm run ask "<question>"` | search the guide for a question, a pasted error, or an error code |
| `pnpm run commands` | list, deploy, or clean up your commands on Discord |
| `pnpm run commands:deploy` | send your commands to Discord |
| `pnpm run tc` | type-check |
| `pnpm run lint` | eslint |
| `pnpm run check` | type-check, lint, and check formatting |

<!-- prettier-ignore-end -->

Run `codegen` after you add a command or change its options. It writes the types behind `this.options`, and the generated file is committed.

## Environment

`.env` holds your secrets and is gitignored.

<!-- prettier-ignore-start -->

| key | required |
| --- | --- |
| `DISCORD_BOT_TOKEN` | yes |
| `MOD_ROLE` | yes, id of the role that can see every ticket |
| `SUPPORT_SERVER_CHANNEL` | yes, id of the text channel holding the support panel |
| `SUPPORT_TICKET_CATEGORY` | yes, id of the category new tickets are created under |
| `UNKNOWN_EXCEPTION_WEBHOOK_URL` | no |
| `HANDLED_EXCEPTION_WEBHOOK_URL` | no |
| `TESTING_GUILD_IDS` | no, empty deploys your commands globally |
| `PUBLIC_BUILD_VERSION` | no, falls back to the `package.json` version |
| `ENV` | no, defaults to `development` |

<!-- prettier-ignore-end -->

The two webhook keys take Discord webhook URLs. Set them to get error reports posted to a channel. `PUBLIC_BUILD_VERSION` shows in the bot's status.

## Where things go

- `src/commands/` holds command definitions, one class per command.
- `src/handlers/` holds the code that runs when someone uses one.
- `src/components/` holds the cards, rows, and notices handlers send.
- `src/plugins/` holds services the bot starts and stops, like the support panel keeper.
- `src/events/` holds event handlers for the things happening in a server.
- `src/data/tags/` holds the Markdown tag files.
- `src/bot.ts` is the config.
- `templates/` holds the templates `pnpm run make` writes new files from. [Templates](https://seedcord.org/guide/tooling/make) shows how to change them or add your own.

## Docs

- Guide: <https://seedcord.org/guide>
- API reference: <https://seedcord.org/docs>
