"use client";

import NavTab from "./NavTab";
import { auth } from "@/auth";
import BeforeLoginNav from "./BeforeLoginNav";
import { useSession } from "next-auth/react";
import LoadingComponent from "@/app/_component/LoadingComponent";

export default function Nav({ session }: any) {
  // const { data: session } = useSession();

  // if (status === "loading") {
  //   return <LoadingComponent />;
  // }

  // return session ? <NavTab session={session} /> : <BeforeLoginNav />;
  return <NavTab session={session} />;
}
