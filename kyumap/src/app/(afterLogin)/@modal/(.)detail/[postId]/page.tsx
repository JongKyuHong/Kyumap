import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getComments } from "@/app/(afterLogin)/_lib/getComments";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";
import DetailPage from "./_component/DetailPage";

type Props = {
  params: {
    postId: string;
  };
};

export default async function page({ params }: Props) {
  const { postId } = params;
  // const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ["posts", postId, "comments"],
  //   queryFn: getComments,
  // });

  // await queryClient.prefetchQuery({
  //   queryKey: ["posts", postId],
  //   queryFn: getPost,
  // });

  // const dehydrateState = dehydrate(queryClient);
  // <HydrationBoundary state={dehydrateState}></HydrationBoundary>
  return <DetailPage postId={postId} />;
}
