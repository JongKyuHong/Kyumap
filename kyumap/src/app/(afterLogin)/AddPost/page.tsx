import { Metadata } from "next";
import NewPost from "../@modal/(.)AddPost/_component/NewPost";
import Home from "../home/page";

export const metadata: Metadata = {
  title: "Kyumap - 나만의 맛집을 소개해보세요!",
  description: "Kyumap에서 나만의 맛집들을 소개해보세요.",
};

export default function page() {
  return (
    <>
      <Home />
      <NewPost />
    </>
  );
}
