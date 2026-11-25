import { Plugin, type CoreBase } from '@seedcord/gateway';
import { createFetch, FetchError, type FetchOptions } from 'ofetch';
import * as v from 'valibot';

import { CTFdErrorResponseSchema, UserResponseSchema, type CTFdUser } from '#src/kit/ctfd/responses';
import { isCTFdRouteOutput } from '#src/kit/ctfd/routeSchemas';

import type { CTFdRoute, CTFdRouteInputs, CTFdRouteMethods, CTFdRouteOutput } from '#src/kit/ctfd/routeTypes';

/**
 * The plugin's handle onto the CTFd API. `fetch` does a plain JSON fetch of a CTFd route
 * with the /api/v1 base and auth header baked in, answering `unknown` — valibot decides
 * what the body really is; further members can be attached here as the plugin grows.
 */
export interface CTFdClient {
    fetch: (route: CTFdRoute, options?: FetchOptions) => Promise<unknown>;
    /** The bot's own CTFd user, set by the validation ping. Present once CTFdReady is true. */
    me?: CTFdUser;
}

export class CTFd extends Plugin {
    private CTFdReady = false;

    private readonly client: CTFdClient;

    constructor(
        host: CoreBase,
        private readonly apiUrl: string,
        private readonly apiToken: string
    ) {
        super(host);
        // ofetch joins baseURL with the route on each call, like the old new URL() did,
        // and parses JSON bodies for us; valibot then checks the shape CTFd promised.
        const base = this.apiUrl.endsWith('/') ? this.apiUrl : `${this.apiUrl}/`;
        this.client = {
            fetch: createFetch({
                defaults: {
                    baseURL: `${base}api/v1`,
                    headers: { Authorization: `Token ${this.apiToken}` }
                }
            })
        };
    }

    public async init(): Promise<void> {
        await this.tryConnect();
        if (!this.CTFdReady) {
            this.logger.warn('Unable to validate CTFd access credentials.');
            return;
        }
        // CTFdReady being true implies the ping stored our user, but the compiler cannot
        // see that invariant, so narrow instead of asserting it.
        const me = this.client.me;
        if (me !== undefined) {
            this.logger.info(`Called CTFd endpoint successfully as ${me.name} (ID: ${me.id})`);
        }
    }

    private async tryConnect(): Promise<void> {
        // The one caller allowed past fetchCTFd's guard: it runs before CTFdReady is set,
        // and it is the call that sets it. The explicit type argument keeps the ofetch
        // call from inferring any, and the parse rejects the 200 HTML login page a
        // misconfigured server can answer an unauthenticated hit with.
        try {
            const me = await this.client.fetch('/users/me', { method: 'GET' });
            this.client.me = v.parse(UserResponseSchema, me).data;
            this.CTFdReady = true;
        } catch {
            this.CTFdReady = false;
            delete this.client.me;
        }
    }

    /**
     * Fetch a CTFd API route. Naming the route and method is all it takes: the accepted
     * body, the validating schema, and the response's type are all inferred from
     * `CTFdRouteTable`. `fetchCTFd('/users', 'GET')` resolves to
     * `CTFdListResponse<CTFdUser>`, and `fetchCTFd('/users/5', 'PATCH', { banned: true })`
     * resolves to a single user.
     */
    public async fetchCTFd<Route extends CTFdRoute, Method extends CTFdRouteMethods<Route>>(
        route: Route,
        method: Method,
        body?: CTFdRouteInputs<Route, Method>
    ): Promise<CTFdRouteOutput<Route, Method>> {
        if (!this.CTFdReady) {
            throw new Error('Not validated against the CTFd API!');
        }

        try {
            const data = await this.client.fetch(route, { method, body });
            // The predicate validates data against the schema the resolver picks for
            // this route — the one the route table names — so a passing check narrows
            // data to exactly this method's documented response.
            if (!isCTFdRouteOutput(route, method, data)) {
                throw new Error(`CTFd ${method} ${route} did not answer the shape CTFd documents`);
            }
            return data;
        } catch (error) {
            if (error instanceof FetchError) {
                const details = v.safeParse(CTFdErrorResponseSchema, error.data);
                this.logger.error(
                    `CTFd ${method} ${route} failed with status ${error.response?.status ?? 'unknown'}.`,
                    details.success ? details.output : undefined
                );
            }
            throw error;
        }
    }
}
