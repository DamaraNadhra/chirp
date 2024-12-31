import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { api } from "~/utils/api";

import { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { PostView } from "~/components/postview";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";


import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Link from "next/link";


dayjs.extend(relativeTime)
const ProfileFeed = (props: { userId: string}) => {
  const { data, isLoading } = api.posts.getPostByUserId.useQuery({ userId: props.userId });

  if (isLoading) return <div>Loading...</div>

  if (!data || data.length == 0) return <div>User has not posted anything</div>;

  return (
    <div className="flex flex-col"> 
      {data.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  )  
}

const ProfilePage: NextPage<{ username: string }> = ({ username })  => {
  const { data, isLoading } = api.profiles.getUserByUsername.useQuery({ username })

  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>404</div>

  const unsafeMetadata = data.unsafeMetadata as { description: string };

  // return empty div if user isn't loaded yet
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-48 bg-customGray">
          <Image 
            src={data.imageUrl} 
            alt={`${data.username ?? ""}'s profile picture`} 
            width={136} 
            height={136}
            className="-mb-[64px] rounded-full border-4 border-black absolute bottom-0 left-0 ml-4" />
        </div>
        <div className="h-[64px]"></div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-0 pl-4">
            <div className="pt-4 pb-2 text-xl font-bold">
              {data.username}</div>
            <div className="text-customGray -mt-2">{`@${data.username}`}</div>
            <div className="font-segoe mt-2">{unsafeMetadata.description}</div>
            <div className="flex mt-2 text-[1.0625rem] gap-1">
                <svg 
                viewBox="0 0 24 24" 
                aria-hidden="true" 
                className="fill-current text-customGray w-6 h-6"
                >
                <g>
                    <path 
                    d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z" 
                    />
                </g>
                </svg>
                <span className="text-customGray">{`Joined ${dayjs(data.createdAt).format("MMMM YYYY")}`}</span>

            </div>
            <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z"></path>
            <div></div>
          </div>
          <div className="-mt-8">
            <Link href={`/@${data.username}/edit-profile`}>
            <button className="text-black-200 mr-4 bg-transparent hover:bg-slate-200 hover:bg-opacity-15 rounded-full border-[1px] border-slate px-4 py-2 font-semibold ">Edit profile</button>
            </Link>
          </div>
          
        </div>

        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {

  const ssg = generateSSGHelper();
  const slug = context.params?.slug;
  if (typeof slug !== 'string') throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profiles.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking"};
}

export default ProfilePage