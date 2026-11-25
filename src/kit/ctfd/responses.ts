import * as v from 'valibot';

/**
 * Response schemas for CTFd's API v1, shaped after the API's own swagger document
 * (`/api/v1/swagger.json`, linked from https://docs.ctfd.io/docs/api/redoc/)
 * Test against demo.ctf.io
 */

const integer = v.pipe(v.number(), v.integer());

/** Pagination block CTFd attaches to some list responses. */
export const PaginationSchema = v.looseObject({
    page: integer,
    next: v.nullable(integer),
    prev: v.nullable(integer),
    pages: integer,
    per_page: integer,
    total: integer
});
export type CTFdPagination = v.InferOutput<typeof PaginationSchema>;

/** Envelope for endpoints that return nothing but a success flag, such as deletes. */
export const CTFdSimpleResponseSchema = v.object({
    success: v.literal(true)
});
export type CTFdSimpleResponse = v.InferOutput<typeof CTFdSimpleResponseSchema>;

/**
 * Envelope failed requests answer with. CTFd's swagger documents an envelope carrying
 * `success: false` plus an `errors` array for data errors; its auth middleware answers
 * a bare envelope with just a `message` string instead, so the schema accepts either.
 */
export const CTFdErrorResponseSchema = v.union([
    v.looseObject({ success: v.literal(false), errors: v.array(v.string()) }),
    v.looseObject({ message: v.string() })
]);
export type CTFdErrorResponse = v.InferOutput<typeof CTFdErrorResponseSchema>;

/** Envelope for endpoints whose data shape CTFd's swagger leaves undocumented. */
export const CTFdUnknownResponseSchema = v.looseObject({ success: v.literal(true) });
export type CTFdUnknownResponse = v.InferOutput<typeof CTFdUnknownResponseSchema>;

/** A response with no JSON body to validate, such as a HEAD request or the raw export download. */
export const CTFdEmptyResponseSchema = v.unknown();
export type CTFdEmptyResponse = v.InferOutput<typeof CTFdEmptyResponseSchema>;

export const AwardSchema = v.looseObject({
    id: integer,
    user_id: v.nullish(integer),
    team_id: v.nullish(integer),
    type: v.nullish(v.string()),
    name: v.nullish(v.string()),
    description: v.nullish(v.string()),
    date: v.nullish(v.string()),
    value: v.nullish(integer),
    category: v.nullish(v.string()),
    icon: v.nullish(v.string()),
    requirements: v.nullish(v.record(v.string(), v.unknown()))
});
export type CTFdAward = v.InferOutput<typeof AwardSchema>;

export const ChallengeSchema = v.looseObject({
    id: integer,
    name: v.string(),
    description: v.nullish(v.string()),
    attribution: v.nullish(v.string()),
    connection_info: v.nullish(v.string()),
    next_id: v.nullish(integer),
    max_attempts: v.nullish(integer),
    value: v.nullish(integer),
    category: v.nullish(v.string()),
    type: v.nullish(v.string()),
    state: v.nullish(v.string()),
    logic: v.nullish(v.string()),
    initial: v.nullish(integer),
    minimum: v.nullish(integer),
    decay: v.nullish(integer),
    position: v.nullish(integer),
    function: v.nullish(v.string()),
    scheduled_at: v.nullish(v.string()),
    module_id: v.nullish(integer),
    requirements: v.nullish(v.record(v.string(), v.unknown())),
    solves: v.nullish(integer),
    solved_by_me: v.nullish(v.boolean())
});
export type CTFdChallenge = v.InferOutput<typeof ChallengeSchema>;

export const CommentSchema = v.looseObject({
    id: integer,
    type: v.nullish(v.string()),
    content: v.nullish(v.string()),
    date: v.nullish(v.string()),
    author_id: v.nullish(integer)
});
export type CTFdComment = v.InferOutput<typeof CommentSchema>;

export const ConfigSchema = v.looseObject({
    id: integer,
    key: v.nullish(v.string()),
    value: v.nullish(v.string())
});
export type CTFdConfig = v.InferOutput<typeof ConfigSchema>;

export const FileSchema = v.looseObject({
    id: integer,
    type: v.nullish(v.string()),
    location: v.nullish(v.string()),
    sha1sum: v.nullish(v.string())
});
export type CTFdFile = v.InferOutput<typeof FileSchema>;

export const FlagSchema = v.looseObject({
    id: integer,
    challenge_id: v.nullish(integer),
    type: v.nullish(v.string()),
    content: v.nullish(v.string()),
    data: v.nullish(v.string())
});
export type CTFdFlag = v.InferOutput<typeof FlagSchema>;

export const HintSchema = v.looseObject({
    id: integer,
    title: v.nullish(v.string()),
    type: v.nullish(v.string()),
    challenge_id: v.nullish(integer),
    content: v.nullish(v.string()),
    cost: v.nullish(integer),
    requirements: v.nullish(v.record(v.string(), v.unknown()))
});
export type CTFdHint = v.InferOutput<typeof HintSchema>;

