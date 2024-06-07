import React from "react";
import MainSection from "../_component/MainSection";
import FollowRecommendSection from "../_component/FollowRecommendSection";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";

export default async function Home() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <MainSection />
      <FollowRecommendSection />
    </HydrationBoundary>
  );
}
