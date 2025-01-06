import Head from "next/head";
import { api } from "~/utils/api";

import {  NextPage } from "next";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { LoadingPage } from "~/components/loading";
import { useRouter } from "next/router";

dayjs.extend(relativeTime);

interface ProfileButtonProps {
  link: string;
  size?: number;
  children?: React.ReactNode;
}

const ProfileButtons: React.FC<ProfileButtonProps> = ({ link, size, children}) => {
  const router = useRouter();
  const isActive = (path: string) => {
    const { slug } = router.query;

    if (typeof slug !== "string") throw new Error("no slug");
    if (path === router.asPath) return true;
    return false;
  }


  return (
    <Link href={link} className="flex flex-col flex-grow">
      <span className={`pt-5 pb-3 hover:bg-white hover:bg-opacity-10 ${isActive(link) ? "text-white" : "text-customGray"}`}>{children}</span>
      <div className="flex flex-row justify-center">
        {isActive(link) && <div className={`bg-[#1d9bf0] rounded-full py-[2px]`} style={{ width: size || '9rem'}}></div>}
      </div>
    </Link>
  )
}
interface ProfilePageProps {
    username: string;
    children?: React.ReactNode;
}

export const ProfilePageLayout: NextPage<{ username: string }> = ({
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
        <div className="border-x border-b border-gray-700">
        <div className="relative h-48 bg-customGray">
          <Image
            src={data.imageUrl}
            alt={`${data.username ?? ""}'s profile picture`}
            width={120}
            height={120}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-0 pl-4">
            <div className="pb-2 pt-4 text-base font-extrabold">{data.username}</div>
            <div className="-mt-3 text-sm text-customGray">{`@${data.username}`}</div>
            <div className="mt-2 font-segoe text-sm">{unsafeMetadata.description}</div>
            <div className="mt-2 flex gap-1 text-[1.0625rem]">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-4 fill-current text-customGray mt-[2px]"
              >
                <g>
                  <path d="M7 4V3h2v1h6V3h2v1h1.5C19.89 4 21 5.12 21 6.5v12c0 1.38-1.11 2.5-2.5 2.5h-13C4.12 21 3 19.88 3 18.5v-12C3 5.12 4.12 4 5.5 4H7zm0 2H5.5c-.27 0-.5.22-.5.5v12c0 .28.23.5.5.5h13c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5H17v1h-2V6H9v1H7V6zm0 6h2v-2H7v2zm0 4h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm4-4h2v-2h-2v2z" />
                </g>
              </svg>
              <span className="text-customGray text-[13px]">{`Joined ${dayjs(data.createdAt).format("MMMM YYYY")}`}</span>
            </div>
            
            <div className="flex flex-row text-[13px] gap-3 my-2">
              <div className="flex flex-row gap-2">
                <span className="font-semibold">{unsafeMetadata.following ?? 0}</span>
                <span className="text-customGray">Following</span>
              </div>
              <div className="flex flex-row gap-2">
                <span className="font-semibold">{unsafeMetadata.followers ?? 0}</span>
                <span className="text-customGray">Followers</span>
              </div>
            </div>
          </div>
          <div className="-mt-8">
            <Link href={`/@${data.username}/edit-profile`}>
              <button className="text-black-200 border-slate -mt-2 mr-4 text-[13px] rounded-full border-[1px] bg-transparent px-4 py-2 font-semibold hover:bg-slate-200 hover:bg-opacity-15">
                Edit profile
              </button>
            </Link>
          </div>
        </div>
        <div className="flex flex-row text-[13px] font-semibold justify-between text-center">
              <ProfileButtons link={`/@${username}`} size={40}>
                Posts
              </ProfileButtons>
              <ProfileButtons link={`/@${username}/highlights`} size={80}>
                Highlights
              </ProfileButtons>
              <ProfileButtons link={`/@${username}/replies`} size={60}>
                Replies
              </ProfileButtons>
              <ProfileButtons link={`/@${username}/orgs`} size={90}>
                Organizations
              </ProfileButtons>

            </div>
        </div>
    </>
  );
};

