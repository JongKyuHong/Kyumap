import DetailPage from "../../@modal/(.)detail/[postId]/_component/DetailPage";
import Home from "../../home/page";
import { auth } from "@/auth";

type Props = {
  params: {
    postId: string;
  };
};

export default async function Page({ params }: Props) {
  const session = await auth();
  console.log("설마 여기 들리지는 않지?");
  return (
    <>
      <Home />
      <DetailPage postId={params.postId} />
    </>
  );
}
