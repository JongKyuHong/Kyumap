"use client";

import React, { useEffect } from "react";
import styles from "../../profile.module.css";
import Link from "next/link";
import {
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from "@tanstack/react-query";
import { IPost } from "@/model/Post";
import { getUserSavedPosts } from "@/app/(afterLogin)/_lib/getUserSavedPosts";
import { useInView } from "react-intersection-observer";
import { useRouter, redirect } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Props = {
  userEmail: string;
  userName: string;
};

export default function Saved({ userEmail, userName }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") {
      return; // 세션 상태를 로딩 중인 경우 효과 실행 중지
    }

    if (!session) {
      router.push("/login"); // 로그인 페이지로 리다이렉트
    } else if (session && session!.user!.email !== userEmail) {
      redirect(`/profile/${userName}`);
    }
  }, [status, session, userEmail, router, userName]);

  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery<
      IPost[],
      Object,
      InfiniteData<IPost[]>,
      [_1: string, string, _3: string],
      number
    >({
      queryKey: ["user", userEmail, "saveposts"],
      initialPageParam: 0,
      queryFn: getUserSavedPosts,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
      staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
      gcTime: 300 * 1000,
    });

  const user = queryClient.getQueryData(["users", userEmail]);

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  const chunkSize = 3;
  const UserPost = [];

  // if (status === "loading") return; // 세션 상태를 로딩 중인 경우 대기
  // if (!session) {
  //   router.push("/login"); // 로그인 페이지로 리다이렉트
  // } else if (session && session!.user!.email !== userEmail) {
  //   // router.push(`/profile/${userName}`);
  //   redirect(`/profile/${userName}`);
  // }

  if (data && data.pages) {
    const platData = data.pages.flat();
    for (let i = 0; i < platData.length; i += chunkSize) {
      UserPost.push(platData.slice(i, i + chunkSize));
    }
  }

  const showPostForm = () => {
    router.push(`/AddPost`);
  };

  if (!user) return null;

  return (
    <>
      {UserPost.length > 0 ? (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingBottom: "0px",
              paddingTop: "0px",
              position: "relative",
            }}
          >
            {UserPost.map((rowData, rowIndex) => (
              <div key={rowIndex} className={styles.PostDivList}>
                {rowData.map((rdata, index) => (
                  <div key={index} className={styles.PostDiv}>
                    <Link
                      href={`/detail/${rdata.postId}`}
                      className={styles.PostDivInnerLink}
                      role="link"
                      tabIndex={0}
                    >
                      <div className={styles.LinkDiv}>
                        <div className={styles.LinkDiv2}>
                          {rdata.Images[0].endsWith(".mp4") ? (
                            <video
                              style={{
                                objectFit: "cover",
                              }}
                              src={`${rdata.Images[0]}`}
                              className={styles.ImageLink}
                            ></video>
                          ) : (
                            <Image
                              style={{
                                objectFit: "cover",
                              }}
                              alt={`${rdata.content}`}
                              src={`${rdata.Images[0]}`}
                              width={0}
                              height={0}
                              sizes="100vw"
                              className={styles.ImageLink}
                              crossOrigin="anonymous"
                            />
                          )}
                        </div>
                        <div className={styles.LinkDiv3}></div>
                      </div>
                    </Link>
                  </div>
                ))}
                {rowData.length < 3 && (
                  <>
                    {[...Array(3 - rowData.length)].map((_, index) => (
                      <div
                        key={`rrddata${index}`}
                        className={styles.PostDiv}
                      ></div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.savedDiv}>
          <div className={styles.savedDiv2} style={{ maxWidth: "350px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className={styles.savedDiv3}
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <div className={styles.savedDiv4}>
              <span className={styles.savedDiv5} style={{ lineHeight: "36px" }}>
                {"저장"}
              </span>
            </div>
            <div className={styles.savedDiv6}>
              <span className={styles.savedDiv7} style={{ lineHeight: "18px" }}>
                {
                  "다시 보고 싶은 사진과 동영상을 저장하세요. 콘텐츠를 저장해도 다른 사람에게 알림이 전송되지 않으며, 저장된 콘텐츠는 회원님만 볼 수 있습니다."
                }
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  );
}
