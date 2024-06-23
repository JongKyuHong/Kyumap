import React from "react";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getRandomReels } from "../_lib/getRandomReels";
import ReelsParent from "./_component/ReelsParent";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "reels"],
    queryFn: getRandomReels,
    initialPageParam: 0,
  });

  const dehydrateState = dehydrate(queryClient);
  return (
    // <HydrationBoundary state={dehydrateState}></HydrationBoundary>
    <ReelsParent />
  );
}
