import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ReelPost from "./_component/ReelPost";
import { getPost } from "../../_lib/getPost";

type Props = {
  params: {
    postId: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const post = await getPost({ queryKey: ["posts", params.postId] });
  return {
    title: `${post.title}(@${post.userNickname}) / Kyumap 사진 및 동영상`,
    description: `${post.content.slice(0, 100)}...`,
    openGraph: {
      title: `${post.title}(@${post.userNickname}) / Kyumap 사진 및 동영상`,
      description: `${post.content.slice(0, 100)}...`,
      images: [
        {
          url: post.Images[0],
          alt: `${post.userNickname}님의 게시물`,
        },
      ],
    },
  };
}

export default async function Page({ params }: Props) {
  return <ReelPost postId={params.postId} />;
}
