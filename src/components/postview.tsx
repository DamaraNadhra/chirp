import Link from "next/link";

import { api, RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import Image from "next/image";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.authorId}  className="flex gap-3 p-4 border-b border-x border-slate-600">
      <Image alt={`@${author.username}`} src={author.imageUrl} className="rounded-full h-14 w-14" width={56} height={56} />
      <div className="flex flex-col font-segoe">
        <div className="flex gap-1 text-gray-500">
          <Link href={`/@${author.username}`}>
            <span>{`@${author.username} `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span>{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  )
}