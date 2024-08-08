"use client";

import { useState, useEffect } from "react";
import styles from "./comment.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { IComment } from "@/model/Comment";
import { useSession } from "next-auth/react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import LoadingComponent from "@/app/_component/LoadingComponent";
import { IUser } from "@/model/User";
import { getUser } from "../_lib/getUser";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  comment: IComment;
  ReplyInfo: Function;
  onClickExitBtn: Function;
  postId: string;
  parentId: string;
};

export default function Commentli({
  comment,
  ReplyInfo,
  onClickExitBtn,
  postId,
  parentId,
}: Props) {
  const [isCommentLiked, setCommentLiked] = useState(false);
  const [isReply, setReply] = useState(false);
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<
    IUser,
    Object,
    IUser,
    [string, string]
  >({
    queryKey: ["users", comment?.userEmail as string],
    queryFn: getUser,
  });

  useEffect(() => {
    const liked = !!comment?.Hearts?.find(
      (v) => v.email === session?.user?.email
    );
    setCommentLiked(liked);

    const isitReply = comment.hasOwnProperty("parent");
    setReply(isitReply);
  }, [comment, session]);

  const onClickReply = () => {
    ReplyInfo(comment.userNickname, parentId, false);
  };

  // 댓글 좋아요 mutation
  const commentHeart = useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/heart`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    // 낙관적 업데이트를 위해 캐시 데이터 미리 수정
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      // 이전 댓글 데이터를 가져옵니다.
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        // 좋아요를 누른 댓글의 좋아요 수를 업데이트합니다.
        const updatedComments = previousComments.map((comment) =>
          comment._id === commentData.commentId
            ? {
                ...comment,
                _count: {
                  ...comment._count,
                  Hearts: comment._count.Hearts + 1,
                },
                Hearts: [
                  ...(comment.Hearts || []),
                  commentData.userSession.email,
                ],
              }
            : comment
        );

        // 업데이트된 댓글 데이터를 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      // 성공 시, 최신 데이터를 가져오기 위해 캐시를 무효화합니다.
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      setCommentLiked(true);
    },
  });

  const commentUnheart = useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/heart`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });

      // 이전 댓글 데이터를 가져옵니다.
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        // 좋아요를 취소한 댓글의 좋아요 수를 업데이트하고 이메일 정보를 삭제합니다.
        const updatedComments = previousComments.map((comment) => {
          if (comment._id === commentData.commentId) {
            return {
              ...comment,
              Hearts: comment.Hearts.filter(
                (heart) => heart.email !== commentData.userSession.email
              ),
              _count: {
                ...comment._count,
                Hearts: comment._count.Hearts - 1,
              },
            };
          }
          return comment;
        });

        // 업데이트된 댓글 데이터를 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      // 성공 시, 최신 데이터를 가져오기 위해 캐시를 무효화합니다.
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      setCommentLiked(false);
    },
  });

  const onClickCommentHeart = (comment_id: string) => {
    // 댓글에 좋아요
    if (isCommentLiked) {
      // 이미 댓글 좋아요를 눌렀으면
      if (session) {
        const commentId = comment_id;
        const userSession = session.user;
        commentUnheart.mutate({ postId, commentId, userSession });
      }
    } else {
      if (session) {
        const commentId = comment_id;
        const userSession = session.user;
        commentHeart.mutate({ postId, commentId, userSession });
      }
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (!comment) return null;
  let parts: any[] = [];
  if (comment && comment.content) {
    parts = comment.content.split(/(@\w+)/g);
  }

  return (
    <div role="button" tabIndex={0} className={styles.CommentUlDiv}>
      <li className={styles.CommentUlDivLi}>
        <div className={styles.CommentLiDiv}>
          <div className={styles.CommentContent}>
            <div>
              <div>
                <div
                  role="button"
                  tabIndex={-1}
                  className={styles.CommentUserProfileDiv}
                >
                  <canvas
                    style={{
                      left: "-5px",
                      position: "absolute",
                      top: "-5px",
                      height: "42px",
                      width: "42px",
                    }}
                    className={styles.CommentUserProfileCanvas}
                  ></canvas>
                  <Link
                    href="#"
                    role="link"
                    tabIndex={0}
                    style={{
                      height: "32px",
                      width: "32px",
                    }}
                    className={styles.CommentUserProfileLink}
                  >
                    <Image
                      alt={`${comment.userNickname}님의 프로필 사진`}
                      src={`${user!.image}`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className={styles.CommentUserProfileImage}
                      crossOrigin="anonymous"
                      draggable="false"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className={styles.CommentContentInner}>
              <h3 className={styles.CommentContentH3}>
                <div className={styles.CommentUserName}>
                  <span className={styles.CommentUserNameSpan}>
                    <div>
                      <Link
                        href="#"
                        role="link"
                        tabIndex={0}
                        className={styles.CommentUserNameLink}
                      >{`${comment.userNickname}`}</Link>
                    </div>
                  </span>
                </div>
              </h3>
              <div className={styles.CommentContentInnerDiv}>
                <span className={styles.CommentContentSpan} dir="auto">
                  {/* {comment.content} */}
                  {parts.map((part, index) =>
                    part.startsWith("@") ? (
                      <Link
                        href={`/profile/${part.slice(1)}`}
                        key={index}
                        className={styles.Mention}
                      >
                        {part}
                      </Link>
                    ) : (
                      part
                    )
                  )}
                </span>
              </div>
              <div className={styles.CommentContentTime}>
                <span
                  className={styles.CommentContentTimeSpan}
                  style={{
                    lineHeight: "16px",
                  }}
                >
                  <div
                    className={styles.CommentTimeDiv}
                    role="link"
                    tabIndex={0}
                  >
                    <time className={styles.CommentTimeTime}>
                      {dayjs(comment.createdAt).fromNow(true)}
                    </time>
                  </div>
                  <button className={styles.heartsCountBtn}>
                    <span
                      className={styles.heartsCountSpan}
                      style={{ lineHeight: "16px" }}
                    >
                      {`좋아요 ${comment?._count?.Hearts || 0}개`}
                    </span>
                  </button>
                  <button className={styles.replyBtn} onClick={onClickReply}>
                    <span className={styles.replySpan}>답글 달기</span>
                  </button>
                  <div className={styles.replynextdiv}></div>
                  <div
                    className={styles.replynextdiv2}
                    onClick={() => onClickExitBtn(comment._id)}
                  >
                    <div className={styles.replynextdiv3}>
                      <div className={styles.replynextdiv4}>
                        <div className={styles.replynextdiv5}>
                          <div
                            className={styles.replynextdiv6}
                            style={{
                              height: "24px",
                              width: "24px",
                            }}
                          >
                            <svg
                              aria-label="댓글 옵션"
                              className={styles.replySvg}
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>댓글 옵션</title>
                              <circle cx="12" cy="12" r="1.5"></circle>
                              <circle cx="6" cy="12" r="1.5"></circle>
                              <circle cx="18" cy="12" r="1.5"></circle>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <span className={styles.HeartSpan}>
            <div className={styles.HeartSpanDiv}>
              <div className={styles.HeartSpanDiv2} role="button" tabIndex={0}>
                <div
                  className={styles.HeartSpanDiv3}
                  onClick={() => onClickCommentHeart(comment._id)}
                >
                  <span>
                    {isCommentLiked ? (
                      <svg
                        aria-label="좋아요 취소"
                        className={styles.HeartSvg2}
                        fill="currentColor"
                        height="12"
                        role="img"
                        viewBox="0 0 48 48"
                        width="12"
                      >
                        <title>좋아요 취소</title>
                        <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                      </svg>
                    ) : (
                      <svg
                        aria-label="좋아요"
                        className={styles.HeartSvg}
                        fill="currentColor"
                        height="12"
                        role="img"
                        viewBox="0 0 24 24"
                        width="12"
                      >
                        <title>좋아요</title>
                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                      </svg>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </span>
        </div>
      </li>
    </div>
  );
}
