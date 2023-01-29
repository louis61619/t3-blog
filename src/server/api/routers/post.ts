import { TRPCError } from '@trpc/server';
import { createPostSchema, getSinglePostSchema } from '../../../schema/post';
import { createTRPCRouter, middleware, publicProcedure } from '../trpc';

// const authMiddleware = middleware(({ ctx, next }) => {
//   // if (!ctx.session || !ctx.session.user) {
//   //   throw new TRPCError({ code: 'UNAUTHORIZED' });
//   // }
//   return next({
//     ctx: {
//       // infers the `session` as non-nullable
//       // session: { ...ctx.session, user: ctx.session.user },
//     },
//   });
// })

const procedure = publicProcedure;
// .use(authMiddleware)

export const postRouter = createTRPCRouter({
  createPost: procedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.user);
      if (!ctx.user) {
        new TRPCError({
          code: 'FORBIDDEN',
          message: 'Can not create a post while logged out',
        });
      }
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user?.id,
            },
          },
        },
      });

      return post;
    }),
  post: procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
  singlePost: procedure.input(getSinglePostSchema).query(({ input, ctx }) => {
    return ctx.prisma.post.findUnique({
      where: {
        id: input.postId,
      },
    });
  }),
});
