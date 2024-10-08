import UserPosts from "./_component/UserPosts";
import { getUserEmail } from "../../_lib/getUserEmail";
import { Metadata } from "next";

type Props = {
  params: {
    userName: string;
  };
};

// 동적 메타 데이터 설정
export async function generateMetadata({ params }: Props) {
  const userEmail = await getUserEmail(params.userName);
  return {
    title: `${params.userName}(@${userEmail}) / Kyumap 사진 및 동영상`,
    description: `${params.userName}님의 Kyumap 프로필에서 사진과 동영상을 확인하세요.`,
    openGraph: {
      title: `${params.userName}(@${userEmail}) / Kyumap 사진 및 동영상`,
      description: `${params.userName}님의 Kyumap 프로필에서 사진과 동영상을 확인하세요.`,
      images: [
        {
          url: "/smallLogo2.png",
          alt: "Kyumap",
        },
      ],
    },
  };
}

export default async function page({ params }: Props) {
  const { userName } = params;
  const userEmail = await getUserEmail(userName);

  return <UserPosts userEmail={userEmail} />;
}
