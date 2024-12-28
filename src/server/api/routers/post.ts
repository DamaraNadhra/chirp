import { clerkClient, User } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id, 
    username: user.username, 
    imageUrl: user.imageUrl
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts =  await ctx.db.post.findMany({ 
      take: 100,
    });

    const users = (await (await clerkClient()).users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100
    })).data.map(filterUserForClient);
    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      if (!author || !author.username) throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR", 
        message: "author not found"
      })

      return {
        post,
        author: {
          ...author,
          username: author.username
        }
      }
    })
  })
});
