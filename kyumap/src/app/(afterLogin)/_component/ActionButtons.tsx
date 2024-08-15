"use client";

import React, {
  useState,
  ChangeEvent,
  MouseEventHandler,
  useEffect,
} from "react";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./post.module.css";
import { IPost } from "@/model/Post";
import { useRouter } from "next/navigation";
import { getUser } from "../_lib/getUser";
import { IComment } from "@/model/Comment";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";

interface Props {
  post: IPost;
  otherText?: string | undefined;
  replyTargetProps?: string | undefined;
}

export default function ActionButtons({
  post,
  otherText,
  replyTargetProps,
}: Props) {
  // Post의 버튼들을 따로 다루는 컴포넌트
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [CommentText, setComment] = useState(otherText ?? "");
  const [isLiked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  // 좋아요 중복 방지용 state
  const [isSaved, setSaved] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [ReplyTargetId, setReplyTargetId] = useState("");

  const { data: user } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", session?.user?.email as string],
    queryFn: getUser,
    enabled: !!session?.user?.email, // session과 email이 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (otherText && replyTargetProps) {
      setComment(otherText);
      setReplyTargetId(replyTargetProps);
    }
  }, [otherText]);

  useEffect(() => {
    if (!user) return;
    const ssave = !!user?.Saved.find(
      (v: any) => v.id === post.postId.toString()
    );

    const liked = !!post?.Hearts?.find((v) => v.email === session?.user?.email);

    setLiked(liked);
    setSaved(ssave);
  }, [user, post, session?.user?.email]);

  const router = useRouter();

  const { postId } = post;

  const heart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "post",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );
    },
    onMutate: async () => {
      if (isLiking) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsLiking(true); // 요청 시작 시 상태 업데이트

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      // 인피니트 쿼리로 가져오기때문에 필터링이 필요하다
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          // posts로 시작하는 쿼리키 인경우
          const value: IPost | InfiniteData<IPost[]> | undefined =
            queryClient.getQueryData(queryKey); // 쿼리데이터를 가져오고
          if (value && "pages" in value) {
            const obj = value.pages.flat().find((v) => v.postId === postId); // postId와 일치하는 포스트를 가져옴
            if (obj) {
              const pageIndex = value.pages.findIndex(
                (page) => page.includes(obj) // 해당 포스트를 가지고있는 페이지 인덱스를 찾음
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId // 페이지 인덱스 내에서 포스트 인덱스 찾기
              );

              // 얕은 복사 준비
              const shallow: any = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];

              // 포스트 데이터 업데이트
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ email: session?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };

              // 캐시 업데이트
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 단일 포스트면
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ email: session?.user?.email as string }],
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
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onSettled: () => {
      // 중복 방지를 위한 state false로
      setIsLiking(false);
    },
  });

  const unheart = useMutation({
    mutationFn: () => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "delete",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );
    },
    onMutate: async () => {
      if (isLiking) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsLiking(true); // 요청 시작 시 상태 업데이트

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: IPost | InfiniteData<IPost[]> | undefined =
            queryClient.getQueryData(queryKey);
          if (value && "pages" in value) {
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );
              const shallow: any = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v: any) => v.email !== session?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (v) => v.email !== session?.user?.email
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
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onSettled: () => {
      setIsLiking(false);
    },
  });

  const saved = useMutation({
    mutationFn: () => {
      return fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/save`,
        {
          method: "post",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );
    },
    onMutate: async () => {
      // 사용자 정보를 가져옴
      const previousUserData = queryClient.getQueryData([
        "user",
        session!.user!.email,
      ]);

      // 낙관적으로 업데이트함 Saved에 postId 업데이트
      queryClient.setQueryData(
        ["users", session!.user!.email],
        (oldData: any) => {
          if (!oldData) {
            // 기존 데이터가 없다면 기본 데이터 생성
            return {
              email: session!.user!.email,
              nickname: session!.user!.name, // 기본 닉네임 (필요에 따라 수정)
              image: session!.user!.image, // 기본 이미지 (필요에 따라 수정)
              Saved: [postId.toString()],
              Followers: [],
              Followings: [],
              Info: {
                intro: "",
                website: "",
                gender: "",
              },
              _count: {
                Followers: 0,
                Followings: 0,
              },
            };
          }
          // 이전 데이터 있다면 Saved변경
          return {
            ...oldData,
            Saved: oldData.Saved
              ? [...oldData.Saved, postId.toString()]
              : [postId.toString()],
          };
        }
      );

      return { previousUserData };
    },
    onError: (err, variables, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context && context.previousUserData) {
        queryClient.setQueryData(
          ["user", session!.user!.email],
          context.previousUserData
        );
      }
    },
    onSuccess: () => {
      setSaved(true);
    },
    onSettled: () => {
      // 요청 완료 후 쿼리 무효화해서 최신 데이터를 가져옴 ( 안정성을 위해서 해주는게 좋음 )
      queryClient.invalidateQueries({
        queryKey: ["user", session!.user!.email],
      });
    },
  });

  const unsaved = useMutation({
    mutationFn: () => {
      return fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/save`,
        {
          method: "delete",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );
    },
    onMutate: async () => {
      if (!session || !session.user || !session.user.email) {
        throw new Error("Session or user information is missing");
      }

      const previousUserData = queryClient.getQueryData([
        "user",
        session!.user!.email,
      ]);

      // 낙관적 업데이트
      queryClient.setQueryData(
        ["user", session!.user!.email],
        (oldData: any) => {
          if (!oldData || !oldData.Saved) {
            return oldData;
          }
          return {
            ...oldData,
            Saved: oldData.Saved.filter((v: any) => v.id !== postId.toString()),
          };
        }
      );

      return { previousUserData };
    },
    onError: (err, variables, context) => {
      // 오류시 이전데이터 적용
      if (context && context.previousUserData) {
        queryClient.setQueryData(
          ["user", session!.user!.email],
          context.previousUserData
        );
      }
    },
    onSuccess: () => {
      setSaved(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", session!.user!.email],
      });
    },
  });

  const addComment = useMutation({
    mutationFn: async (commentData: {
      postId: String;
      CommentText: string;
      userSession: any;
    }) => {
      return await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/comments`,
        {
          credentials: "include",
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentData.CommentText,
            User: commentData.userSession,
          }),
        }
      );
    },
    onMutate: async (commentData) => {
      if (isPosting) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsPosting(true); // 요청 시작 시 상태 업데이트

      // Optimistic Update: 임시로 캐시 업데이트
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        postId.toString(),
        "comments",
      ]);
      queryClient.setQueryData(
        ["posts", postId.toString(), "comments"],
        (old: any) => {
          if (!old) return old;

          return [
            ...old,
            {
              postId: Number(commentData.postId),
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              // userImage: commentData.userSession.image,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date(),
            },
          ];
        }
      );

      const previousPost = queryClient.getQueryData<IPost>([
        "posts",
        postId.toString(),
      ]);
      queryClient.setQueryData(["posts", postId.toString()], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          _count: {
            ...old._count,
            Comments: old._count.Comments + 1,
          },
        };
      });

      return { previousComments, previousPost };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["posts", postId.toString(), "comments"],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["posts", postId.toString()],
          context.previousPost
        );
      }
    },
    onSuccess: (data, commentData) => {
      // 성공 시 캐시를 무효화하여 최신 댓글 목록을 가져옵니다.
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        postId.toString(),
        "comments",
      ]);

      // 게시물의 현재 정보를 가져옵니다.
      const post = queryClient.getQueryData<IPost>([
        "posts",
        postId.toString(),
      ]);

      if (previousComments && post) {
        // 댓글 배열을 업데이트합니다.
        queryClient.setQueryData(
          ["posts", postId.toString(), "comments"],
          [
            ...previousComments,
            {
              postId: Number(commentData.postId),
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              // userImage: commentData.userSession.image,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date(),
            },
          ]
        );

        // 게시물의 댓글 수를 1 증가시킵니다.
        const updatedPost = {
          ...post,
          _count: {
            ...post._count,
            Comments: post._count.Comments + 1,
          },
        };

        // 업데이트된 게시물 정보를 캐시에 저장합니다.
        queryClient.setQueryData(["posts", postId.toString()], updatedPost);
      }

      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString(), "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString()],
      });
    },
    onSettled: () => {
      setIsPosting(false); // 요청 완료 후 상태 업데이트
      setComment("");
    },
  });

  const addReplyComment = useMutation({
    mutationFn: async (commentData: {
      postId: String;
      replyTarget: string; // parent Id임
      CommentText: string;
      userSession: any;
    }) => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId.toString()}/${
          commentData.replyTarget
        }/reply`,
        {
          credentials: "include",
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentData.CommentText,
            User: commentData.userSession,
          }),
        }
      );
    },
    onMutate: async (commentData) => {
      if (isPosting) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsPosting(true); // 요청 시작 시 상태 업데이트

      // Optimistic Update: 임시로 캐시 업데이트
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId.toString(),
        "comments",
      ]);

      queryClient.setQueryData(
        ["posts", commentData.postId.toString(), "comments"],
        (old: any) => {
          if (!old) return old;

          return [
            ...old,
            {
              postId: commentData.postId,
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              // userImage: commentData.userSession.image,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date().toISOString(),
            },
          ];
        }
      );

      const previousPost = queryClient.getQueryData<IPost>([
        "posts",
        commentData.postId.toString(),
      ]);

      queryClient.setQueryData(
        ["posts", commentData.postId.toString()],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            _count: {
              ...old._count,
              Comments: old._count.Comments + 1,
            },
          };
        }
      );

      return { previousComments, previousPost };
    },
    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["posts", variables.postId.toString(), "comments"],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["posts", variables.postId.toString()],
          context.previousPost
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString(), "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString()],
      });
      setReplyTargetId("");
      setComment("");
    },
    onSettled: () => {
      setIsPosting(false); // 요청 완료 후 상태 업데이트
    },
  });

  // 하트를 클릭했을때
  const onClickHeart: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isLiking) return;
    if (isLiked) {
      // 이미 좋아요를 눌렀으면
      unheart.mutate();
    } else {
      heart.mutate();
    }
  };

  // 저장됨 클릭
  const onClickSaved: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isSaved) {
      // 이미 저장함
      unsaved.mutate();
    } else {
      saved.mutate();
    }
  };

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  // 게시를 클릭하면 디테일 페이지로 이동하게
  const onSubmitComment = () => {
    // router.push(`/detail/${postId}`);
    if (!session) {
      return router.push(`/NewLogin`);
    }
    const userSession = session.user;
    const postId = post.postId.toString();
    if (otherText && ReplyTargetId) {
      const replyTarget = ReplyTargetId;
      addReplyComment.mutate({
        postId,
        replyTarget,
        CommentText,
        userSession,
      });
    }
    addComment.mutate({ postId, CommentText, userSession });
  };

  return (
    <div className={styles.articleContent}>
      <div className={styles.articleContentDiv}>
        <div>
          <div className={styles.postIcon}>
            <div className={styles.leftSectionIcon}>
              <span className={styles.iconSpan}>
                <div
                  className={`${styles.iconDiv} ${
                    isLiked ? styles.clicked : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={onClickHeart}
                >
                  <div className={styles.iconInnerDiv}>
                    <span className={styles.iconInnerDivSpan}>
                      <svg
                        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                        className={
                          isLiked ? styles.iconSvgClicked : styles.iconSvg
                        }
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox={isLiked ? "0 0 48 48" : "0 0 24 24"}
                        width="24"
                      >
                        <title>{isLiked ? "좋아요 취소" : "좋아요"}</title>
                        <path
                          d={
                            isLiked
                              ? "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                              : "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
                          }
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </span>
              {!post.hideComments && (
                <span>
                  <Link href={`/detail/${postId}`}>
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
                  </Link>
                </span>
              )}
            </div>
            <div className={styles.rightSectionIcon}>
              <div>
                <div
                  aria-disabled="false"
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={onClickSaved}
                >
                  <div
                    className={styles.iconInnerDiv2}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.iconSvgOuterDiv}>
                      {isSaved ? (
                        <svg
                          aria-label="삭제"
                          className={styles.iconSvg}
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <title>삭제</title>
                          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                        </svg>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!post.hideLikesAndViews && (
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
          )}
          <div className={styles.postContent}>
            <div className={styles.postUserName}>
              <span className={styles.postUserNameSpan}>
                <div>
                  <Link
                    href={`/profile/${post.userNickname}`}
                    className={styles.postUserProfile}
                    role="link"
                    tabIndex={0}
                  >
                    {post.userNickname}
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
                {/* <Link
                  href={`/explore/tags/${post.hashTag}`}
                  className={styles.hashTag}
                >
                  {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                </Link> */}
              </span>
            </span>
          </div>
          {!post.hideComments && (
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
                  {`${post._count.Comments}개 모두 보기`}
                </span>
              </Link>
            </div>
          )}

          {!post.hideComments && (
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
                        name="comment"
                        aria-label="댓글 달기..."
                        className={styles.formInputTextArea}
                        placeholder="댓글 달기..."
                        autoComplete="off"
                        autoCorrect="off"
                        value={CommentText}
                        onChange={handleTextareaChange}
                      ></textarea>
                      {CommentText ? (
                        <div className={styles.EnterBtn}>
                          <div
                            className={styles.EnterDiv}
                            role="button"
                            tabIndex={0}
                            onClick={onSubmitComment}
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
          )}
        </div>
      </div>
    </div>
  );
}
