import Home from "../../home/page";
import Detail from "../../@modal/(.)detail/[postId]/page";

type Props = {
  params: {
    postId: string;
  };
};

export default function Page({ params }: Props) {
  // console.log("Detail");
  // const router = useRouter();
  // router.replace("/detail/newPage");
  return (
    <>
      <Home />
      <Detail params={params} />
    </>
  );
}
