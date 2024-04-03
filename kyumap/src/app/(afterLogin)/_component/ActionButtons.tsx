"use client";

import React, { useState, ChangeEvent, MouseEventHandler } from "react";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./post.module.css";
import { Post } from "@/model/Post";

interface Props {
  post: Post;
}

export default function ActionButtons({ post }: Props) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [textValue, setTextValue] = useState("");

  // console.log(post, post.Hearts, "hearts");

  const liked = !!post.Hearts?.find((v) => {
    console.log(v, session, v.userId === session?.user?.email, post);
    return v.userId === session?.user?.email;
  });

  // console.log(liked, "liked");
  // console.log(post, "post");

  const { postId } = post;

  const heart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "post",
          credentials: "include",
        }
      );
    },
    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      console.log("queryKeys", queryKeys);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            console.log("array", value);
            const obj = value.pages.flat().find((v) => v.postId === postId);
            console.log(obj, "obj");
            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ userId: session?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
              console.log(shallow, "shallow");
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ userId: session?.user?.email as string }],
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts + 1,
                },
              };
              console.log(shallow, "shallow");
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onSuccess() {
      console.log(post, "posthihihi");
    },
    onError() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      console.log("queryKeys", queryKeys);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            console.log("array", value);
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              console.log("found index", index);
              const shallow = { ...value };
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v) => v.userId !== session?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (v) => v.userId !== session?.user?.email
                ),
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onSettled() {},
  });

  const unheart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "delete",
          credentials: "include",
        }
      );
    },
    onMutate() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      console.log("queryKeys", queryKeys);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            console.log("array", value);
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              console.log("found index", index);
              const shallow = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v) => v.userId !== session?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (v) => v.userId !== session?.user?.email
                ),
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onError() {
      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      console.log("queryKeys", queryKeys);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          console.log(queryKey[0]);
          const value: Post | InfiniteData<Post[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            console.log("array", value);
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              // 존재는 하는지
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              console.log("found index", index);
              const shallow = { ...value };
              value.pages = { ...value.pages };
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ userId: session?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 싱글 포스트인 경우
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ userId: session?.user?.email as string }],
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onSettled() {},
  });

  const onClickHeart: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (liked) {
      unheart.mutate();
    } else {
      heart.mutate();
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  };

  return (
    <div className={styles.articleContent}>
      <div className={styles.articleContentDiv}>
        <div>
          <div className={styles.postIcon}>
            <div className={styles.leftSectionIcon}>
              <span className={styles.iconSpan}>
                <div
                  className={`${styles.iconDiv} ${liked ? styles.clicked : ""}`}
                  role="button"
                  tabIndex={0}
                  onClick={onClickHeart}
                >
                  <div className={styles.iconInnerDiv}>
                    <span className={styles.iconInnerDivSpan}>
                      <svg
                        aria-label={liked ? "좋아요 취소" : "좋아요"}
                        className={
                          liked ? styles.iconSvgClicked : styles.iconSvg
                        }
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox={liked ? "0 0 48 48" : "0 0 24 24"}
                        width="24"
                      >
                        <title>{liked ? "좋아요 취소" : "좋아요"}</title>
                        <path
                          d={
                            liked
                              ? "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                              : "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
                          }
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </span>
              <span>
                <div className={styles.iconDiv} role="button" tabIndex={0}>
                  <div className={styles.iconInnerDiv}>
                    <svg
                      aria-label="댓글 달기"
                      className={styles.iconSvg}
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>댓글 달기</title>
                      <path
                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      ></path>
                    </svg>
                  </div>
                </div>
              </span>
            </div>
            <div className={styles.rightSectionIcon}>
              <div>
                <div
                  aria-disabled="false"
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className={styles.iconInnerDiv2}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.iconSvgOuterDiv}>
                      <svg
                        aria-label="저장"
                        className={styles.iconSvg}
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox="0 0 24 24"
                        width="24"
                      >
                        <title>저장</title>
                        <polygon
                          fill="none"
                          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className={styles.likeSection}>
            <div className={styles.likeSectionDiv}>
              <div className={styles.likeSectionInnerDiv}>
                <span className={styles.likeSectionSpan}>
                  <Link
                    href="#"
                    className={styles.likeModalLink}
                    role="link"
                    tabIndex={0}
                  >
                    <span
                      className={styles.likeInnerSpan}
                      style={{ lineHeight: "18px" }}
                    >
                      {"좋아요 "}
                      <span className={styles.likeCountSpan}>
                        {post._count?.Hearts || 0}
                      </span>
                      {"개"}
                    </span>
                  </Link>
                </span>
              </div>
            </div>
          </section>
          <div className={styles.postContent}>
            <div className={styles.postUserName}>
              <span className={styles.postUserNameSpan}>
                <div>
                  <Link
                    href={`/profile/${post.User.nickname}`}
                    className={styles.postUserProfile}
                    role="link"
                    tabIndex={0}
                  >
                    {post.User.nickname}
                  </Link>
                </div>
              </span>
            </div>
            <span className={styles.postContentSpan} dir="auto">
              <span className={styles.postContentSpan} dir="auto">
                {post.content}
                <br />
                <br />
                {/* {post.hashTag.map((hash, index) => (
                      <Link
                        href={`/explore/tags/${post.hash}`}
                        className={styles.hashTag}
                      >
                        {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                      </Link>
                    ))} */}
                <Link
                  href={`/explore/tags/${post.hashTag}`}
                  className={styles.hashTag}
                >
                  {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                </Link>
              </span>
            </span>
          </div>
          <div className={styles.postComment}>
            <Link
              href={`/detail/${post.postId}`}
              className={styles.commentLink}
              role="link"
              tabIndex={0}
            >
              <span
                style={{ lineHeight: "18px" }}
                className={styles.linkCommentSpan}
                dir="auto"
              >
                <span className={styles.linkCommentInnerSpan}>{"댓글 "}</span>
                {`${post._count?.Comments}개 모두 보기`}
              </span>
            </Link>
          </div>
          <div className={styles.commentInput}>
            <section className={styles.inputSection}>
              <div className={styles.inputSecitonDiv}>
                <form className={styles.formInput} method="POST">
                  <div className={styles.formInputDiv}>
                    <div className={styles.formInputInnerDiv}>
                      <div
                        className={styles.formInputInnerDiv2}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.formInputInnerDiv3}>
                          <svg
                            aria-label="이모티콘"
                            className={styles.Emoticon}
                            fill="currentColor"
                            height="13"
                            role="img"
                            viewBox="0 0 24 24"
                            width="13"
                          >
                            <title>이모티콘</title>
                            <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <textarea
                      aria-label="댓글 달기..."
                      className={styles.formInputTextArea}
                      placeholder="댓글 달기..."
                      autoComplete="off"
                      autoCorrect="off"
                      onChange={handleTextareaChange}
                      // style={{
                      //   height: "18px!important",
                      // }}
                    ></textarea>
                    {textValue ? (
                      <div className={styles.EnterBtn}>
                        <div
                          className={styles.EnterDiv}
                          role="button"
                          tabIndex={0}
                        >
                          게시
                        </div>
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
