import { Metadata } from "next";
import Edit from "./_component/Edit";

export const metadata: Metadata = {
  title: "프로필 편집",
  description: "프로필 편집 화면입니다.",
};

export default function Page() {
  return <Edit />;
}
