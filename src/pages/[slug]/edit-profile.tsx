import Head from "next/head";
import { useState } from "react";

import { api } from "~/utils/api";

import type { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import BackButton from "~/components/backbutton";
import Link from "next/link";

const EditProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const [newUsername, setNewUsername] = useState<string>("");
  const [newDescription, setDescription] = useState<string>("");
  const [newFollowing, setFollowing] = useState<number>(0);
  const [newFollowers, setFollowers] = useState<number>(0);
  const { data: userData, isLoading } = api.profiles.getUserByUsername.useQuery(
    { username },
  );

  if (!userData || isLoading) return <div>Loading...</div>;

  const { mutate: changeUsername } = api.profiles.changeUsername.useMutation();

  const { mutate: changeDesc } = api.profiles.changeDescription.useMutation();

  const { mutate: updateFollowers } = api.profiles.updateFollowers.useMutation();

  const { mutate: updateFollowing } = api.profiles.updateFollowing.useMutation();
  return (
    <>
      <Head>
        <title>Edit Profile </title>
      </Head>
      <PageLayout>
        <div className="relative flex w-full flex-row justify-between">
          <div className="flex flex-row gap-7">
            <BackButton />
            <span className="mt-3 font-segoe text-[1.5rem] font-[650]">
              Edit profile
            </span>
          </div>
          <div className="absolute bottom-0 right-0 top-3">
            <Link href={`/@${newUsername !== "" ? newUsername : userData.username}`}>
              <button
                className="mr-6 flex rounded-full border-2 border-none bg-white px-5 py-2 font-semibold text-black hover:bg-gray-100 hover:bg-opacity-95"
                onClick={() => {
                  console.log(userData.username)
                  if (newUsername !== "") {
                    changeUsername({
                      username: newUsername,
                      userId: userData.id,
                    });
                  }
                  if (newDescription !== "") {
                    changeDesc({
                      description: newDescription,
                      userId: userData.id,
                    });
                  }

                  if (newFollowers !== 0) {
                    updateFollowers({
                      newAmount: newFollowers,
                      userId: userData.id
                    })
                  }
                  if (newFollowing !== 0) {
                    updateFollowing({
                      newAmount: newFollowing,
                      userId: userData.id
                    })
                  }
                }}
              >
                Save
              </button>
            </Link>
          </div>
        </div>
        <div className="relative h-48">
          <Image
            src={userData.imageUrl}
            className="absolute bottom-0 -mb-12 ml-4 rounded-full"
            alt={`@${userData.username}'s profile picture`}
            width={120}
            height={120}
          />
        </div>
        <div className="h-12"></div>
        <div className="relative m-4">
          <input
            type="text"
            id="name"
            className="peer h-20 w-full rounded-md border border-customGray bg-transparent px-4 pb-2 pt-5 focus:outline-none focus:ring-[1.5px] focus:ring-twitterBlue"
            placeholder=" "
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <label
            htmlFor="name"
            className="peer-placeholder-shown:text absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue"
          >
            Name
          </label>
        </div>
        <div className="relative ml-4 mt-8 w-[95%]">
          <input
            type="text"
            id="description"
            className="peer h-20 w-full rounded-md border border-customGray bg-transparent px-4 pb-2 pt-5 focus:outline-none  focus:ring-[1.5px] focus:ring-twitterBlue"
            placeholder=""
            onChange={(e) => setDescription(e.target.value)}
          />
          <label
            htmlFor="description"
            className="peer-placeholder-shown:text absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue"
          >
            Description
          </label>
        </div>
        <div className="flex flex-row mt-8 justify-between">
          <div className="ml-4 relative">
          <input
            type="text"
            id="following"
            className="peer h-20 w-full rounded-md border border-customGray bg-transparent px-4 pb-2 pt-5 focus:outline-none focus:ring focus:ring-[1.5px] focus:ring-twitterBlue"
            placeholder=" "
            onChange={(e) => setFollowing(parseInt(e.target.value))}
          />
          <label
            htmlFor="following"
            className="peer-placeholder-shown:text absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue"
          >
            Following
          </label>
          </div>
          <div className="mr-4 relative w-1/2">
          <input
            type="text"
            id="followers"
            className="peer h-20 w-full rounded-md border border-customGray bg-transparent px-4 pb-2 pt-5 focus:outline-none focus:ring focus:ring-[1.5px] focus:ring-twitterBlue"
            placeholder=" "
            onChange={(e) => setFollowers(parseInt(e.target.value))}
          />
          <label
            htmlFor="followers"
            className="peer-placeholder-shown:text absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue"
          >
            Followers
          </label>
          </div>
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
