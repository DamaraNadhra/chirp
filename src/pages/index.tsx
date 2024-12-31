import { SignedIn, SignedOut, SignIn, SignInButton, SignOutButton, SignUpButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import chirpLogo from "src/images/chirpLogo.png"

import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

dayjs.extend(relativeTime)

const CreatePostWizard = () => {
  const {user} =  useUser();

  const ctx = api.useUtils();

  const { mutate: createPost, isPending: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (Array.isArray(errorMessage) && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Something went wrong while creating the post");
      }
    }
  });

  const [input, setInput] = useState<string>("");

  if (!user) return null;

  return <div className="flex justify-between w-full flex-row gap-3">
    <div className="flex flex-row gap-3">
    <Image 
      src={user.imageUrl} 
      alt="Profile Image" 
      className="rounded-full w-14 h-14" 
      width={56} 
      height={56} /> 
    <input 
      placeholder="Type something!" 
      className="bg-transparent outline-none grow"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      disabled={isPosting}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input !== "") {
            createPost({ content: input });
          }
        }
      }}
      />
    </div>
    {input !== "" && !isPosting && (
      <button className="" onClick={() => createPost({ content: input })} disabled={isPosting}>Post</button>
      )}
    {isPosting && (
      <div className="flex justify-center items-center">
        <LoadingSpinner size={25}/>
      </div>
      )}
  </div>
}

const Feed = () => {
  const { data: postsData, isSuccess, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!postsData) return <div>Something went wrong</div>

  return (
  <div className="flex flex-col">
    {postsData?.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id} />))}
  </div>
  )
}

export default function Home() {
  const { isLoaded: userLoaded } = useUser();

  api.posts.getAll.useQuery();
  // return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;
  return (
    <>
    <SignedOut>
        <div className="flex flex-row gap-14">
          <Image src={chirpLogo} alt="chirp Logo" width={600} height={96}/>
          <div className="flex flex-col gap-4">
            <div className="h-48"></div>
          <span className="inline-block font-segoe  scale-x-125 font-extrabold text-4xl">Hear the bird Chirps!</span>
          <div className="justify-center mt-6 text-xl font-extrabold scale-x-125">Join today.</div>
          <div className="-ml-12">
            <SignUpButton>
              <button className="bg-twitterBlue rounded-full text-sm font-semibold px-16 text-slate-200 py-2 hover:bg-opacity-95">Create account</button>
            </SignUpButton>
          </div>
          <span className="font-semibold -ml-12">Already have an account?</span>
          <div className="-ml-12">
            <SignInButton>
              <button className="rounded-full text-twitterBlue text-sm border-customGray hover:bg-white hover:bg-opacity-5 border-[1px] px-24 py-2">Sign in</button>
            </SignInButton>
          </div>
          </div>
        </div>
    </SignedOut>
    <SignedIn>
    <PageLayout>
      
      <div className="flex border-b border-slate-600 p-4">
        <div className="flex justify-center w-full">
            <CreatePostWizard />
        </div>
        </div>
        <Feed />
        <SignOutButton />
    
      </PageLayout>
      </SignedIn>
      </>
  );
}
