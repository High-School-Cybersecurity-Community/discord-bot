import { buildKey, defineGate, Notice } from '@seedcord/gateway';

import type { RateLimitWindow } from '@seedcord/gateway';

class CreatingTooFast extends Notice {
    constructor() {
        super('Ticket buttons only work once every couple of seconds.');
    }
}

const TICKET_WINDOW: RateLimitWindow = { windowMs: 2000 };

/**
 * Refuses a ticket button clicked within two seconds of a previous attempt
 * by the same person.
 */
export const TicketThrottle = defineGate('TicketThrottle', async (ctx) => {
    if (ctx.userId === null) return;

    const { limited } = await ctx.core.rateLimiter.charge(
        buildKey('ticket-create', ctx.userId),
        TICKET_WINDOW
    );
    if (limited) throw new CreatingTooFast();
});
