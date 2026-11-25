import * as v from 'valibot';

import {
    AwardListResponseSchema,
    AwardResponseSchema,
    ChallengeListResponseSchema,
    ChallengeResponseSchema,
    CommentListResponseSchema,
    CommentResponseSchema,
    ConfigListResponseSchema,
    ConfigResponseSchema,
    CTFdEmptyResponseSchema,
    CTFdSimpleResponseSchema,
    CTFdUnknownResponseSchema,
    FileListResponseSchema,
    FileResponseSchema,
    FlagListResponseSchema,
    FlagResponseSchema,
    HintListResponseSchema,
    HintResponseSchema,
    NotificationListResponseSchema,
    NotificationResponseSchema,
    PageListResponseSchema,
    PageResponseSchema,
    ScoreboardResponseSchema,
    SolutionListResponseSchema,
    SolutionResponseSchema,
    SubmissionListResponseSchema,
    SubmissionResponseSchema,
    TagListResponseSchema,
    TagResponseSchema,
    TeamListResponseSchema,
    TeamResponseSchema,
    TokenListResponseSchema,
    TokenResponseSchema,
    TopicListResponseSchema,
    TopicResponseSchema,
    UnlockListResponseSchema,
    UnlockResponseSchema,
    UserListResponseSchema,
    UserResponseSchema,
    ValuelessTokenResponseSchema
} from './responses';

import type { CTFdMethod, CTFdRoute, CTFdRouteMethods, CTFdRouteOutput } from './routeTypes';

/**
 * The runtime half of `CTFdRouteTable`: every route with the valibot schema that
 * validates each method's response. Keys mirror the type table's routes one for one,
 * with parameterized routes spelled with the literal text `${string}` in single quotes,
 * so they stay plain strings instead of template literals.
 */

type CTFdMethodSchemas = Partial<Record<CTFdMethod, v.GenericSchema>>;

// Short local names for the three envelope schemas the table repeats most often.
const Unspecified = CTFdUnknownResponseSchema;
const Simple = CTFdSimpleResponseSchema;
const Empty = CTFdEmptyResponseSchema;

