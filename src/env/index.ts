import { Converters, Envapter } from 'envapt';

/**
 * The support system's required settings. Every getter throws `MissingEnvValue`
 * naming the key the moment something first reads it, so the bot stops at
 * startup when one of them is missing instead of half-working later.
 */
export const SupportEnv = {
    get modRole(): string {
        return Envapter.getRequired('MOD_ROLE', Converters.String);
    },
    get panelChannel(): string {
        return Envapter.getRequired('SUPPORT_SERVER_CHANNEL', Converters.String);
    },
    get ticketCategory(): string {
        return Envapter.getRequired('SUPPORT_TICKET_CATEGORY', Converters.String);
    }
};
