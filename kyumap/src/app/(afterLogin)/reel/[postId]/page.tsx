import ReelPost from "./_component/ReelPost";

type Props = {
  params: {
    postId: string;
  };
};

export default function Page({ params }: Props) {
  return <ReelPost postId={params.postId} />;
}
