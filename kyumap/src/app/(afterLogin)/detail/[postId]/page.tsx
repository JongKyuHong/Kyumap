import Home from "../../home/page";
import Detail from "../../@modal/(.)detail/[postId]/page";

type Props = {
  params: {
    postId: string;
  };
};

export default function Page({ params }: Props) {
  return (
    <>
      <Home />
      <Detail params={params} />
    </>
  );
}
