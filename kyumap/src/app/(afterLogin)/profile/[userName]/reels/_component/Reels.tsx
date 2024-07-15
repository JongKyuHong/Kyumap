"use client";

import React, { Fragment, useEffect } from "react";
import styles from "../../profile.module.css";
import Link from "next/link";
import {
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from "@tanstack/react-query";
import { IPost } from "@/model/Post";
import { getReels } from "@/app/(afterLogin)/_lib/getReels";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Props = {
  userEmail: string;
};

export default function Reels({ userEmail }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { data, fetchNextPage, hasNextPage, isFetching, error } =
    useInfiniteQuery<
      IPost[],
      Object,
      InfiniteData<IPost[]>,
      [_1: string, string, _3: string],
      number
    >({
      queryKey: ["user", userEmail, "reels"],
      initialPageParam: 0,
      queryFn: getReels,
      getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
      staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
      gcTime: 300 * 1000,
    });
  // console.log(data, "data");

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
                              width={0}
                              height={0}
                              sizes="100vw"
                              src={`${rdata.Images[0]}`}
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
        <div className={styles.PostLinkDiv}>
          <div style={{ maxWidth: "350px" }} className={styles.NDiv}>
            {session?.user?.email === userEmail ? (
              <>
                {" "}
                <div className={styles.CamDiv} role="button" tabIndex={0}>
                  <div className={styles.CamDiv2}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm8-6h-3c-.6 0-1 .4-1 1s.4 1 1 1h2.2l-2.5 2.5C13.4 7.5 12.7 8 12 8c-1.7 0-3-1.3-3-3s1.3-3 3-3c.7 0 1.4.3 1.9.8l2.5-2.5V3c0 .6.4 1 1 1s1-.4 1-1zm4 8h-2l-2.3 2.3c-.5.2-1 .4-1.6.4-1.7 0-3-1.3-3-3s1.3-3 3-3c.6 0 1.1.2 1.6.4l2.3-2.3h2c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2zm-4-4c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" />
                    </svg>
                  </div>
                </div>
                <div className={styles.NDiv2}>
                  <span style={{ lineHeight: "36px" }} className={styles.NSpan}>
                    {"사진 공유"}
                  </span>
                </div>
                <div className={styles.NDiv3}>
                  <span
                    style={{ lineHeight: "18px" }}
                    className={styles.Nspan2}
                  >
                    {"사진을 공유하면 회원님의 프로필에 표시됩니다."}
                  </span>
                </div>
                <div
                  className={styles.NDiv4}
                  role="button"
                  tabIndex={0}
                  onClick={showPostForm}
                >
                  {"첫 사진 공유하기"}
                </div>
              </>
            ) : (
              <>
                <div
                  className={styles.CamDiv3}
                  style={{ height: "62px", width: "62px" }}
                >
                  <span className={styles.CamDivSpan}>
                    <svg
                      aria-label=""
                      className={styles.PostLinkSvg}
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title></title>
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="2.049"
                        x2="21.95"
                        y1="7.002"
                        y2="7.002"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="13.504"
                        x2="16.362"
                        y1="2.001"
                        y2="7.002"
                      ></line>
                      <line
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        x1="7.207"
                        x2="10.002"
                        y1="2.11"
                        y2="7.002"
                      ></line>
                      <path
                        d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                      <path
                        d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
                        fillRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </div>
                <div className={styles.CamDiv4} style={{ lineHeight: "36px" }}>
                  <span className={styles.CamDivSpan2}>{"게시물 없음"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  );
}
