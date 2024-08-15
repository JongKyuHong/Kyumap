import DetailPage from "../../@modal/(.)detail/[postId]/_component/DetailPage";
import { getPost } from "../../_lib/getPost";
import Home from "../../home/page";

type Props = {
  params: {
    postId: string;
  };
};

// 게시글 정보에 따라 동적으로 메타데이터 설정
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
  return (
    <>
      <Home />
      <DetailPage postId={params.postId} />
    </>
  );
}
