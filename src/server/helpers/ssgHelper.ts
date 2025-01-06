import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { db } from "~/server/db";
import superjson from "superjson";
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";

export const generateSSGHelper = () => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: { db, currentUser: null },
    transformer: superjson, // optional - adds superjson serialization
  });

  return ssg;
};
