"use client";

import { useEffect } from "react";
import Home from "../page";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home");
  }, []);

  return null;
}
