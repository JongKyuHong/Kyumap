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
    userEmail: string;
  };
};

export default async function Profile({ params }: Props) {
  const { userEmail } = params;
  console.log("profile params : ", params);
  console.log("profile userEmail : ", userEmail);
  const decodeEmail = decodeURIComponent(userEmail);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users", decodeEmail],
    queryFn: getUser,
  });

  await queryClient.prefetchQuery({
    queryKey: ["user", decodeEmail, "posts"],
    queryFn: getUserPosts,
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydrateState}>
        <ProfileSection userEmail={decodeEmail} />
        {/* <UserPosts userEmail={decodeEmail} /> */}
      </HydrationBoundary>
    </div>
  );
}
