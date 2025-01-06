import { useUser } from "@clerk/nextjs";
import Head from "next/head";

import { api } from "~/utils/api";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.posts.getById.useQuery({ id });

  const { isLoaded: userLoaded } = useUser();

  if (!data || isLoading) return <div>Loading....</div>;

  api.posts.getAll.useQuery();
  // return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;
  return (
    <>
      <Head>
        <title>{`@${data.author.username} - ${data.post.content}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
