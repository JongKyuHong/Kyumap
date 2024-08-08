import DetailPage from "../../@modal/(.)detail/[postId]/_component/DetailPage";
import Home from "../../home/page";
import { auth } from "@/auth";

type Props = {
  params: {
    postId: string;
  };
};

export default async function Page({ params }: Props) {
  return (
    <>
      <Home />
      <DetailPage postId={params.postId} />
    </>
  );
}
