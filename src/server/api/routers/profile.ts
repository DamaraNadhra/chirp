import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
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
    .query(async ({ input }) => {
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
    .mutation(async ({ input }) => {
      const client = await clerkClient();
      const response = await client.users.updateUser(input.userId, {
        username: input.username,
      });
      return response;
    }),

    editUnsafeMetadata: privateProcedure.input(z.object({
      userId: z.string(),
      followers: z.number().optional(),
      following: z.number().optional(),
      description: z.string(),
    })).mutation(async ({ input }) => {
      const client = await clerkClient();

      const response = await client.users.updateUserMetadata(input.userId, {
        unsafeMetadata: {
          followers: input.followers,
          following: input.following,
          description: input.description,
        }
      })

      return response;
    })

});
