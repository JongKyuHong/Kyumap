"use client";

import { useRouter } from "next/navigation";
import Home from "../../home/page";
import Detail from "../../@modal/(.)detail/[postId]/page";

export default function Page() {
  // console.log("Detail");
  // const router = useRouter();
  // router.replace("/detail/newPage");
  return (
    <>
      <Home />
      <Detail />
    </>
  );
}
