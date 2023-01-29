/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import type { NextApiRequest, NextApiResponse } from 'next';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { type Session } from 'next-auth';

import { getServerAuthSession } from '../auth';
import { prisma } from '../db';

type CreateContextOptions = {
  session: Session | null;
  req: NextApiRequest;
  res: NextApiResponse;
};

type CtxUser = {
  id: string;
  email: string;
  name: string;
  iat: string;
  exp: number;
};

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
// const createInnerTRPCContext = (opts: CreateContextOptions) => {
//   return {
//     session: opts.session,
//     prisma,
//   };
// };

const getUserFromRequest = (req: NextApiRequest) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const verified = verifyJwt<CtxUser>(token);
      return verified;
    } catch (e) {
      return null;
    }
  }

  return null;
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @link https://trpc.io/docs/context
 */
export const createTRPCContext = (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const user = getUserFromRequest(req);
  return {
    prisma,
    req,
    res,
    user,
  };
};
// export const createTRPCContext = async (opts: CreateNextContextOptions) => {
//   const { req, res } = opts;

//   // Get the session from the server using the unstable_getServerSession wrapper function
//   const session = await getServerAuthSession({ req, res });

//   return createInnerTRPCContext({
//     session,
//     req,
//     res,
//   });
// };

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { verifyJwt } from '../../utils/jwt';
import { ZodError } from 'zod';

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    // return shape;
    if (error.code === 'BAD_REQUEST' && error.cause instanceof ZodError) {
      const zodError = JSON.parse(error.cause.message) as { message: string }[];
      return {
        ...shape,
        message: zodError[0]?.message,
      };
    }
    return {
      ...shape,
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = middleware(({ ctx, next }) => {
  // if (!ctx.session || !ctx.session.user) {
  //   throw new TRPCError({ code: 'UNAUTHORIZED' });
  // }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      // session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);