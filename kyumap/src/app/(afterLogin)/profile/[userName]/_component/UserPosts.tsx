"use client";

import React, { Fragment, useEffect } from "react";
import styles from "../profile.module.css";
import Link from "next/link";
import {
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from "@tanstack/react-query";
import { IPost } from "@/model/Post";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Props = {
  userEmail: string;
};

const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv"];

export default function UserPosts({ userEmail }: Props) {
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
      queryKey: ["user", userEmail, "posts"],
      initialPageParam: 0,
      queryFn: getUserPosts,
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

  if (data && data.pages) {
    const platData = data.pages.flat();
    for (let i = 0; i < platData.length; i += chunkSize) {
      UserPost.push(platData.slice(i, i + chunkSize));
    }
  }

  const showPostForm = () => {
    router.push(`/AddPost`);
  };

  const isVideo = (url: string) => {
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
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
                          {isVideo(rdata.Images[0]) ? (
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              style={{
                                objectFit: "cover",
                              }}
                              src={`${rdata.thumbnail}`}
                              className={styles.ImageLink}
                              alt={`${rdata.content}`}
                            />
                          ) : (
                            <Image
                              style={{
                                objectFit: "cover",
                              }}
                              width={0}
                              height={0}
                              sizes="100vw"
                              alt={`${rdata.content}`}
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
                      className={styles.CamDivSpanSvg}
                      version="1.1"
                      id="Layer_1"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 64 64"
                      xmlSpace="preserve"
                      width="24px"
                      height="24px"
                    >
                      <g>
                        <path
                          d="M32,14c-9.941,0-18,8.059-18,18s8.059,18,18,18s18-8.059,18-18S41.941,14,32,14z M32,46c-7.732,0-14-6.268-14-14
      s6.268-14,14-14s14,6.268,14,14S39.732,46,32,46z"
                        />
                        <circle cx="32" cy="32" r="10" />
                        <path
                          d="M56,10h-8.586l-4-4H20.586l-4,4H8C3.582,10,0,13.582,0,18v28c0,4.418,3.582,8,8,8h48c4.418,0,8-3.582,8-8V18
      C64,13.582,60.418,10,56,10z M60,46c0,2.206-1.794,4-4,4H8c-2.206,0-4-1.794-4-4V18c0-2.206,1.794-4,4-4h8.586l4-4h22.828l4,4H56
      c2.206,0,4,1.794,4,4V46z"
                        />
                      </g>
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
