import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ReelPost from "./_component/ReelPost";
import { getPost } from "../../_lib/getPost";
import { getUser } from "../../_lib/getUser";
import { IPost } from "@/model/Post";

type Props = {
  params: {
    postId: string;
  };
};

// 동적 메타데이터
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

// ssr설정
export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", params.postId],
    queryFn: getPost,
  });

  const post = queryClient.getQueryData<IPost>(["posts", params.postId]);

  await queryClient.prefetchQuery({
    queryKey: ["users", post?.userEmail as string],
    queryFn: getUser,
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <ReelPost postId={params.postId} />
    </HydrationBoundary>
  );
}
