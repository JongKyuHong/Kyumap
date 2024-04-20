import React from "react";
import { auth } from "@/auth";
import MainSection from "../_component/MainSection";
import FollowRecommendSection from "../_component/FollowRecommendSection";

export default async function Home() {
  const session = await auth();
  return (
    <>
      <MainSection />
      <FollowRecommendSection me={session} />
    </>
  );
}
