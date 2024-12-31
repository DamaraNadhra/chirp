import Head from "next/head";
import { useState } from "react";


import { api } from "~/utils/api";

import { GetStaticProps, NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import BackButton from "~/components/backbutton";
import Link from "next/link";


const EditProfilePage: NextPage<{ username: string }> = ({ username })  => {
    const [newUsername, setNewUsername] = useState<string>("");
    const [newDescription, setDescription] = useState<string>("");
    const { data: userData, isLoading } = api.profiles.getUserByUsername.useQuery({ username })

    if (!userData || isLoading) return <div>Loading...</div>

    const { mutate: changeUsername } = api.profiles.changeUsername.useMutation();

    const { mutate: changeDesc } = api.profiles.changeDescription.useMutation();
  return (
    <>
      <Head>
        <title>Edit Profile </title>
      </Head>
      <PageLayout>
        <div className="flex flex-row w-full justify-between relative">
            <div className="flex flex-row gap-7">
                <BackButton />
                <span className="mt-3 font-[650] text-[1.5rem] font-segoe">Edit profile</span>
            </div>
            <div className="absolute bottom-0 right-0 top-3">
                <Link href={`/@${newUsername ?? userData.username}`}>
                <button 
                className="flex rounded-full bg-white hover:bg-gray-100 hover:bg-opacity-95 border-none mr-6 border-2 px-5 py-2 text-black font-semibold "
                onClick={() => {
                    if (newUsername !== "") {
                        changeUsername({ username: newUsername, userId: userData.id });
                    }
                    if (newDescription !== "") {
                        changeDesc({ description: newDescription, userId: userData.id})
                    }
                }}
                >Save</button>
                </Link>
            </div>
        </div>
        <div className="relative h-48">
        <Image 
        src={userData.imageUrl} 
        className="rounded-full absolute ml-4 bottom-0 -mb-12"
        alt={`@${userData.username}'s profile picture`}
        width={120}
        height={120}
        />
        </div>
        <div className="h-12"></div>
        <div className="m-4 relative w-[626px]">
        <input
            type="text"
            id="name"
            className="peer h-20 w-full border border-customGray bg-transparent px-4 pt-5 pb-2 rounded-md focus:outline-none focus:ring-twitterBlue focus:ring-[1.5px]"
            placeholder=" "
            onChange={(e) => setNewUsername(e.target.value)}
             />
        <label
            htmlFor="name"
            className="absolute left-4 text-sm top-2 text-gray-500 transition-all peer-placeholder-shown:text peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue">
            Name
        </label>
        </div>
        <div className="mt-8 ml-4 relative w-[626px]">
        <input
            type="text"
            id="name"
            className="peer h-20 w-full border border-customGray bg-transparent px-4 pt-5 pb-2 rounded-md focus:outline-none focus:ring focus:ring-twitterBlue focus:ring-[1.5px]"
            placeholder=" "
            onChange={(e) => setDescription(e.target.value)}
             />
        <label
            htmlFor="name"
            className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:text peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-sm peer-focus:text-twitterBlue">
            Description
        </label>
        </div>
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

export default EditProfilePage