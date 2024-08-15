import React from "react";
import ReelsParent from "./_component/ReelsParent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kyumap - 인기 맛집 릴스",
  description: "친구들과 공유하고 싶은 인기 맛집 릴스를 Kyumap에서 확인하세요.",
  metadataBase: new URL("https://kyumap.vercel.app"),
  openGraph: {
    title: "Kyumap - 인기 맛집 릴스",
    description:
      "친구들과 공유하고 싶은 인기 맛집 릴스를 Kyumap에서 확인하세요.",
    images: [
      {
        url: "/smallLogo2.png",
        alt: "Kyumap 릴스 페이지 썸네일",
      },
    ],
  },
};

export default async function Page() {
  return <ReelsParent />;
}