export const ctfdRouteSchemas: Partial<Record<CTFdRoute, CTFdMethodSchemas>> = {
    // audiences
    '/audiences': { GET: Unspecified, POST: Unspecified },
    '/audiences/${string}': { GET: Unspecified, POST: Unspecified, PATCH: Unspecified, DELETE: Unspecified },
    '/audiences/${string}/members': { GET: Unspecified, POST: Unspecified },
    '/audiences/${string}/members/${string}': { DELETE: Unspecified },

    // awards
    '/awards': { GET: AwardListResponseSchema, POST: AwardListResponseSchema },
    '/awards/${string}': { GET: AwardResponseSchema, DELETE: Simple },

    // brackets
    '/brackets': { GET: Unspecified, POST: Unspecified },
    '/brackets/${string}': { PATCH: Unspecified, DELETE: Unspecified },

    // challenges
    '/challenges': { GET: ChallengeListResponseSchema, POST: ChallengeResponseSchema },
    '/challenges/attempt': { POST: Unspecified },
    '/challenges/types': { GET: Unspecified },
    '/challenges/${string}': {
        GET: ChallengeResponseSchema,
        POST: Unspecified,
        PUT: Unspecified,
        PATCH: ChallengeResponseSchema,
        DELETE: Simple
    },
    '/challenges/${string}/files': { GET: Unspecified },
    '/challenges/${string}/flags': { GET: Unspecified },
    '/challenges/${string}/hints': { GET: Unspecified },
    '/challenges/${string}/ratings': { GET: Unspecified, PUT: Unspecified },
    '/challenges/${string}/requirements': { GET: Unspecified },
    '/challenges/${string}/solution': { GET: Unspecified },
    '/challenges/${string}/solves': { GET: Unspecified },
    '/challenges/${string}/tags': { GET: Unspecified },
    '/challenges/${string}/topics': { GET: Unspecified },

    // comments
    '/comments': { GET: CommentListResponseSchema, POST: CommentResponseSchema },
    '/comments/${string}': { DELETE: Simple },

    // configs
    '/configs': { GET: ConfigListResponseSchema, PATCH: Simple, POST: ConfigResponseSchema },
    '/configs/fields': { GET: Unspecified, POST: Unspecified },
    '/configs/fields/${string}': { GET: Unspecified, PATCH: Unspecified, DELETE: Unspecified },
    '/configs/${string}': { GET: ConfigResponseSchema, POST: Unspecified, PATCH: ConfigResponseSchema, DELETE: Simple },

    // exports
    '/exports/raw': { POST: Empty },

    // files
    '/files': { GET: FileListResponseSchema, POST: FileResponseSchema },
    '/files/${string}': { GET: FileResponseSchema, DELETE: Simple },

    // flags
    '/flags': { GET: FlagListResponseSchema, POST: FlagResponseSchema },
    '/flags/types': { GET: Unspecified },
    '/flags/types/${string}': { GET: Unspecified },
    '/flags/${string}': { GET: FlagResponseSchema, PATCH: FlagResponseSchema, DELETE: Simple },

    // hints
    '/hints': { GET: HintListResponseSchema, POST: HintResponseSchema },
    '/hints/${string}': { GET: HintResponseSchema, PATCH: HintResponseSchema, DELETE: Simple },

    // modules
    '/modules': { GET: Unspecified, POST: Unspecified },
    '/modules/${string}': { GET: Unspecified, POST: Unspecified, PATCH: Unspecified, DELETE: Unspecified },
    '/modules/${string}/audiences': { GET: Unspecified, POST: Unspecified },
    '/modules/${string}/audiences/${string}': { DELETE: Unspecified },
    '/modules/${string}/challenges': { GET: Unspecified, POST: Unspecified },

    // notifications
    '/notifications': { GET: NotificationListResponseSchema, HEAD: Empty, POST: NotificationResponseSchema },
    '/notifications/${string}': { GET: NotificationResponseSchema, DELETE: Simple },

    // pages
    '/pages': { GET: PageListResponseSchema, POST: PageResponseSchema },
    '/pages/${string}': { GET: PageResponseSchema, PATCH: PageResponseSchema, DELETE: Simple },

    // scoreboard
    '/scoreboard': { GET: ScoreboardResponseSchema },
    '/scoreboard/top/${string}': { GET: Unspecified },

    // shares
    '/shares': { POST: Unspecified },

    // solutions
    '/solutions': { GET: SolutionListResponseSchema, POST: SolutionResponseSchema },
    '/solutions/${string}': { GET: SolutionResponseSchema, PATCH: SolutionResponseSchema, DELETE: Simple },

    // statistics
    '/statistics/challenges/solves': { GET: Unspecified },
    '/statistics/challenges/solves/percentages': { GET: Unspecified },
    '/statistics/challenges/${string}': { GET: Unspecified },
    '/statistics/progression/matrix': { GET: Unspecified },
    '/statistics/scores/distribution': { GET: Unspecified },
    '/statistics/submissions/${string}': { GET: Unspecified },
    '/statistics/teams': { GET: Unspecified },
    '/statistics/users': { GET: Unspecified },
    '/statistics/users/${string}': { GET: Unspecified },

    // submissions
    '/submissions': { GET: SubmissionListResponseSchema, POST: SubmissionListResponseSchema },
    '/submissions/${string}': { GET: SubmissionResponseSchema, PATCH: SubmissionResponseSchema, DELETE: Simple },

    // tags
    '/tags': { GET: TagListResponseSchema, POST: TagResponseSchema },
    '/tags/${string}': { GET: TagResponseSchema, PATCH: TagResponseSchema, DELETE: Simple },

    // teams
    '/teams': { GET: TeamListResponseSchema, POST: TeamResponseSchema },
    '/teams/me': { GET: TeamResponseSchema, PATCH: TeamResponseSchema, DELETE: Simple },
    '/teams/me/awards': { GET: Unspecified },
    '/teams/me/fails': { GET: Unspecified },
    '/teams/me/members': { POST: Unspecified },
    '/teams/me/solves': { GET: Unspecified },
    '/teams/${string}': { GET: TeamResponseSchema, POST: Unspecified, PATCH: TeamResponseSchema, DELETE: Simple },
    '/teams/${string}/awards': { GET: Unspecified },
    '/teams/${string}/fails': { GET: Unspecified },
    '/teams/${string}/members': { GET: Unspecified, POST: Unspecified, DELETE: Unspecified },
    '/teams/${string}/solves': { GET: Unspecified },

    // tokens
    '/tokens': { GET: TokenListResponseSchema, POST: TokenResponseSchema },
    '/tokens/${string}': { GET: ValuelessTokenResponseSchema, DELETE: Simple },

    // topics
    '/topics': { GET: TopicListResponseSchema, POST: TopicResponseSchema, DELETE: Simple },
    '/topics/${string}': { GET: TopicResponseSchema, DELETE: Simple },

    // unlocks
    '/unlocks': { GET: UnlockListResponseSchema, POST: UnlockResponseSchema },

    // users
    '/users': { GET: UserListResponseSchema, POST: UserResponseSchema },
    '/users/me': { GET: UserResponseSchema, PATCH: UserResponseSchema },
    '/users/me/awards': { GET: Unspecified },
    '/users/me/fails': { GET: Unspecified },
    '/users/me/solves': { GET: Unspecified },
    '/users/me/submissions': { GET: Unspecified },
    '/users/${string}': { GET: UserResponseSchema, POST: Unspecified, PATCH: UserResponseSchema, DELETE: Simple },
    '/users/${string}/awards': { GET: Unspecified },
    '/users/${string}/email': { POST: Unspecified },
    '/users/${string}/fails': { GET: Unspecified },
    '/users/${string}/solves': { GET: Unspecified }
};
const PLACEHOLDER = '${string}';

