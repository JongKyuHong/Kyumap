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

type Props = {
  params: {
    userName: string;
  };
};

export default async function page({ params }: Props) {
  const { userName } = params;
  const userEmail = await getUserEmail(userName);

  return <UserPosts userEmail={userEmail} />;
}