export const NotificationSchema = v.looseObject({
    id: integer,
    title: v.nullish(v.string()),
    content: v.nullish(v.string()),
    date: v.nullish(v.string()),
    user_id: v.nullish(integer),
    team_id: v.nullish(integer)
});
export type CTFdNotification = v.InferOutput<typeof NotificationSchema>;

export const PageSchema = v.looseObject({
    id: integer,
    title: v.nullish(v.string()),
    route: v.nullish(v.string()),
    content: v.nullish(v.string()),
    draft: v.nullish(v.boolean()),
    hidden: v.nullish(v.boolean()),
    auth_required: v.nullish(v.boolean()),
    format: v.nullish(v.string()),
    link_target: v.nullish(v.string())
});
export type CTFdPage = v.InferOutput<typeof PageSchema>;

/** One row of `GET /scoreboard`, as returned by a live CTFd in team mode. */
export const ScoreboardEntrySchema = v.looseObject({
    pos: integer,
    account_id: integer,
    account_url: v.string(),
    account_type: v.nullish(v.picklist(['user', 'team'])),
    oauth_id: v.nullish(v.string()),
    name: v.string(),
    score: integer,
    bracket_id: v.nullish(integer),
    bracket_name: v.nullish(v.string()),
    members: v.nullish(
        v.array(
            v.looseObject({
                id: integer,
                oauth_id: v.nullish(v.string()),
                name: v.string(),
                score: integer,
                bracket_id: v.nullish(integer),
                bracket_name: v.nullish(v.string())
            })
        )
    )
});
export type CTFdScoreboardEntry = v.InferOutput<typeof ScoreboardEntrySchema>;

export const SolutionSchema = v.looseObject({
    id: integer,
    challenge_id: v.nullish(integer),
    content: v.nullish(v.string()),
    state: v.nullish(v.string())
});
export type CTFdSolution = v.InferOutput<typeof SolutionSchema>;

export const SubmissionSchema = v.looseObject({
    id: integer,
    challenge_id: v.nullish(integer),
    user_id: v.nullish(integer),
    team_id: v.nullish(integer),
    ip: v.nullish(v.string()),
    provided: v.nullish(v.string()),
    type: v.nullish(v.string()),
    date: v.nullish(v.string())
});
export type CTFdSubmission = v.InferOutput<typeof SubmissionSchema>;

export const TagSchema = v.looseObject({
    id: integer,
    challenge_id: v.nullish(integer),
    value: v.nullish(v.string())
});
export type CTFdTag = v.InferOutput<typeof TagSchema>;

export const TeamSchema = v.looseObject({
    id: integer,
    oauth_id: v.nullish(v.string()),
    name: v.string(),
    email: v.nullish(v.string()),
    password: v.nullish(v.string()),
    secret: v.nullish(v.string()),
    website: v.nullish(v.string()),
    affiliation: v.nullish(v.string()),
    country: v.nullish(v.string()),
    bracket_id: v.nullish(integer),
    hidden: v.nullish(v.boolean()),
    banned: v.nullish(v.boolean()),
    captain_id: v.nullish(integer),
    created: v.nullish(v.string())
});
export type CTFdTeam = v.InferOutput<typeof TeamSchema>;

export const TokenSchema = v.looseObject({
    id: integer,
    type: v.nullish(v.string()),
    user_id: v.nullish(integer),
    created: v.nullish(v.string()),
    expiration: v.nullish(v.string()),
    description: v.nullish(v.string()),
    value: v.nullish(v.string())
});
export type CTFdToken = v.InferOutput<typeof TokenSchema>;

/** `GET /tokens/{token_id}` answers with the token's fields but never its value. */
export const ValuelessTokenSchema = v.looseObject({
    id: integer,
    type: v.nullish(v.string()),
    user_id: v.nullish(integer),
    created: v.nullish(v.string()),
    expiration: v.nullish(v.string()),
    description: v.nullish(v.string())
});
export type CTFdValuelessToken = v.InferOutput<typeof ValuelessTokenSchema>;

export const TopicSchema = v.looseObject({
    id: integer,
    value: v.nullish(v.string())
});
export type CTFdTopic = v.InferOutput<typeof TopicSchema>;

export const UnlockSchema = v.looseObject({
    id: integer,
    user_id: v.nullish(integer),
    team_id: v.nullish(integer),
    ip: v.nullish(v.string()),
    target: v.nullish(integer),
    date: v.nullish(v.string()),
    type: v.nullish(v.string())
});
export type CTFdUnlock = v.InferOutput<typeof UnlockSchema>;

