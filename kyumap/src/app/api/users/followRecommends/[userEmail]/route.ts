import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();

    const user = await User.find({ email: { $ne: params.userEmail } })
      .sort({ "_count.Followers": -1 })
      .limit(5)
      .exec();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
