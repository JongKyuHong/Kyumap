import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function middleware() {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect("http://localhost:80/i/flow/login");
  }
}

export const config = {
  matcher: ["/home"],
};
