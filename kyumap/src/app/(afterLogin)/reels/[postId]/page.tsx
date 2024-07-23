"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  console.log("hi");
  useEffect(() => {
    router.replace("/reels");
  }, []);
  return null;
}
