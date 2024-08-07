import React from "react";
import MainSection from "../_component/MainSection";
import styles from "../layout.module.css";
import FollowRecommendSection from "../_component/FollowRecommendSection";
import { auth } from "@/auth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kyumap - 나만의 맛집 지도",
  description: "Kyumap에서 나만의 맛집들을 친구들에게 소개해보세요.",
  openGraph: {
    title: "Kyumap - 나만의 맛집 지도",
    description: "Kyumap에서 나만의 맛집들을 친구들에게 소개해보세요.",
    images: [
      {
        url: "/smallLogo2.png",
        alt: "Kyumap 홈 화면",
      },
    ],
  },
};

export default async function Home() {
  // const session = await auth();

  return (
    <div className={styles.mainrootDiv}>
      <MainSection />
      <FollowRecommendSection />
    </div>
  );
}
