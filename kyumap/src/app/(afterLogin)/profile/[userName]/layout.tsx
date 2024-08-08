import React from "react";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import ProfileSection from "./_component/ProfileSection";
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

  return (
    <div className={styles.MainDiv}>
      <ProfileSection userEmail={userEmail} userName={userName} />
      {children}
    </div>
  );
}
