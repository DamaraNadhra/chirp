import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import chirpLogo from "src/images/chirpLogo.png";

import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useUtils();

  const { mutate: createPost, isPending: isPosting } =
    api.posts.create.useMutation({
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
      },
    });

  const [input, setInput] = useState<string>("");

  if (!user) return null;

  return (
    <div className="flex w-full flex-row justify-between gap-3">
      <div className="flex flex-row gap-3">
        <Image
          src={user.imageUrl}
          alt="Profile Image"
          className="h-9 w-9 rounded-full"
          width={56}
          height={56}
        />
        <input
          id="inputWizard"
          placeholder="What is happening?!"
          className="grow bg-transparent outline-none placeholder-customGray"
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
      {!isPosting && (
        <div className="mt-3">
        <button
          id="submitButton"
          className={`text-[13px] font-semibold bg-white text-black rounded-full px-3 py-[6px] ${input.trim() ? "hover:bg-opacity-95" : "pointer-events-none disabled:bg-opacity-50"}`}
          onClick={() => createPost({ content: input })}
          disabled={!input.trim()}
        >
          Post
        </button>
        </div>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={25} />
        </div>
      )}
    </div>
  );
};

const Feed = () => {
  const {
    data: postsData,
    isLoading: postsLoading,
  } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!postsData) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {postsData?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded } = useUser();

  api.posts.getAll.useQuery();
  // return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;
  return (
    <>
      <SignedOut>
        <div className="flex flex-row gap-14">
          <Image src={chirpLogo} alt="chirp Logo" width={600} height={96} />
          <div className="flex flex-col gap-4">
            <div className="h-48"></div>
            <span className="inline-block scale-x-125 font-segoe text-4xl font-extrabold">
              Hear the bird Chirps!
            </span>
            <div className="mt-6 scale-x-125 justify-center text-xl font-extrabold">
              Join today.
            </div>
            <div className="-ml-12">
              <SignUpButton>
                <button className="rounded-full bg-twitterBlue px-16 py-2 text-sm font-semibold text-slate-200 hover:bg-opacity-95">
                  Create account
                </button>
              </SignUpButton>
            </div>
            <span className="-ml-12 font-semibold">
              Already have an account?
            </span>
            <div className="-ml-12">
              <SignInButton>
                <button className="rounded-full border-[1px] border-customGray px-24 py-2 text-sm text-twitterBlue hover:bg-white hover:bg-opacity-5">
                  Sign in
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <PageLayout>
          <div className="flex border-b border-x border-gray-700 p-4">
            <div className="flex w-full justify-center">
              <CreatePostWizard />
            </div>
          </div>
          <Feed />
        </PageLayout>
      </SignedIn>
    </>
  );
}
