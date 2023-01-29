import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { z } from 'zod';
import * as trpc from '@trpc/server';
import {
  createUserSchema,
  requestOTPschema,
  verifyOTPSchema,
} from '../../../schema/user';

import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { sendLoginEmail } from '../../../utils/mailer';
import { baseUrl, url } from '../../../constants';
import { decode, encode } from '../../../utils/base64';
import { signJwt } from '../../../utils/jwt';
import { serialize } from 'cookie';

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(createUserSchema)
    // .output(createUserOutputSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, name } = input;
      try {
        const User = await ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });
        return User;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          throw new trpc.TRPCError({
            code: 'CONFLICT',
            message: 'User already exists',
          });
        }

        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong',
        });
      }
    }),
  requestOTP: publicProcedure
    .input(requestOTPschema)
    .mutation(async ({ ctx, input }) => {
      const { email, redirect } = input;
      const user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }

      const token = await ctx.prisma.loginToken.create({
        data: {
          redirect,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      await sendLoginEmail({
        token: encode(`${token.id}:${user.email}`),
        url: baseUrl,
        email: user.email,
      });

      // send email to user

      return true;
    }),
  verifyOTP: publicProcedure
    .input(verifyOTPSchema)
    .query(async ({ ctx, input }) => {
      const decoded = decode(input.hash).split(':');
      const [id, email] = decoded;
      const token = await ctx.prisma.loginToken.findFirst({
        where: {
          id,
          user: {
            email,
          },
        },
        include: {
          user: true,
        },
      });
      if (!token) {
        throw new trpc.TRPCError({
          code: 'FORBIDDEN',
          message: 'Invalid token',
        });
      }

      const jwt = signJwt({
        email: token.user.email,
        id: token.user.id,
      });

      ctx.res.setHeader('Set-Cookie', serialize('token', jwt, { path: '/' }));

      const redirect = token.redirect;

      return {
        redirect,
      };
    }),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),
});
