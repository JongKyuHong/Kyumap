"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./ReelPost.module.css";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPost } from "@/model/Post";
import Link from "next/link";
import Comment from "@/app/(afterLogin)/_component/Comment";
import { IComment } from "@/model/Comment";
import { getComments } from "@/app/(afterLogin)/_lib/getComments";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ActionButtons from "@/app/(afterLogin)/_component/Post/ActionButtons";
import useDeviceSize from "@/app/(afterLogin)/_component/useDeviceSize";
import Post from "@/app/(afterLogin)/_component/Post/Post";
import ResponsiveNav from "@/app/(afterLogin)/_component/ResponsiveNav";
import MoreInfoOverlay from "@/app/(afterLogin)/_component/Post/MoreInfoOverlay";
import { IUser } from "@/model/User";
import { getAddressFromCoordinates } from "@/app/(afterLogin)/@modal/(.)AddPost/_component/action";
import LoadingComponent from "@/app/_component/LoadingComponent";
import mongoose from "mongoose";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  postId: string;
};

// 상세페이지 정보
export default function ReelPost({ postId }: Props) {
  const [isUserPaused, setIsUserPaused] = useState(false); // 사용자가 직접 일시정지했는지 여부
  const [isMuted, setMuted] = useState(true);
  const [targetCommentId, setTargetCommentId] = useState("");
  const [isClickedExitBtn, setExitBtn] = useState(false);
  const [threadId, setThreadId] = useState<mongoose.Types.ObjectId | null>(
    null
  );
  const [CommentText, setComment] = useState("");
  // const [isPosting, setIsPosting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMenu, setIsMenu] = useState(false);
  // const [mobile, setMobile] = useState(false);
  const [address, setAddress] = useState<string | null>("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const { isMobile } = useDeviceSize();

  // 댓글 정보를 불러옴
  const { data: comments } = useQuery<
    IComment[],
    Object,
    IComment[],
    [string, string, string]
  >({
    queryKey: ["posts", postId.toString(), "comments"],
    queryFn: getComments,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  // 게시글 정보를 불러옴
  const { data: post } = useQuery<IPost, Object, IPost, [string, string]>({
    queryKey: ["posts", postId],
    queryFn: getPost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  // 세션 정보를 불러옴
  const { data: session } = useSession();

  // 유저 정보를 불러옴
  const { data: userData } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", post?.userEmail as string],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!post,
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData && post) {
      const calculateAdr = async () => {
        const adr = await getAddressFromCoordinates(
          post!.position.lat,
          post!.position.lng
        );
        setAddress(adr.address_name);
      };
      calculateAdr();
    }
  }, [userData, post, session?.user?.email]);

  // useEffect(() => {
  //   setMobile(isMobile);
  // }, [isMobile]);

  // 삭제 mutation
  const deleteComment = useMutation({
    mutationFn: async (commentData: {
      postId: String;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/comments/${commentData.commentId}`,
        {
          credentials: "include",
          method: "delete",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          alert("본인이 작성한 댓글이 아닙니다.");
        }
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
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
        // 댓글 배열에서 삭제할 댓글을 제외합니다.
        const updatedComments = previousComments.filter(
          (comment) => comment._id !== commentData.commentId
        );

        // 업데이트된 댓글 배열을 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", postId.toString(), "comments"],
          updatedComments
        );

        // 게시물의 댓글 수를 1 감소시킵니다.
        const updatedPost = {
          ...post,
          _count: {
            ...post._count,
            Comments: post._count.Comments - 1,
          },
        };

        // 업데이트된 게시물 정보를 캐시에 저장합니다.
        queryClient.setQueryData(["posts", postId.toString()], updatedPost);
      }
      return { previousComments };
    },
    onError: (error, commentData, context) => {
      // 에러가 발생하면 이전 댓글 목록으로 롤백합니다.
      queryClient.setQueryData(
        ["posts", postId.toString(), "comments"],
        context?.previousComments
      );
    },
    onSettled: (commentData) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString(), "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", postId.toString()],
      });
      setExitBtn(false);
    },
  });

  // 게시글 이미지 / 동영상 클릭 시
  const onClickVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setIsUserPaused(false);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsUserPaused(true);
      }
    }
  };

  // 음소거 토글
  const toggleMute = () => {
    setMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  // Comment 컴포넌트로 보낼 함수
  const onClickExitBtnChild = (id: string, e: boolean) => {
    // isClickedExitBtn // 이게 true면 삭제창이 뜬다
    // 삭제창을 띄우고 targetId를 바꾸는 함수
    setTargetCommentId(id);
    setExitBtn(e);
  };

  const onClickRemoveComment = () => {
    if (!session) {
      return null;
    }
    const commentId = targetCommentId;
    const userSession = session.user;
    deleteComment.mutate({ postId, commentId, userSession });
  };

  const onClickExitBtnClose = () => {
    setTargetCommentId("");
    setExitBtn(false);
  };

  const ReplyInfo = (
    userNickname: string,
    rootId: mongoose.Types.ObjectId | null
  ) => {
    // textarea에 답글 대상 id를 넣음
    setComment(CommentText + "@" + userNickname + " ");

    // 답글인지 판별이였는데
    setThreadId(rootId);
  };

  const closeMenu = () => {
    setIsMenu(false);
  };

  const onOpenDetail = useCallback(() => {
    setIsMenu(false);
    router.push(`/detailInfo/${postId}`);
  }, [router, postId]);

  // if (postLoading || userLoading) return <LoadingComponent />;
  if (!post || !userData) return null;

  return (
    <>
      {isMobile ? (
        <>
          <Post post={post} />
          <ResponsiveNav />
        </>
      ) : (
        <>
          <section className={styles.section}>
            <main className={styles.main}>
              <div className={styles.mainDiv}>
                <div className={styles.mainDiv2} style={{ maxWidth: "673px" }}>
                  <div className={styles.mainDiv4}>
                    <div className={styles.VideoDiv}>
                      <div className={styles.VideoDiv2}>
                        <div>
                          <div
                            className={styles.VideoDiv3}
                            role="button"
                            aria-hidden="true"
                          >
                            <div>
                              <div className={styles.VideoDiv4}>
                                <div
                                  className={styles.VideoDiv5}
                                  style={{ paddingBottom: "177.778%" }}
                                >
                                  <div className={styles.VideoDiv6}>
                                    <div className={styles.VideoDiv7}>
                                      <div className={styles.VideoDiv8}>
                                        <div className={styles.VideoDiv9}>
                                          <div className={styles.VideoDiv10}>
                                            <video
                                              ref={videoRef}
                                              playsInline
                                              autoPlay
                                              loop
                                              muted
                                              className={styles.VideoDiv11}
                                              src={post.Images[0]}
                                            />
                                            <div>
                                              <div className={styles.footerDiv}>
                                                {!isPlaying ? (
                                                  <div
                                                    className={
                                                      styles.footerPlayingDiv
                                                    }
                                                    onClick={onClickVideo}
                                                  >
                                                    <div
                                                      className={
                                                        styles.footerPlayingDiv2
                                                      }
                                                    >
                                                      <div aria-label="재생"></div>
                                                    </div>
                                                  </div>
                                                ) : (
                                                  <div
                                                    className={
                                                      styles.footerDiv2
                                                    }
                                                    onClick={onClickVideo}
                                                    role="presentation"
                                                  ></div>
                                                )}
                                                <div
                                                  className={styles.MuteDiv}
                                                  onClick={toggleMute}
                                                >
                                                  <button
                                                    aria-label="오디오 켜기/끄기"
                                                    type="button"
                                                    className={styles.MuteBtn}
                                                  >
                                                    <div
                                                      className={
                                                        styles.MuteDiv2
                                                      }
                                                    >
                                                      {!isMuted ? (
                                                        <svg
                                                          aria-label="오디오를 재생 중입니다"
                                                          className={
                                                            styles.audioSvg
                                                          }
                                                          fill="currentColor"
                                                          height="12"
                                                          role="img"
                                                          viewBox="0 0 24 24"
                                                          width="12"
                                                        >
                                                          <title>
                                                            오디오를 재생
                                                            중입니다
                                                          </title>
                                                          <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path>
                                                        </svg>
                                                      ) : (
                                                        <svg
                                                          aria-label="오디오 소리 꺼짐"
                                                          className={
                                                            styles.audioSvg
                                                          }
                                                          fill="currentColor"
                                                          height="12"
                                                          role="img"
                                                          viewBox="0 0 48 48"
                                                          width="12"
                                                        >
                                                          <title>
                                                            오디오 소리 꺼짐
                                                          </title>
                                                          <path
                                                            clipRule="evenodd"
                                                            d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"
                                                            fillRule="evenodd"
                                                          ></path>
                                                        </svg>
                                                      )}
                                                    </div>
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.contentDiv}>
                      <div className={styles.contentDiv2}>
                        <div className={styles.contentDiv3}>
                          <div className={styles.contentDiv7}>
                            <div className={styles.contentDiv8}>
                              <div>
                                <div>
                                  <div
                                    className={styles.profileImgDiv}
                                    aria-disabled="false"
                                    role="button"
                                    tabIndex={0}
                                    style={{ cursor: "pointer" }}
                                  >
                                    <canvas
                                      className={styles.profileImgCanvas}
                                      style={{
                                        left: "-5px",
                                        position: "absolute",
                                        top: "-5px",
                                        height: "42px",
                                        width: "42px",
                                      }}
                                    ></canvas>
                                    <span
                                      className={styles.profileImgSpan}
                                      style={{ height: "32px", width: "32px" }}
                                      role="link"
                                    >
                                      <Image
                                        alt={`${post?.userNickname}님의 프로필`}
                                        className={styles.Image}
                                        crossOrigin="anonymous"
                                        draggable="false"
                                        src={`${userData!.image}`}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.contentDivProfile}>
                              <div
                                className={styles.contentDivProfile2}
                                style={{ width: "100%" }}
                              >
                                <div className={styles.contentDivProfile3}>
                                  <div>
                                    <div className={styles.contentDivProfile4}>
                                      <span
                                        className={styles.contentDivProfile5}
                                        style={{ lineHeight: "18px" }}
                                      >
                                        <span
                                          className={styles.contentDivProfile6}
                                        >
                                          <div>
                                            <Link
                                              className={
                                                styles.contentDivProfile7
                                              }
                                              href={`/profile/${post.userNickname}`}
                                            >
                                              {post.userNickname}
                                            </Link>
                                          </div>
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.contentDivDot}>
                              <div className={styles.contentDivDot2}>
                                <div
                                  className={styles.contentDivDot3}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <Link href={`/home/${postId}`}>
                                    <div className={styles.contentDivDot4}>
                                      <div
                                        className={styles.contentDivDot5}
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                        }}
                                      >
                                        <svg
                                          aria-label="옵션 더 보기"
                                          className={styles.contentDivDot6}
                                          fill="currentColor"
                                          height="24"
                                          role="img"
                                          viewBox="0 0 24 24"
                                          width="24"
                                        >
                                          <title>옵션 더 보기</title>
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                          <circle
                                            cx="6"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                          <circle
                                            cx="18"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                        </svg>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className={styles.contentHr}></hr>
                        <div className={styles.contentDiv4}>
                          <div className={styles.contentDiv9}>
                            <div>
                              <div className={styles.contentDiv11}>
                                <div className={styles.contentDiv12}>
                                  <div>
                                    <div>
                                      <Link
                                        className={styles.contentLink}
                                        href={`/profile/${post.userNickname}`}
                                        role="link"
                                        tabIndex={0}
                                        style={{
                                          height: "32px",
                                          width: "32px",
                                        }}
                                      >
                                        <Image
                                          className={styles.contentLinkImage}
                                          crossOrigin="anonymous"
                                          draggable="false"
                                          src={`${userData!.image}`}
                                          alt={`${post.userNickname}의 프로필 사진`}
                                          width={0}
                                          height={0}
                                          sizes="100vw"
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.contentDiv13}>
                                  <div className={styles.contentDiv14}>
                                    <span
                                      className={styles.contentDivSpan}
                                      style={{ lineHeight: "18px" }}
                                    >
                                      <div className={styles.contentDiv16}>
                                        <div className={styles.contentDiv17}>
                                          <span
                                            className={styles.contentDivSpan3}
                                          >
                                            <div>
                                              <Link
                                                className={styles.contentLink2}
                                                href={`/profile/${post.userNickname}`}
                                                role="link"
                                                tabIndex={0}
                                              >
                                                <div
                                                  className={
                                                    styles.contentDiv18
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.contentDiv19
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.contentDivSpan4
                                                      }
                                                      dir="auto"
                                                    >
                                                      {post.userNickname}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </span>
                                          &nbsp;
                                          <span
                                            className={styles.contentDivSpan5}
                                            style={{ lineHeight: "18px" }}
                                          >
                                            <time className={styles.timeMargin}>
                                              {dayjs(post.createdAt).fromNow(
                                                true
                                              )}
                                            </time>
                                          </span>
                                        </div>
                                        <span
                                          className={styles.contentDivSpan2}
                                          style={{ lineHeight: "18px" }}
                                        >
                                          {post.content}
                                        </span>
                                        <span
                                          className={styles.contentDivSpan2}
                                          style={{ lineHeight: "18px" }}
                                        >
                                          {`주소 : ${address}`}
                                        </span>
                                      </div>
                                    </span>
                                    <div className={styles.contentDiv15}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={styles.contentDiv10}>
                              {comments &&
                                comments.map((comment, index) => (
                                  <Comment
                                    key={index}
                                    comment={comment}
                                    postId={postId.toString()}
                                    onClickExitBtnChild={onClickExitBtnChild}
                                    ReplyInfo={ReplyInfo}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <div className={styles.contentDiv5}>
                          <ActionButtons
                            post={post}
                            otherText={CommentText}
                            rootId={threadId}
                          />
                        </div>
                        <div className={styles.contentDiv6}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.mainDiv3}></div>
              </div>
            </main>
          </section>
          {isClickedExitBtn && (
            <div className={styles.ExitBtn}>
              <div className={styles.ExitBtn2}>
                <div className={styles.ExitBtn3}>
                  <div
                    className={styles.ExitBtn4}
                    onClick={onClickExitBtnClose}
                  ></div>
                  <div className={styles.ExitBtn5}>
                    <div className={styles.ExitBtn6}>
                      <div className={styles.ExitBtn7}>
                        <div className={styles.ExitBtn8} role="dialog">
                          <div className={styles.ExitBtn9}>
                            <div className={styles.ExitBtnModal} role="dialog">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                  maxWidth: "100%",
                                }}
                              >
                                <div className={styles.ExitBtnModal2}>
                                  <div className={styles.ExitBtnModalHeader}>
                                    <span
                                      className={styles.ExitBtnModalHeader2}
                                      dir="auto"
                                      style={{ lineHeight: "25px" }}
                                    >
                                      {"댓글을 삭제하시겠어요?"}
                                    </span>
                                    <span
                                      className={styles.ExitBtnModalHeader3}
                                      dir="auto"
                                      style={{ lineHeight: "25px" }}
                                    >
                                      {
                                        "지금 나가면 수정 내용이 저장되지 않습니다."
                                      }
                                    </span>
                                  </div>
                                  <div
                                    className={styles.ExitBtnModalBody}
                                    style={{ lineHeight: "18px" }}
                                  >
                                    <button
                                      className={styles.ExitBtnBtn}
                                      onClick={onClickRemoveComment}
                                    >
                                      삭제
                                    </button>
                                    <button
                                      className={styles.ExitBtnBtn2}
                                      onClick={onClickExitBtnClose}
                                    >
                                      취소
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isMenu && (
            <MoreInfoOverlay
              postId={Number(postId)}
              onClose={closeMenu}
              onOpenDetail={onOpenDetail}
            />
          )}
        </>
      )}
    </>
  );
}
