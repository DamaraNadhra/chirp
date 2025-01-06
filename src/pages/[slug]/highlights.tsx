import Head from "next/head";

import { api } from "~/utils/api";

import { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { ProfilePageLayout } from "~/components/profileLayout";

const EditProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data: userData, isLoading } = api.profiles.getUserByUsername.useQuery(
    { username },
  );

  if (!userData || isLoading) return <div>Loading...</div>;
  return (
    <>
      <Head>
        <title>Edit Profile </title>
      </Head>
      <PageLayout>
        <ProfilePageLayout username={username} />
        <div className="flex flex-grow border-x border-gray-700 ">
          No Highlights for now
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const slug = context.params?.slug;
  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profiles.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default EditProfilePage;
