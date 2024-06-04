import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Comment from "@/model/Comment";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  console.log(postId, "comment 하기전 postId 정상?");
  const allComments = await Comment.find({ postId: postId });
  console.log(allComments, "comment 전체  data");
  return NextResponse.json(allComments);
}

export async function POST(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  const data = await req.json();
  console.log(data, "comment data");

  const inputData = {
    postId: postId,
    User: {
      nickname: data.User.name,
      email: data.User.email,
      image: data.User.image,
    },
    content: data.comment,
  };

  const comment = await Comment.create(inputData);

  return NextResponse.json(comment);
}
