import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { api } from "~/utils/api";

import { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { TRPCError } from "@trpc/server";
import { PropsWithChildren } from "react";
import { useRouter } from "next/router";
import { ProfilePageLayout } from "~/components/profileLayout";

dayjs.extend(relativeTime);

interface ProfileButtonProps {
  link: string;
  size?: number;
  children?: React.ReactNode;
}

const ProfileButtons: React.FC<ProfileButtonProps> = ({ link, size, children}) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;



  return (
    <div className="flex flex-col flex-grow">
      <span className={`pt-5 pb-3 hover:bg-white hover:bg-opacity-10 cursor-pointer ${isActive(link) ? "text-white" : "text-customGray"}`}>{children}</span>
      <div className="flex flex-row justify-center">
        {isActive(link) && <div className={`bg-[#1d9bf0] rounded-full py-[2px]`} style={{ width: size || '9rem'}}></div>}
      </div>
    </div>
  )
}

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

  const unsafeMetadata = data.unsafeMetadata as { description: string, followers: number, following: number };

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
