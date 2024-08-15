import DetailPage from "./_component/DetailPage";

type Props = {
  params: {
    postId: string;
  };
};

export default async function page({ params }: Props) {
  const { postId } = params;

  return <DetailPage postId={postId} />;
}
