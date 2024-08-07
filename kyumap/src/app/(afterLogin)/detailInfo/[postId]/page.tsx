import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ReelPost from "./_component/ReelPost";
import { getComments } from "../../_lib/getComments";
import { getPost } from "../../_lib/getPost";

type Props = {
  params: {
    postId: string;
  };
};

export default async function Page({ params }: Props) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts", params.postId.toString()],
    queryFn: getPost,
  });

  const dehydrateState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <ReelPost postId={params.postId} />
    </HydrationBoundary>
  );
}