const matchers = new Map<string, RegExp>();

function patternMatcher(pattern: string): RegExp {
    let matcher = matchers.get(pattern);
    if (matcher === undefined) {
        const source = pattern
            .split(PLACEHOLDER)
            .map((part) => RegExp.escape(part))
            .join('(.+)');
        matcher = new RegExp(`^${source}$`);
        matchers.set(pattern, matcher);
    }
    return matcher;
}

const schemaEntries = Object.entries(ctfdRouteSchemas);

/**
 * The valibot schema that validates a method's response on a concrete CTFd path. Static
 * routes match exactly; a path with parameters matches the pattern carrying the most
 * literal text, so /users/me beats `/users/${string}` and `/users/${string}/awards`
 * beats `/users/${string}`. A route the table does not know falls back to the loose
 * envelope, mirroring the Unspecified entries of CTFdRouteTable.
 */
export function resolveCTFdResponseSchema(route: string, method: CTFdMethod): v.GenericSchema {
    let best: { literals: number; methods: CTFdMethodSchemas } | undefined;
    for (const [pattern, methods] of schemaEntries) {
        if (methods === undefined) continue;
        const isMatch = pattern.includes(PLACEHOLDER) ? patternMatcher(pattern).test(route) : pattern === route;
        if (!isMatch) continue;
        const literals = pattern.replaceAll(PLACEHOLDER, '').length;
        if (best === undefined || literals > best.literals) {
            best = { literals, methods };
        }
    }
    return best?.methods[method] ?? CTFdUnknownResponseSchema;
}

/**
 * Whether data parses as a method's documented response. The check runs against the
 * schema the resolver picks, which the runtime table keeps identical to the one
 * CTFdRouteTable names for the route — the mirror invariant that makes the narrowing
 * sound. Failing here means the server did not answer the shape CTFd documents.
 */
export function isCTFdRouteOutput<Route extends CTFdRoute, Method extends CTFdRouteMethods<Route>>(
    route: Route,
    method: Method,
    data: unknown
): data is CTFdRouteOutput<Route, Method> {
    return v.is(resolveCTFdResponseSchema(route, method), data);
}
