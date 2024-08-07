"use client";

import NavTab from "./NavTab";
import { auth } from "@/auth";
import BeforeLoginNav from "./BeforeLoginNav";
import { useSession } from "next-auth/react";

export default function Nav() {
  // const session = await auth();
  const { data: session } = useSession();
  // if (!session) return <BeforeLoginNav />;

  return session ? <NavTab session={session} /> : <BeforeLoginNav />;
}
