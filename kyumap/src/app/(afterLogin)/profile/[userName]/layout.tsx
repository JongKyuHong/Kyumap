import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import ProfileSection from "./_component/ProfileSection";
import UserPosts from "./_component/UserPosts";
import { getUserEmail } from "../../_lib/getUserEmail";
import { IPost } from "../../../../model/Post";
import styles from "./profile.module.css";

export default async function ProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userName: string };
}) {
  const { userName } = params;
  const userEmail = await getUserEmail(userName);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["users", userEmail],
    queryFn: getUser,
  });

  await queryClient.prefetchInfiniteQuery<
    IPost[],
    Error,
    IPost[],
    [string, string, string],
    number
  >({
    queryKey: ["user", userEmail, "posts"],
    queryFn: getUserPosts,
    initialPageParam: 0,
  });

  const dehydrateState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydrateState}>
      <div className={styles.MainDiv}>
        <ProfileSection userEmail={userEmail} userName={userName} />
        {children}
      </div>
    </HydrationBoundary>
  );
}
