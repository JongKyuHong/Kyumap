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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IReply } from "@/model/Reply";
import LoadingComponent from "@/app/_component/LoadingComponent";
import { IUser } from "@/model/User";
import { getUser } from "../_lib/getUser";
import {
  useCommentReplyHeart,
  useCommentReplyUnHeart,
} from "../_lib/mutateFactory";
import { useRouter } from "next/navigation";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  parentId: string;
  comment: IReply;
  ReplyInfo: Function;
  onClickExitBtn: Function;
  postId: string;
};

export default function Reply({
  parentId,
  comment,
  ReplyInfo,
  onClickExitBtn,
  postId,
}: Props) {
  // 답글 좋아요를 눌렀는지 state
  const [isCommentLiked, setCommentLiked] = useState(false);
  const { data: session, status } = useSession();

  const router = useRouter();

  // 유저 정보
  const { data: user, isLoading } = useQuery<
    IUser,
    Object,
    IUser,
    [string, string]
  >({
    queryKey: ["users", comment?.userEmail as string],
    queryFn: getUser,
  });

  // 좋아요를 이미 눌렀는지 확인
  useEffect(() => {
    const liked = !!comment?.Hearts?.find(
      (v) => v.email === session?.user?.email
    );
    setCommentLiked(liked);
  }, [comment, session]);

  const onClickReply = () => {
    console.log(comment, comment.userNickname, parentId, "검사");
    ReplyInfo(comment.userNickname, parentId, false);
  };

  // 좋아요
  const commentHeart = useCommentReplyHeart(setCommentLiked);

  // 좋아요 취소
  const commentUnheart = useCommentReplyUnHeart(setCommentLiked);

  const onClickCommentHeart = (comment_id: string) => {
    // 댓글에 좋아요
    if (session) {
      if (isCommentLiked) {
        // 이미 댓글 좋아요를 눌렀으면
        const commentId = comment_id;
        const userSession = session.user;
        commentUnheart.mutate({ postId, commentId, userSession });
      } else {
        const commentId = comment_id;
        const userSession = session.user;
        commentHeart.mutate({ postId, commentId, userSession });
      }
    }
  };

  const onClickLink = (text: string) => {
    router.back();
    setTimeout(() => {
      router.push(`/profile/${text}`);
    }, 100);
  };

  if (isLoading) return <LoadingComponent />;
  if (!comment) return null;

  // @와 문자열 분리
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
                      alt={`${user!.nickname}님의 프로필 사진`}
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
                      >{`${user!.nickname}`}</Link>
                    </div>
                  </span>
                </div>
              </h3>
              <div className={styles.CommentContentInnerDiv}>
                <span className={styles.CommentContentSpan} dir="auto">
                  {/* {comment.content} */}
                  {parts.map((part, index) =>
                    part.startsWith("@") ? (
                      <button
                        key={index}
                        className={styles.Mention}
                        onClick={() => onClickLink(part.slice(1))}
                      >
                        {part}
                      </button>
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
