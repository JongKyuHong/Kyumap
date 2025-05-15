import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import { auth } from "@/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const post = await Post.findOne({ postId: Number(params.postId) });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userEmail !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    post.hideComments = !post.hideComments;
    await post.save();

    return NextResponse.json({
      success: true,
      hideComments: post.hideComments,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
