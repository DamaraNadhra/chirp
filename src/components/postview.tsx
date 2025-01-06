import Link from "next/link";

import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  function formatRelativeTimeShort(time: string) {
    const relativeTime = dayjs().to(dayjs(time), true); // Get relative time (e.g., "30 minutes")
    
    // Map long relative times to shorter versions
    const shortFormats: Record<string, string> = {
      minute: "m",
      minutes: "m",
      hour: "h",
      hours: "h",
      day: "d",
      days: "d",
      month: "mo",
      months: "mo",
      year: "y",
      years: "y",
      second: "s",
      seconds: "s",
    };
  
    // Replace long units with short ones
    return relativeTime
      .split(" ")
      .map((word) => shortFormats[word] ?? word)
      .join("");
  }
  return (
    <div
      key={post.authorId}
      className="flex gap-3 border-b border-x border-gray-700 p-4"
    >
      <Image
        alt={`@${author.username}`}
        src={author.imageUrl}
        className="h-9 w-9 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col font-segoe">
        <div className="flex flex-row gap-1 text-xs text-gray-500">
          <span className="text-slate-200 font-bold">{author.username}</span>
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-[15px] ">{post.content}</span>
      </div>
    </div>
  );
};
