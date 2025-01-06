import { clerkClient, User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { userAgent } from "next/server";
import { P } from "node_modules/@upstash/redis/zmscore-Dc6Llqgr.mjs";
import { z } from "zod";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { filterUserForClient } from "~/server/helpers/filterForUserClient";

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(
      z.object({
        username: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const users = await (
        await clerkClient()
      ).users.getUserList({
        username: [input.username],
      });
      const user = users.data[0];
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      return filterUserForClient(user);
    }),
  changeDescription: privateProcedure
    .input(
      z.object({
        description: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const client = await clerkClient();
      const response = await client.users.updateUserMetadata(input.userId, {
        unsafeMetadata: {
          description: input.description,
        },
      });
      return response;
    }),

  changeUsername: privateProcedure
    .input(
      z.object({
        username: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();
      const response = await client.users.updateUser(input.userId, {
        username: input.username,
      });
      return response;
    }),

    updateFollowing: privateProcedure
    .input(
      z.object({
        newAmount: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();
      const response = await client.users.updateUserMetadata(input.userId, {
        unsafeMetadata: {
          following: input.newAmount,
        },
      });
      return response;
    }),
  
    updateFollowers: privateProcedure
    .input(
      z.object({
        newAmount: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const client = await clerkClient();
      const response = await client.users.updateUserMetadata(input.userId, {
        unsafeMetadata: {
          followers: input.newAmount,
        },
      });
      return response;
    }),

});
