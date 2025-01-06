import Head from "next/head";
import { api } from "~/utils/api";

import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { ProfilePageLayout } from "~/components/profileLayout";

dayjs.extend(relativeTime);

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({
    userId: props.userId,
  });

  if (isLoading) return (
    <div className="flex flex-grow justify-center border-x border-gray-700">
      <div className="mt-9">
      <LoadingSpinner size={40} />
      </div>
    </div>

)

  if (!data || data.length == 0) return <div>User has not posted anything</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({
  username,
}) => {
  const { data, isLoading } = api.profiles.getUserByUsername.useQuery({
    username,
  });

  if (isLoading) return <LoadingPage />;

  if (!data) return <div>404</div>;

  // return empty div if user isn't loaded yet
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <ProfilePageLayout username={username} />
        <ProfileFeed userId={data.id} />
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

export default ProfilePage;
