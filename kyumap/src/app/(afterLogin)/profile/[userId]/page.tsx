import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import RQProvider from "@/app/(afterLogin)/_component/RQProvider";
import chi from "../../../../../public/chi.png";
import ProfileSection from "./_component/ProfileSection";

type Props = {
  params: {
    userId: string;
  };
};

export default async function page({ params }: Props) {
  const { userId } = params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["user", userId],
    queryFn: getUser,
  });

  await queryClient.prefetchQuery({
    queryKey: ["user", userId, "posts"],
    queryFn: getUserPosts,
  });

  const dehydrateState = dehydrate(queryClient);

  // for (let i = 0; i < dummyData2.length; i += chunkSize) {
  //   dummyData.push(dummyData2.slice(i, i + chunkSize));
  // }

  return (
    <div>
      <HydrationBoundary state={dehydrateState}>
        <ProfileSection userId={userId} />
      </HydrationBoundary>
    </div>
  );
}
