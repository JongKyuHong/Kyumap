"use client";

import { useRouter } from "next/navigation";
import Home from "../home/page";

export default function Page() {
  console.log("Detail");
  const router = useRouter();
  router.replace("/detail");
  return <Home />;
}
