import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  console.log("hi");
  return NextResponse.json("hi");
}
