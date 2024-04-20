import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import ProfileSection from "./_component/ProfileSection";
import UserPosts from "./_component/UserPosts";

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

  return (
    <div>
      <HydrationBoundary state={dehydrateState}>
        <ProfileSection userId={userId} />
        {/* <UserPosts userId={userId} /> */}
      </HydrationBoundary>
    </div>
  );
}
