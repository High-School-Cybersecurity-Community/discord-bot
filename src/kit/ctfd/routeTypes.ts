/* eslint-disable max-lines -- transcribing CTFd's whole API takes one line per route */
import type {
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
import type * as v from 'valibot';

/**
 * Route list types for CTFd's API v1, transcribed from the API's own swagger document
 * (`/api/v1/swagger.json`, linked from https://docs.ctfd.io/docs/api/redoc/).
 */

/** Every HTTP method CTFd's API v1 answers. */
export type CTFdMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';

/**
 * A JSON body whose shape CTFd's swagger does not document for the route. Most write
 * routes marshal one of the entity schemas from `./responses` but leave the request
 * body unspecified, so this stays loose until a route needs more precision.
 */
export type CTFdUnknownBody = Record<string, unknown>;

/** Body of `POST /pages`, the one write route on a documented model. */
export interface CTFdPageInput {
    title?: string;
    route?: string;
    content?: string;
    draft?: boolean;
    hidden?: boolean;
    auth_required?: boolean;
    format?: string;
    link_target?: string;
}

/** Body of `POST /solutions`. */
export interface CTFdSolutionInput {
    challenge_id?: number;
    content?: string;
    state?: string;
}

/** Body of `POST /submissions`. Players submit flags through `POST /challenges/attempt` instead. */
export interface CTFdSubmissionInput {
    challenge_id?: number;
    user_id?: number;
    team_id?: number;
    ip?: string;
    provided?: string;
    type?: string;
    date?: string;
}

/** Form fields of `POST /files`, which is multipart; the `file` field itself is the upload. */
export interface CTFdFileUploadInput {
    challenge_id?: number;
    challenge?: number;
    page_id?: number;
    page?: number;
    solution_id?: number;
    solution?: number;
    type?: string;
    location?: string;
}

/**
 * One method on one route: the valibot schema for its response, and the request body it
 * accepts. Read-only methods leave `inputs` out.
 */
export interface CTFdMethodEntry<Response extends v.GenericSchema = typeof CTFdUnknownResponseSchema, Inputs = never> {
    response: Response;
    inputs?: Inputs;
}

// Shorthands for the entries CTFd documents least: an undocumented response, an
// undocumented response with an unspecified write body, and the bare `{ success: true }`.
type Unspecified = CTFdMethodEntry;
type UnspecifiedWrite = CTFdMethodEntry<typeof CTFdUnknownResponseSchema, CTFdUnknownBody>;
type Simple = CTFdMethodEntry<typeof CTFdSimpleResponseSchema>;

export interface CTFdRouteTable {
    // audiences
    '/audiences': { GET: Unspecified; POST: UnspecifiedWrite };
    [audience: `/audiences/${string}`]: {
        GET?: Unspecified;
        POST?: UnspecifiedWrite;
        PATCH?: UnspecifiedWrite;
        DELETE?: Unspecified;
    };
    [audience: `/audiences/${string}/members`]: { GET?: Unspecified; POST?: UnspecifiedWrite };
    [audience: `/audiences/${string}/members/${string}`]: { DELETE?: Unspecified };

    // awards
    '/awards': {
        // The swagger documents both POST and GET with the list envelope.
        GET: CTFdMethodEntry<typeof AwardListResponseSchema>;
        POST: CTFdMethodEntry<typeof AwardListResponseSchema, CTFdUnknownBody>;
    };
    [award: `/awards/${string}`]: { GET?: CTFdMethodEntry<typeof AwardResponseSchema>; DELETE?: Simple };

    // brackets
    '/brackets': { GET: Unspecified; POST: UnspecifiedWrite };
    [bracket: `/brackets/${string}`]: { PATCH?: UnspecifiedWrite; DELETE?: Unspecified };

    // challenges
    '/challenges': {
        GET: CTFdMethodEntry<typeof ChallengeListResponseSchema>;
        POST: CTFdMethodEntry<typeof ChallengeResponseSchema, CTFdUnknownBody>;
    };
    '/challenges/attempt': { POST: UnspecifiedWrite };
    '/challenges/types': { GET: Unspecified };
    [challenge: `/challenges/${string}`]: {
        GET?: CTFdMethodEntry<typeof ChallengeResponseSchema | typeof CTFdUnknownResponseSchema>;
        POST?: UnspecifiedWrite;
        PUT?: UnspecifiedWrite;
        PATCH?: CTFdMethodEntry<typeof ChallengeResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };
    [challenge: `/challenges/${string}/files`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/flags`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/hints`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/ratings`]: { GET?: Unspecified; PUT?: UnspecifiedWrite };
    [challenge: `/challenges/${string}/requirements`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/solution`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/solves`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/tags`]: { GET?: Unspecified };
    [challenge: `/challenges/${string}/topics`]: { GET?: Unspecified };

    // comments
    '/comments': {
        GET: CTFdMethodEntry<typeof CommentListResponseSchema>;
        POST: CTFdMethodEntry<typeof CommentResponseSchema, CTFdUnknownBody>;
    };
    [comment: `/comments/${string}`]: { DELETE?: Simple };

    // configs
    '/configs': {
        GET: CTFdMethodEntry<typeof ConfigListResponseSchema>;
        PATCH: CTFdMethodEntry<typeof CTFdSimpleResponseSchema, CTFdUnknownBody>;
        POST: CTFdMethodEntry<typeof ConfigResponseSchema, CTFdUnknownBody>;
    };
    '/configs/fields': { GET: Unspecified; POST: UnspecifiedWrite };
    [field: `/configs/fields/${string}`]: { GET?: Unspecified; PATCH?: UnspecifiedWrite; DELETE?: Unspecified };
    [config: `/configs/${string}`]: {
        GET?: CTFdMethodEntry<typeof ConfigResponseSchema | typeof CTFdUnknownResponseSchema>;
        POST?: UnspecifiedWrite;
        PATCH?: CTFdMethodEntry<typeof ConfigResponseSchema | typeof CTFdUnknownResponseSchema, CTFdUnknownBody>;
        DELETE?: CTFdMethodEntry<typeof CTFdSimpleResponseSchema | typeof CTFdUnknownResponseSchema>;
    };

    // exports
    // The raw export is a file download, not JSON, so there is nothing to validate.
    '/exports/raw': { POST: CTFdMethodEntry<typeof CTFdEmptyResponseSchema, CTFdUnknownBody> };

    // files
    '/files': {
        GET: CTFdMethodEntry<typeof FileListResponseSchema>;
        POST: CTFdMethodEntry<typeof FileResponseSchema, CTFdFileUploadInput>;
    };
    [file: `/files/${string}`]: { GET?: CTFdMethodEntry<typeof FileResponseSchema>; DELETE?: Simple };

    // flags
    '/flags': {
        GET: CTFdMethodEntry<typeof FlagListResponseSchema>;
        POST: CTFdMethodEntry<typeof FlagResponseSchema, CTFdUnknownBody>;
    };
    '/flags/types': { GET: Unspecified };
    [type_name: `/flags/types/${string}`]: { GET?: Unspecified };
    [flag: `/flags/${string}`]: {
        GET?: CTFdMethodEntry<typeof FlagResponseSchema | typeof CTFdUnknownResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof FlagResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // hints
    '/hints': {
        GET: CTFdMethodEntry<typeof HintListResponseSchema>;
        POST: CTFdMethodEntry<typeof HintResponseSchema, CTFdUnknownBody>;
    };
    [hint: `/hints/${string}`]: {
        GET?: CTFdMethodEntry<typeof HintResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof HintResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // modules
    '/modules': { GET: Unspecified; POST: UnspecifiedWrite };
    [module: `/modules/${string}`]: {
        GET?: Unspecified;
        POST?: UnspecifiedWrite;
        PATCH?: UnspecifiedWrite;
        DELETE?: Unspecified;
    };
    [module: `/modules/${string}/audiences`]: { GET?: Unspecified; POST?: UnspecifiedWrite };
    [module: `/modules/${string}/audiences/${string}`]: { DELETE?: Unspecified };
    [module: `/modules/${string}/challenges`]: { GET?: Unspecified; POST?: UnspecifiedWrite };

    // notifications
    // HEAD has no response body by definition; the swagger's simple response there is a
    // documentation quirk.
    '/notifications': {
        GET: CTFdMethodEntry<typeof NotificationListResponseSchema>;
        HEAD: CTFdMethodEntry<typeof CTFdEmptyResponseSchema>;
        POST: CTFdMethodEntry<typeof NotificationResponseSchema, CTFdUnknownBody>;
    };
    [notification: `/notifications/${string}`]: {
        GET?: CTFdMethodEntry<typeof NotificationResponseSchema>;
        DELETE?: Simple;
    };

    // pages
    '/pages': {
        GET: CTFdMethodEntry<typeof PageListResponseSchema>;
        POST: CTFdMethodEntry<typeof PageResponseSchema, CTFdPageInput>;
    };
    [page: `/pages/${string}`]: {
        GET?: CTFdMethodEntry<typeof PageResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof PageResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // scoreboard
    '/scoreboard': { GET: CTFdMethodEntry<typeof ScoreboardResponseSchema> };
    [count: `/scoreboard/top/${string}`]: { GET?: Unspecified };

    // shares
    '/shares': { POST: UnspecifiedWrite };

    // solutions
    '/solutions': {
        GET: CTFdMethodEntry<typeof SolutionListResponseSchema>;
        POST: CTFdMethodEntry<typeof SolutionResponseSchema, CTFdSolutionInput>;
    };
    [solution: `/solutions/${string}`]: {
        GET?: CTFdMethodEntry<typeof SolutionResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof SolutionResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // statistics
    '/statistics/challenges/solves': { GET: Unspecified };
    '/statistics/challenges/solves/percentages': { GET: Unspecified };
    [column: `/statistics/challenges/${string}`]: { GET?: Unspecified };
    '/statistics/progression/matrix': { GET: Unspecified };
    '/statistics/scores/distribution': { GET: Unspecified };
    [column: `/statistics/submissions/${string}`]: { GET?: Unspecified };
    '/statistics/teams': { GET: Unspecified };
    '/statistics/users': { GET: Unspecified };
    [column: `/statistics/users/${string}`]: { GET?: Unspecified };

    // submissions
    '/submissions': {
        // The swagger documents both POST and GET with the list envelope.
        GET: CTFdMethodEntry<typeof SubmissionListResponseSchema>;
        POST: CTFdMethodEntry<typeof SubmissionListResponseSchema, CTFdSubmissionInput>;
    };
    [submission: `/submissions/${string}`]: {
        GET?: CTFdMethodEntry<typeof SubmissionResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof SubmissionResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // tags
    '/tags': {
        GET: CTFdMethodEntry<typeof TagListResponseSchema>;
        POST: CTFdMethodEntry<typeof TagResponseSchema, CTFdUnknownBody>;
    };
    [tag: `/tags/${string}`]: {
        GET?: CTFdMethodEntry<typeof TagResponseSchema>;
        PATCH?: CTFdMethodEntry<typeof TagResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };

    // teams
    '/teams': {
        GET: CTFdMethodEntry<typeof TeamListResponseSchema>;
        POST: CTFdMethodEntry<typeof TeamResponseSchema, CTFdUnknownBody>;
    };
    '/teams/me': {
        GET: CTFdMethodEntry<typeof TeamResponseSchema>;
        PATCH: CTFdMethodEntry<typeof TeamResponseSchema, CTFdUnknownBody>;
        DELETE: Simple;
    };
    '/teams/me/awards': { GET: Unspecified };
    '/teams/me/fails': { GET: Unspecified };
    '/teams/me/members': { POST: UnspecifiedWrite };
    '/teams/me/solves': { GET: Unspecified };
    [team: `/teams/${string}`]: {
        GET?: CTFdMethodEntry<typeof TeamResponseSchema | typeof CTFdUnknownResponseSchema>;
        POST?: UnspecifiedWrite;
        PATCH?: CTFdMethodEntry<typeof TeamResponseSchema, CTFdUnknownBody>;
        DELETE?: CTFdMethodEntry<typeof CTFdSimpleResponseSchema | typeof CTFdUnknownResponseSchema>;
    };
    [team: `/teams/${string}/awards`]: { GET?: Unspecified };
    [team: `/teams/${string}/fails`]: { GET?: Unspecified };
    [team: `/teams/${string}/members`]: { GET?: Unspecified; POST?: UnspecifiedWrite; DELETE?: Unspecified };
    [team: `/teams/${string}/solves`]: { GET?: Unspecified };

    // tokens
    // GET /tokens/{token_id} answers with the token's fields but never its value.
    '/tokens': {
        GET: CTFdMethodEntry<typeof TokenListResponseSchema>;
        POST: CTFdMethodEntry<typeof TokenResponseSchema, CTFdUnknownBody>;
    };
    [token: `/tokens/${string}`]: { GET?: CTFdMethodEntry<typeof ValuelessTokenResponseSchema>; DELETE?: Simple };

    // topics
    '/topics': {
        GET: CTFdMethodEntry<typeof TopicListResponseSchema>;
        POST: CTFdMethodEntry<typeof TopicResponseSchema, CTFdUnknownBody>;
        DELETE: Simple;
    };
    [topic: `/topics/${string}`]: { GET?: CTFdMethodEntry<typeof TopicResponseSchema>; DELETE?: Simple };

    // unlocks
    '/unlocks': {
        GET: CTFdMethodEntry<typeof UnlockListResponseSchema>;
        POST: CTFdMethodEntry<typeof UnlockResponseSchema, CTFdUnknownBody>;
    };

    // users
    '/users': {
        GET: CTFdMethodEntry<typeof UserListResponseSchema>;
        POST: CTFdMethodEntry<typeof UserResponseSchema, CTFdUnknownBody>;
    };
    '/users/me': {
        GET: CTFdMethodEntry<typeof UserResponseSchema>;
        PATCH: CTFdMethodEntry<typeof UserResponseSchema, CTFdUnknownBody>;
    };
    '/users/me/awards': { GET: Unspecified };
    '/users/me/fails': { GET: Unspecified };
    '/users/me/solves': { GET: Unspecified };
    '/users/me/submissions': { GET: Unspecified };
    [user: `/users/${string}`]: {
        GET?: CTFdMethodEntry<typeof UserResponseSchema | typeof CTFdUnknownResponseSchema>;
        POST?: UnspecifiedWrite;
        PATCH?: CTFdMethodEntry<typeof UserResponseSchema, CTFdUnknownBody>;
        DELETE?: Simple;
    };
    [user: `/users/${string}/awards`]: { GET?: Unspecified };
    [user: `/users/${string}/email`]: { POST?: UnspecifiedWrite };
    [user: `/users/${string}/fails`]: { GET?: Unspecified };
    [user: `/users/${string}/solves`]: { GET?: Unspecified };
}

/** Any route CTFd's API v1 exposes. */
export type CTFdRoute = keyof CTFdRouteTable;

/** The methods a route answers. */
export type CTFdRouteMethods<Route extends CTFdRoute> = keyof NonNullable<CTFdRouteTable[Route]> & CTFdMethod;

/** The request body a method takes, or `never` when it takes none. */
export type CTFdRouteInputs<Route extends CTFdRoute, Method extends CTFdRouteMethods<Route>> =
    NonNullable<NonNullable<CTFdRouteTable[Route]>[Method]> extends { inputs?: infer Inputs }
        ? NonNullable<Inputs>
        : never;

/** The valibot schema a method's response validates against, from the route's entry. */
export type CTFdRouteSchema<Route extends CTFdRoute, Method extends CTFdRouteMethods<Route>> =
    NonNullable<NonNullable<CTFdRouteTable[Route]>[Method]> extends { response: infer Schema extends v.GenericSchema }
        ? Schema
        : typeof CTFdUnknownResponseSchema;

/**
 * The data a method's response parses to, via its schema. Instantiated at a call site it
 * resolves to the route's documented envelope, and it distributes over the unions pattern
 * entries carry.
 */
export type CTFdRouteOutput<Route extends CTFdRoute, Method extends CTFdRouteMethods<Route>> = v.InferOutput<
    CTFdRouteSchema<Route, Method>
>;
