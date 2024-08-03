import React from "react";
import MainSection from "../_component/MainSection";
import styles from "../layout.module.css";
import FollowRecommendSection from "../_component/FollowRecommendSection";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈 / Kyumap",
  description: "홈",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className={styles.mainrootDiv}>
      <MainSection session={session} />
      <FollowRecommendSection session={session} />
    </div>
  );
}