export const UserSchema = v.looseObject({
    id: integer,
    oauth_id: v.nullish(v.string()),
    name: v.string(),
    password: v.nullish(v.string()),
    email: v.nullish(v.string()),
    type: v.nullish(v.string()),
    secret: v.nullish(v.string()),
    website: v.nullish(v.string()),
    affiliation: v.nullish(v.string()),
    country: v.nullish(v.string()),
    bracket_id: v.nullish(integer),
    hidden: v.nullish(v.boolean()),
    banned: v.nullish(v.boolean()),
    verified: v.nullish(v.boolean()),
    language: v.nullish(v.string()),
    change_password: v.nullish(v.boolean()),
    team_id: v.nullish(integer),
    fields: v.nullish(
        v.array(
            v.looseObject({
                field_id: v.nullish(integer),
                value: v.nullish(v.string())
            })
        )
    ),
    created: v.nullish(v.string())
});
export type CTFdUser = v.InferOutput<typeof UserSchema>;

/** What `CTFdDetailedResponseSchema` validates, as a plain interface. */
export interface CTFdDetailedResponse<Entity> {
    success: true;
    data: Entity;
}

/** What `CTFdListResponseSchema` validates, as a plain interface. */
export interface CTFdListResponse<Entity> {
    success: true;
    data: Entity[];
    meta?: { pagination: CTFdPagination } | undefined;
}

/** Build the response schema for an endpoint that answers with one entity. */
export function CTFdDetailedResponseSchema<Entity extends v.GenericSchema>(
    entity: Entity
): v.ObjectSchema<{ success: v.LiteralSchema<true, undefined>; data: Entity }, undefined> {
    return v.object({
        success: v.literal(true),
        data: entity
    });
}

/** Build the response schema for an endpoint that answers with an array of entities. */
export function CTFdListResponseSchema<Entity extends v.GenericSchema>(
    entity: Entity
): v.ObjectSchema<
    {
        success: v.LiteralSchema<true, undefined>;
        data: v.ArraySchema<Entity, undefined>;
        meta: v.OptionalSchema<v.ObjectSchema<{ pagination: typeof PaginationSchema }, undefined>, undefined>;
    },
    undefined
> {
    return v.object({
        success: v.literal(true),
        data: v.array(entity),
        meta: v.optional(
            v.object({
                pagination: PaginationSchema
            })
        )
    });
}

export const AwardResponseSchema = CTFdDetailedResponseSchema(AwardSchema);
export const AwardListResponseSchema = CTFdListResponseSchema(AwardSchema);
export const ChallengeResponseSchema = CTFdDetailedResponseSchema(ChallengeSchema);
export const ChallengeListResponseSchema = CTFdListResponseSchema(ChallengeSchema);
export const CommentResponseSchema = CTFdDetailedResponseSchema(CommentSchema);
export const CommentListResponseSchema = CTFdListResponseSchema(CommentSchema);
export const ConfigResponseSchema = CTFdDetailedResponseSchema(ConfigSchema);
export const ConfigListResponseSchema = CTFdListResponseSchema(ConfigSchema);
export const FileResponseSchema = CTFdDetailedResponseSchema(FileSchema);
export const FileListResponseSchema = CTFdListResponseSchema(FileSchema);
export const FlagResponseSchema = CTFdDetailedResponseSchema(FlagSchema);
export const FlagListResponseSchema = CTFdListResponseSchema(FlagSchema);
export const HintResponseSchema = CTFdDetailedResponseSchema(HintSchema);
export const HintListResponseSchema = CTFdListResponseSchema(HintSchema);
export const NotificationResponseSchema = CTFdDetailedResponseSchema(NotificationSchema);
export const NotificationListResponseSchema = CTFdListResponseSchema(NotificationSchema);
export const PageResponseSchema = CTFdDetailedResponseSchema(PageSchema);
export const PageListResponseSchema = CTFdListResponseSchema(PageSchema);
export const ScoreboardResponseSchema = CTFdListResponseSchema(ScoreboardEntrySchema);
export const SolutionResponseSchema = CTFdDetailedResponseSchema(SolutionSchema);
export const SolutionListResponseSchema = CTFdListResponseSchema(SolutionSchema);
export const SubmissionResponseSchema = CTFdDetailedResponseSchema(SubmissionSchema);
export const SubmissionListResponseSchema = CTFdListResponseSchema(SubmissionSchema);
export const TagResponseSchema = CTFdDetailedResponseSchema(TagSchema);
export const TagListResponseSchema = CTFdListResponseSchema(TagSchema);
export const TeamResponseSchema = CTFdDetailedResponseSchema(TeamSchema);
export const TeamListResponseSchema = CTFdListResponseSchema(TeamSchema);
export const TokenResponseSchema = CTFdDetailedResponseSchema(TokenSchema);
export const TokenListResponseSchema = CTFdListResponseSchema(TokenSchema);
export const ValuelessTokenResponseSchema = CTFdDetailedResponseSchema(ValuelessTokenSchema);
export const TopicResponseSchema = CTFdDetailedResponseSchema(TopicSchema);
export const TopicListResponseSchema = CTFdListResponseSchema(TopicSchema);
export const UnlockResponseSchema = CTFdDetailedResponseSchema(UnlockSchema);
export const UnlockListResponseSchema = CTFdListResponseSchema(UnlockSchema);
export const UserResponseSchema = CTFdDetailedResponseSchema(UserSchema);
export const UserListResponseSchema = CTFdListResponseSchema(UserSchema);
