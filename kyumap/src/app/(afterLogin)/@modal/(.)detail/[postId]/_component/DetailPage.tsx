"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  MouseEventHandler,
  useRef,
} from "react";
import styles from "./detail.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useRouter } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { IPost } from "@/model/Post";
import { IComment } from "@/model/Comment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getComments } from "@/app/(afterLogin)/_lib/getComments";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";
import useDeviceSize from "@/app/(afterLogin)/_component/useDeviceSize";
import { useSession } from "next-auth/react";
import Comment from "../../../../_component/Comment";
import { getUser } from "../../../../_lib/getUser";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";
import { getAddressFromCoordinates } from "../../../(.)AddPost/_component/action";
import {
  useComment,
  useHeart,
  useSave,
  useUnheart,
  useUnsave,
} from "@/app/(afterLogin)/_lib/mutateFactory";
import mongoose from "mongoose";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  postId: string;
};

const videoExtensions = [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv"];

export default function DetailPage({ postId }: Props) {
  const [isLiked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [CommentText, setComment] = useState("");
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const [isEmoClicked, setEmoClicked] = useState(false);
  const [isClickedExitBtn, setExitBtn] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState("");
  const [threadId, setThreadId] = useState<mongoose.Types.ObjectId | null>(
    null
  ); // 최상의 댓글의 _id
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isUserPaused, setIsUserPaused] = useState(false); // 사용자가 직접 일시정지했는지 여부
  const [isMuted, setMuted] = useState(true);
  const [fileName, setFileName] = useState("");
  const [isImg, setImg] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [address, setAddress] = useState<string | null>("");

  const { data: session } = useSession();

  const { isMobile } = useDeviceSize();

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

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

  const { data: post } = useQuery<IPost, Object, IPost, [string, string]>({
    queryKey: ["posts", postId],
    queryFn: getPost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const { data: user, isLoading } = useQuery<
    IUser,
    Object,
    IUser,
    [string, string]
  >({
    queryKey: ["users", post?.userEmail as string],
    queryFn: getUser,
    enabled: !!post,
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  // 좋아요 저장됨 상태 업데이트
  useEffect(() => {
    if (!user || !post) return;
    const calculateAdr = async () => {
      const adr = await getAddressFromCoordinates(
        post!.position.lat,
        post!.position.lng
      );
      setAddress(adr.address_name);
    };
    const ssave = !!user?.Saved.find(
      (v: any) => v.id === post?.postId.toString()
    );

    const liked = !!post?.Hearts?.find((v) => v.email === session?.user?.email);
    calculateAdr();
    setLiked(liked);
    setSaved(ssave);
  }, [post, session?.user?.email, user]);

  // 비디오 일시정지/재생 토글
  const onClickVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsUserPaused(false);
      } else {
        videoRef.current.pause();
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

  // 파일확장자
  const getFileExtension = (url: any) => {
    return url?.split(".").pop();
  };

  const currentFile = post?.Images[currentNumber]; // 현재 파일
  const fileExtension = getFileExtension(currentFile); // 파일 확장자

  const isVideo = (url: string) => {
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  // 좋아요
  const heart = useHeart({ setIsLiking, isLiking });
  // 좋아요 취소
  const unheart = useUnheart({ setIsLiking, isLiking });

  // 댓글 달기
  const addComment = useComment({
    postId: Number(postId),
    isPosting,
    setIsPosting,
    setComment,
    setThreadId,
  });

  const deleteComment = useMutation({
    mutationFn: async (commentData: {
      postId: String;
      commentId: string;
      userSession: any;
      commentThreadId: mongoose.Types.ObjectId | null;
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
      queryClient.invalidateQueries({
        queryKey: ["reply", commentData.commentThreadId],
      });
      setExitBtn(false);
    },
  });
  const saved = useSave({ setSaved });

  const unsaved = useUnsave({ setSaved });

  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    if (post) {
      setMultiImg(post.Images.length > 1);
    }
  }, [post, currentNumber]);

  const onClickXbox = () => {
    router.back();
  };

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  const onEmoClicked = () => {
    setEmoClicked(!isEmoClicked);
  };

  const onClickHeart: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isLiking) return;
    if (isLiked) {
      unheart.mutate({ postId: Number(postId), session });
    } else {
      heart.mutate({ postId: Number(postId), session });
    }
  };

  const onClickRemoveComment = () => {
    if (!session) {
      return null;
    }
    const commentId = targetCommentId;
    const userSession = session.user;
    const commentThreadId = threadId;
    deleteComment.mutate({
      postId,
      commentId,
      userSession,
      commentThreadId: commentThreadId,
    });
  };

  // Comment 컴포넌트로 보낼 함수
  const onClickExitBtnChild = (id: string, e: boolean) => {
    // isClickedExitBtn // 이게 true면 삭제창이 뜬다
    // 삭제창을 띄우고 targetId를 바꾸는 함수
    setTargetCommentId(id);
    setExitBtn(e);
  };

  // 답글 달기를 눌렀을때
  const ReplyInfo = (
    userNickname: string,
    rootId: mongoose.Types.ObjectId | null
  ) => {
    // textarea에 답글 대상 id를 넣음
    setComment(CommentText + "@" + userNickname + " ");

    // 답글인지 판별이였는데
    setThreadId(rootId);
  };

  const CommentInfo = (commenttext: string, id: string) => {};

  const onClickExitBtnClose = () => {
    setTargetCommentId("");
    setExitBtn(false);
  };

  const onSubmitComment = () => {
    if (!session || isPosting) {
      return null;
    }
    const userSession = session.user;
    addComment.mutate({
      postId: Number(postId),
      threadId,
      CommentText,
      userSession,
    });
  };

  const onClickSaved: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isSaved) {
      // 이미 저장함
      unsaved.mutate({ postId: Number(postId), session });
    } else {
      saved.mutate({ postId: Number(postId), session });
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (!post) return null;

  return (
    <>
      <div
        className={
          isClickedExitBtn ? styles.ModalInnerDivExitBtn : styles.rootModalDiv
        }
      >
        <div className={styles.rootDivStyle2}>
          <div className={styles.rootDivStyle}>
            <div className={styles.unknown}></div>
            <div className={styles.modalXbox}>
              <div className={styles.modalXboxInner} role="button" tabIndex={0}>
                <div className={styles.Xbox}>
                  <svg
                    aria-label="닫기"
                    className={styles.XboxSvg}
                    onClick={onClickXbox}
                    fill="currentColor"
                    height="18"
                    role="img"
                    viewBox="0 0 24 24"
                    width="18"
                  >
                    <title>닫기</title>
                    <polyline
                      fill="none"
                      points="20.643 3.357 12 12 3.353 20.647"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                    ></polyline>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      x1="20.649"
                      x2="3.354"
                      y1="20.649"
                      y2="3.354"
                    ></line>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.totalModalStyle} tabIndex={-1}>
              <div className={styles.totalModalStyleInner}>
                <div className={styles.modalStyle2}>
                  <div className={styles.modalStyle} role="dialog">
                    <div className={styles.MainDiv}>
                      <div>
                        <div className={styles.Outer}>
                          <div className={styles.Inner}></div>
                        </div>
                      </div>
                      <div className={styles.ModalRoot}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            maxWidth: "100%",
                          }}
                        >
                          {isMobile ? (
                            <article
                              className={styles.DetailModalRootArticleW}
                              role="presentation"
                              tabIndex={-1}
                            >
                              <div className={styles.DetailModalDivW}>
                                <div className={styles.ModalHeaderW}>
                                  <div className={styles.ModalHeaderW2}>
                                    <header className={styles.ModalHeaderW3}>
                                      <div>
                                        <div>
                                          <div>
                                            <div
                                              className={styles.logoDivW}
                                              role="button"
                                              tabIndex={-1}
                                            >
                                              <canvas
                                                className={styles.logoCanvasW}
                                                height={42}
                                                width={42}
                                                style={{
                                                  left: "-5px",
                                                  position: "absolute",
                                                  top: "-5px",
                                                }}
                                              ></canvas>
                                              <Link
                                                href="#"
                                                className={styles.logoLinkW}
                                                role="link"
                                                tabIndex={0}
                                                style={{
                                                  height: "32px",
                                                  width: "32px",
                                                }}
                                              >
                                                <Image
                                                  width={0}
                                                  height={0}
                                                  sizes="100vw"
                                                  alt={`${
                                                    post!.userNickname
                                                  }님이 올린 사진`}
                                                  src={
                                                    post.Images[currentNumber]
                                                  }
                                                  crossOrigin="anonymous"
                                                  draggable="false"
                                                  className={styles.logoW}
                                                />
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </header>
                                  </div>
                                </div>
                                <div className={styles.DetailModalImageDiv}>
                                  <div className={styles.DetailImageDivInner}>
                                    <div
                                      className={styles.DetailImageDivInner2}
                                    >
                                      <div
                                        className={styles.DetailImageDivInner3}
                                        style={{
                                          paddingBottom: !isMobile
                                            ? "75%"
                                            : "100%",
                                        }}
                                      ></div>
                                      <div
                                        className={styles.DetailImageDivInner4}
                                      >
                                        <div
                                          className={
                                            styles.DetailImageDivInner5
                                          }
                                        >
                                          <div
                                            className={
                                              styles.DetailImageDivInner6
                                            }
                                            role="presentation"
                                          >
                                            <div
                                              style={{ width: "100%" }}
                                              className={
                                                styles.DetailImageDivInner7
                                              }
                                            >
                                              <div
                                                style={{ width: "100%" }}
                                                className={styles.liImage}
                                              >
                                                <div
                                                  className={styles.ImageDiv}
                                                  role="button"
                                                  tabIndex={0}
                                                >
                                                  <div>
                                                    <div
                                                      className={
                                                        styles.ImagePortDiv
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.ImageOuterDiv
                                                        }
                                                        style={{
                                                          paddingBottom: "75%",
                                                        }}
                                                      >
                                                        {isVideo(
                                                          post.Images[
                                                            currentNumber
                                                          ]
                                                        ) ? (
                                                          <div
                                                            className={
                                                              styles.videoDiv
                                                            }
                                                          >
                                                            <div
                                                              className={
                                                                styles.videoDiv2
                                                              }
                                                            >
                                                              <div
                                                                className={
                                                                  styles.videoDiv3
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.videoDiv4
                                                                  }
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles.videoDiv5
                                                                    }
                                                                  >
                                                                    <video
                                                                      ref={
                                                                        videoRef
                                                                      }
                                                                      className={
                                                                        styles.video
                                                                      }
                                                                      playsInline
                                                                      // preload="none"
                                                                      autoPlay
                                                                      loop
                                                                      muted
                                                                      // controls
                                                                      style={{
                                                                        display:
                                                                          "block",
                                                                      }}
                                                                      src={
                                                                        currentFile
                                                                      }
                                                                      crossOrigin="anonymous"
                                                                    >
                                                                      <p>
                                                                        동영상을
                                                                        로드할
                                                                        수
                                                                        없습니다.
                                                                      </p>
                                                                    </video>
                                                                    <div>
                                                                      <div
                                                                        className={
                                                                          styles.videoDiv6
                                                                        }
                                                                        onClick={
                                                                          onClickVideo
                                                                        }
                                                                      >
                                                                        <div
                                                                          className={
                                                                            styles.videoDiv66
                                                                          }
                                                                        >
                                                                          {/* {!isPlaying && (
                                                                            <div
                                                                              className={
                                                                                styles.videoDiv8
                                                                              }
                                                                            >
                                                                              <div aria-label="재생"></div>
                                                                            </div>
                                                                          )} */}
                                                                        </div>
                                                                      </div>
                                                                      <div
                                                                        className={
                                                                          styles.videoDiv7
                                                                        }
                                                                        onClick={
                                                                          toggleMute
                                                                        }
                                                                      >
                                                                        <button
                                                                          className={
                                                                            styles.videoButton
                                                                          }
                                                                          aria-label="오디오 켜기/끄기"
                                                                        >
                                                                          <div
                                                                            className={
                                                                              styles.videoBtn
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
                                                                                  오디오를
                                                                                  재생
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
                                                                                  오디오
                                                                                  소리
                                                                                  꺼짐
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
                                                        ) : (
                                                          <Image
                                                            alt="Photo by"
                                                            width={0}
                                                            height={0}
                                                            sizes="100vw"
                                                            className={
                                                              styles.ArticleImage
                                                            }
                                                            object-fit="cover"
                                                            crossOrigin="anonymous"
                                                            decoding="auto"
                                                            src={
                                                              post.Images[
                                                                currentNumber
                                                              ]
                                                            }
                                                          />
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {/* 이전 이미지가 존재하면 */}
                                          <button
                                            aria-label="돌아가기"
                                            className={styles.BtnM}
                                            tabIndex={-1}
                                            style={{
                                              left: 0,
                                              visibility:
                                                currentNumber === 0
                                                  ? "hidden"
                                                  : "visible",
                                              pointerEvents:
                                                currentNumber === 0
                                                  ? "none"
                                                  : "auto",
                                            }}
                                          >
                                            <div
                                              className={styles.prevBtn}
                                              onClick={onClickPrevBtn}
                                            >
                                              <svg
                                                width="30"
                                                height="34"
                                                viewBox="0 0 30 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="15"
                                                  cy="17"
                                                  r="14"
                                                  fill="rgba(240, 240, 240, 0.8)"
                                                  stroke="lightgray"
                                                  strokeWidth="2"
                                                />
                                                <path
                                                  d="M18 11l-6 6 6 6"
                                                  stroke="gray"
                                                  strokeWidth="2"
                                                  fill="none"
                                                />
                                              </svg>
                                            </div>
                                          </button>
                                          <button
                                            aria-label="다음"
                                            style={{
                                              right: 0,
                                              visibility:
                                                currentNumber ===
                                                post!.Images.length - 1
                                                  ? "hidden"
                                                  : "visible",
                                              pointerEvents:
                                                currentNumber ===
                                                post!.Images.length - 1
                                                  ? "none"
                                                  : "auto",
                                            }}
                                            className={styles.BtnM}
                                            tabIndex={-1}
                                          >
                                            <div
                                              className={styles.nextBtn}
                                              onClick={onClickNextBtn}
                                            >
                                              <svg
                                                width="30"
                                                height="34"
                                                viewBox="0 0 30 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="15"
                                                  cy="17"
                                                  r="14"
                                                  fill="rgba(240, 240, 240, 0.8)"
                                                  stroke="lightgray"
                                                  strokeWidth="2"
                                                />
                                                <path
                                                  d="M12 11l6 6-6 6"
                                                  stroke="gray"
                                                  strokeWidth="2"
                                                  fill="none"
                                                />
                                              </svg>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.ModalCommentW}>
                                  <div
                                    className={styles.ModalCommentW2}
                                    role="presentation"
                                    tabIndex={-1}
                                  >
                                    <div className={styles.ModalCommentW3}>
                                      <section
                                        className={styles.ModalCommentSectionW}
                                      >
                                        <span
                                          className={styles.ModalCommentSpanW}
                                        >
                                          <div
                                            className={
                                              styles.ModalCommentSpanDivW1
                                            }
                                            role="button"
                                            tabIndex={0}
                                          >
                                            <div
                                              className={
                                                styles.ModalCommentSpanDivW2
                                              }
                                            >
                                              <span>
                                                <svg
                                                  aria-label="좋아요"
                                                  className={styles.svgW}
                                                  fill="currentColor"
                                                  height="24"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="24"
                                                >
                                                  <title>좋아요</title>
                                                  <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                                </svg>
                                              </span>
                                            </div>
                                          </div>
                                        </span>
                                        <span
                                          className={styles.ModalCommentSpanW2}
                                        >
                                          <div>
                                            <div
                                              aria-disabled="false"
                                              role="button"
                                              tabIndex={0}
                                              style={{ cursor: "pointer" }}
                                              onClick={onClickSaved}
                                            >
                                              <div
                                                className={
                                                  styles.ModalCommentSpanDivW1
                                                }
                                                role="button"
                                                tabIndex={0}
                                              >
                                                <div
                                                  className={
                                                    styles.ModalCommentSpanDivW2
                                                  }
                                                >
                                                  <svg
                                                    aria-label="저장"
                                                    className={styles.svgW}
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
                                        </span>
                                      </section>
                                      <section
                                        className={styles.ModalCommentSectionW2}
                                      >
                                        <div
                                          className={
                                            styles.ModalCommentSectionDivW
                                          }
                                        >
                                          <div
                                            className={
                                              styles.ModalCommentSectionDivW2
                                            }
                                          >
                                            <span
                                              className={
                                                styles.ModalCommentSpanW3
                                              }
                                            >
                                              <Link
                                                href="#"
                                                className={
                                                  styles.ModalCommentSpanLinkW
                                                }
                                                role="link"
                                                tabIndex={0}
                                              >
                                                <span
                                                  className={
                                                    styles.ModalCommentSpanW4
                                                  }
                                                >
                                                  {"좋아요"}
                                                  <span
                                                    className={
                                                      styles.ModalCommentSpanW5
                                                    }
                                                  >
                                                    {post._count.Comments || 0}
                                                  </span>
                                                  {"개"}
                                                </span>
                                              </Link>
                                            </span>
                                          </div>
                                        </div>
                                      </section>
                                      <div className={styles.ModalCommentDivW}>
                                        <div
                                          className={styles.ModalCommentDivW2}
                                        >
                                          <div
                                            className={styles.ModalCommentDivW3}
                                            dir="auto"
                                          >
                                            <Link
                                              className={
                                                styles.ModalCommentDivLinkW
                                              }
                                              role="link"
                                              href="#"
                                              tabIndex={0}
                                            >
                                              <span
                                                className={
                                                  styles.ModalCommentDivSpanW
                                                }
                                              >
                                                <time
                                                  className={
                                                    styles.CommentTimeTime
                                                  }
                                                >
                                                  {dayjs(
                                                    post!.createdAt
                                                  ).fromNow(true)}
                                                </time>
                                              </span>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                      {isEmoClicked ? (
                                        <section
                                          className={
                                            styles.ModalCommentSectionW3
                                          }
                                        >
                                          <div>
                                            <form
                                              className={
                                                styles.ModalCommentFormW
                                              }
                                              method="POST"
                                            >
                                              <div
                                                className={
                                                  styles.ModalCommentFormDivW
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.ModalCommentFormDivW2
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.ModalCommentFormDivW3
                                                    }
                                                    role="button"
                                                    tabIndex={0}
                                                  >
                                                    <div
                                                      className={
                                                        styles.ModalCommentFormDivW4
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="이모티콘"
                                                        onClick={onEmoClicked}
                                                        className={styles.svgW}
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>이모티콘</title>
                                                        <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                                <textarea
                                                  name="comment"
                                                  className={
                                                    styles.ModalCommentTextAreaW
                                                  }
                                                ></textarea>
                                                <div
                                                  className={
                                                    styles.ModalCommentDivW4
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.ModalCommentDivW5
                                                    }
                                                    role="button"
                                                    tabIndex={-1}
                                                  >
                                                    <span
                                                      style={{ opacity: "0.5" }}
                                                    ></span>
                                                  </div>
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </section>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          ) : (
                            <article
                              className={styles.DetailModalRootArticle}
                              role="presentation"
                              tabIndex={-1}
                            >
                              <div className={styles.DetailModalDiv}>
                                <div className={styles.DetailModalImageDiv}>
                                  <div className={styles.DetailImageDivInner}>
                                    <div
                                      className={styles.DetailImageDivInner2}
                                    >
                                      <div
                                        className={styles.DetailImageDivInner3}
                                        style={{
                                          paddingBottom: !isMobile
                                            ? "75%"
                                            : "100%",
                                        }}
                                      ></div>
                                      <div
                                        className={styles.DetailImageDivInner4}
                                      >
                                        <div
                                          className={
                                            styles.DetailImageDivInner5
                                          }
                                        >
                                          <div
                                            className={
                                              styles.DetailImageDivInner6
                                            }
                                            role="presentation"
                                          >
                                            <div
                                              style={{ width: "100%" }}
                                              className={
                                                styles.DetailImageDivInner7
                                              }
                                            >
                                              <div
                                                style={{ width: "100%" }}
                                                className={styles.liImage}
                                              >
                                                <div
                                                  className={styles.ImageDiv}
                                                  role="button"
                                                  tabIndex={0}
                                                >
                                                  <div>
                                                    <div
                                                      className={
                                                        styles.ImagePortDiv
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.ImageOuterDiv
                                                        }
                                                        style={{
                                                          paddingBottom: "75%",
                                                        }}
                                                      >
                                                        {isVideo(
                                                          post.Images[
                                                            currentNumber
                                                          ]
                                                        ) ? (
                                                          // 확장자가 mp4, avi, mov인 경우 동영상으로 간주
                                                          <div
                                                            className={
                                                              styles.videoDiv
                                                            }
                                                          >
                                                            <div
                                                              className={
                                                                styles.videoDiv2
                                                              }
                                                            >
                                                              <div
                                                                className={
                                                                  styles.videoDiv3
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.videoDiv4
                                                                  }
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles.videoDiv5
                                                                    }
                                                                  >
                                                                    <video
                                                                      ref={
                                                                        videoRef
                                                                      }
                                                                      className={
                                                                        styles.video
                                                                      }
                                                                      playsInline
                                                                      // preload="none"
                                                                      autoPlay
                                                                      loop
                                                                      muted
                                                                      // controls
                                                                      style={{
                                                                        display:
                                                                          "block",
                                                                      }}
                                                                      src={
                                                                        currentFile
                                                                      }
                                                                      crossOrigin="anonymous"
                                                                    >
                                                                      <p>
                                                                        동영상을
                                                                        로드할
                                                                        수
                                                                        없습니다.
                                                                      </p>
                                                                    </video>
                                                                    <div>
                                                                      <div
                                                                        className={
                                                                          styles.videoDiv6
                                                                        }
                                                                        onClick={
                                                                          onClickVideo
                                                                        }
                                                                      >
                                                                        <div
                                                                          className={
                                                                            styles.videoDiv66
                                                                          }
                                                                        >
                                                                          {/* {!isPlaying && (
                                                                              <div
                                                                                className={
                                                                                  styles.videoDiv8
                                                                                }
                                                                              >
                                                                                <div aria-label="재생"></div>
                                                                              </div>
                                                                            )} */}
                                                                        </div>
                                                                      </div>
                                                                      <div
                                                                        className={
                                                                          styles.videoDiv7
                                                                        }
                                                                        onClick={
                                                                          toggleMute
                                                                        }
                                                                      >
                                                                        <button
                                                                          className={
                                                                            styles.videoButton
                                                                          }
                                                                          aria-label="오디오 켜기/끄기"
                                                                        >
                                                                          <div
                                                                            className={
                                                                              styles.videoBtn
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
                                                                                  오디오를
                                                                                  재생
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
                                                                                  오디오
                                                                                  소리
                                                                                  꺼짐
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
                                                        ) : (
                                                          <Image
                                                            alt="Photo by"
                                                            width={0}
                                                            height={0}
                                                            sizes="100vw"
                                                            className={
                                                              styles.ArticleImage
                                                            }
                                                            object-fit="cover"
                                                            crossOrigin="anonymous"
                                                            decoding="auto"
                                                            src={
                                                              post.Images[
                                                                currentNumber
                                                              ]
                                                            }
                                                          />
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {/* 이전 이미지가 존재하면 */}
                                          <button
                                            aria-label="돌아가기"
                                            className={styles.BtnM}
                                            tabIndex={-1}
                                            style={{
                                              left: 0,
                                              visibility:
                                                currentNumber === 0
                                                  ? "hidden"
                                                  : "visible",
                                              pointerEvents:
                                                currentNumber === 0
                                                  ? "none"
                                                  : "auto",
                                            }}
                                          >
                                            <div
                                              className={styles.prevBtn}
                                              onClick={onClickPrevBtn}
                                            >
                                              <svg
                                                width="30"
                                                height="34"
                                                viewBox="0 0 30 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="15"
                                                  cy="17"
                                                  r="14"
                                                  fill="rgba(240, 240, 240, 0.8)"
                                                  stroke="lightgray"
                                                  strokeWidth="2"
                                                />
                                                <path
                                                  d="M18 11l-6 6 6 6"
                                                  stroke="gray"
                                                  strokeWidth="2"
                                                  fill="none"
                                                />
                                              </svg>
                                            </div>
                                          </button>
                                          <button
                                            aria-label="다음"
                                            style={{
                                              right: 0,
                                              visibility:
                                                currentNumber ===
                                                post!.Images.length - 1
                                                  ? "hidden"
                                                  : "visible",
                                              pointerEvents:
                                                currentNumber ===
                                                post!.Images.length - 1
                                                  ? "none"
                                                  : "auto",
                                            }}
                                            className={styles.BtnM}
                                            tabIndex={-1}
                                          >
                                            <div
                                              className={styles.nextBtn}
                                              onClick={onClickNextBtn}
                                            >
                                              <svg
                                                width="30"
                                                height="34"
                                                viewBox="0 0 30 34"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="15"
                                                  cy="17"
                                                  r="14"
                                                  fill="rgba(240, 240, 240, 0.8)"
                                                  stroke="lightgray"
                                                  strokeWidth="2"
                                                />
                                                <path
                                                  d="M12 11l6 6-6 6"
                                                  stroke="gray"
                                                  strokeWidth="2"
                                                  fill="none"
                                                />
                                              </svg>
                                            </div>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.DetailModalComment}>
                                  <div className={styles.DetailModalCommentDiv}>
                                    <div
                                      className={styles.DetailModalCommentDiv2}
                                      role="presentation"
                                      tabIndex={-1}
                                    >
                                      <div
                                        className={styles.CommentModalTopSide}
                                      >
                                        <div
                                          className={
                                            styles.CommentModalTopSideInner
                                          }
                                        >
                                          <header
                                            className={
                                              styles.CommentModalHeader
                                            }
                                          >
                                            <div>
                                              <div>
                                                <div>
                                                  <div
                                                    className={
                                                      styles.HeaderProfileImage
                                                    }
                                                    role="button"
                                                    aria-disabled="true"
                                                    tabIndex={-1}
                                                  >
                                                    <canvas
                                                      style={{
                                                        left: "-5px",
                                                        position: "absolute",
                                                        top: "-5px",
                                                        height: "42px",
                                                        width: "42px",
                                                      }}
                                                      className={
                                                        styles.ProfileImageCanvas
                                                      }
                                                    />
                                                    <Link
                                                      href="#"
                                                      className={
                                                        styles.ImageLink
                                                      }
                                                      role="link"
                                                      tabIndex={0}
                                                      style={{
                                                        height: "32px",
                                                        width: "32px",
                                                      }}
                                                    >
                                                      <Image
                                                        height={0}
                                                        width={0}
                                                        sizes="100vw"
                                                        src={`${user!.image}`}
                                                        alt="profile"
                                                        className={
                                                          styles.ProfileImage
                                                        }
                                                        crossOrigin="anonymous"
                                                        draggable="false"
                                                      />
                                                    </Link>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                            <div
                                              className={
                                                styles.CommentModalHeaderNickName
                                              }
                                            >
                                              <div
                                                className={
                                                  styles.HeaderNickName
                                                }
                                              >
                                                <div
                                                  className={styles.NickNameDiv}
                                                >
                                                  <div
                                                    className={
                                                      styles.NickNameDiv2
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.NickNameSpanOuter
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          styles.NickNameSpan
                                                        }
                                                      >
                                                        <span
                                                          className={
                                                            styles.NickNameInnerSpan
                                                          }
                                                        >
                                                          <div>
                                                            <Link
                                                              href="#"
                                                              role="link"
                                                              tabIndex={0}
                                                            >
                                                              {
                                                                post!
                                                                  .userNickname
                                                              }
                                                            </Link>
                                                          </div>
                                                        </span>
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                className={
                                                  styles.HeaderNickNameUnder
                                                }
                                              >
                                                <span
                                                  className={
                                                    styles.NickNameUnderSpan
                                                  }
                                                  dir="auto"
                                                ></span>
                                                <div
                                                  className={
                                                    styles.NickNameUnderDiv
                                                  }
                                                >
                                                  <div></div>
                                                </div>
                                              </div>
                                            </div>
                                          </header>
                                          <div className={styles.MoreContent}>
                                            <div>
                                              <div
                                                className={
                                                  styles.MoreContentDiv
                                                }
                                                role="button"
                                                tabIndex={0}
                                              >
                                                <div
                                                  className={
                                                    styles.MoreContentInnerDiv
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.MoreContentInnerDiv2
                                                    }
                                                    style={{
                                                      width: "24px",
                                                      height: "24px",
                                                    }}
                                                  >
                                                    <svg
                                                      className={
                                                        styles.optionSvg
                                                      }
                                                      aria-label="옵션 더 보기"
                                                      fill="currentColor"
                                                      height="24"
                                                      role="img"
                                                      width="24"
                                                      viewBox="0 0 24 24"
                                                    >
                                                      <title>
                                                        옵션 더 보기
                                                      </title>
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
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={
                                          styles.CommentModalBottomSide
                                        }
                                      >
                                        <section
                                          className={styles.EmoticonSide}
                                        >
                                          <span className={styles.iconSpan}>
                                            <div
                                              className={`${styles.iconDiv} ${
                                                isLiked ? styles.clicked : ""
                                              }`}
                                              role="button"
                                              tabIndex={0}
                                              onClick={onClickHeart}
                                            >
                                              <div
                                                className={styles.iconInnerDiv}
                                              >
                                                <span>
                                                  <svg
                                                    aria-label={
                                                      isLiked
                                                        ? "좋아요 취소"
                                                        : "좋아요"
                                                    }
                                                    className={
                                                      isLiked
                                                        ? styles.iconSvgClicked
                                                        : styles.iconSvg
                                                    }
                                                    fill="currentColor"
                                                    height="24"
                                                    role="img"
                                                    viewBox={
                                                      isLiked
                                                        ? "0 0 48 48"
                                                        : "0 0 24 24"
                                                    }
                                                    width="24"
                                                  >
                                                    <title>
                                                      {isLiked
                                                        ? "좋아요 취소"
                                                        : "좋아요"}
                                                    </title>
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
                                          <span className={styles.iconSpan_x}>
                                            <div
                                              className={styles.iconDiv}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              <div
                                                className={styles.iconInnerDiv}
                                              >
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
                                          <span className={styles.iconSpan_y}>
                                            <div>
                                              <div
                                                aria-disabled="false"
                                                role="button"
                                                tabIndex={0}
                                                style={{ cursor: "pointer" }}
                                                onClick={onClickSaved}
                                              >
                                                <div
                                                  className={styles.iconDiv}
                                                  role="button"
                                                  tabIndex={0}
                                                >
                                                  <div
                                                    className={
                                                      styles.iconInnerDiv
                                                    }
                                                  >
                                                    {isSaved ? (
                                                      <svg
                                                        aria-label="삭제"
                                                        className={
                                                          styles.iconSvg
                                                        }
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
                                                        className={
                                                          styles.iconSvg
                                                        }
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
                                          </span>
                                        </section>
                                        <section className={styles.LikeSide}>
                                          <div className={styles.LikeDiv}>
                                            <div className={styles.LikeDiv2}>
                                              <span
                                                className={styles.LikeSpan}
                                                dir="auto"
                                              >
                                                <Link
                                                  href="#"
                                                  role="link"
                                                  tabIndex={0}
                                                  className={styles.LikeLink}
                                                >
                                                  <span
                                                    className={
                                                      styles.LikeInnerSpan
                                                    }
                                                    style={{
                                                      lineHeight: "18px",
                                                    }}
                                                  >
                                                    {"좋아요 "}
                                                    <span
                                                      className={
                                                        styles.LikeCount
                                                      }
                                                    >
                                                      {post._count.Hearts || 0}
                                                    </span>
                                                    {"개"}
                                                  </span>
                                                </Link>
                                              </span>
                                            </div>
                                          </div>
                                        </section>
                                        <div className={styles.ContentSide}>
                                          <ul className={styles.ContentUl}>
                                            <div
                                              className={styles.ContentDiv}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              <li className={styles.ContentLi}>
                                                <div
                                                  className={
                                                    styles.ContentLiDiv
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.ContentInnerDiv
                                                    }
                                                  >
                                                    <div>
                                                      <div>
                                                        <div
                                                          className={
                                                            styles.ContentProfileImage
                                                          }
                                                          aria-disabled="true"
                                                          role="button"
                                                          tabIndex={-1}
                                                        >
                                                          <canvas
                                                            className={
                                                              styles.ContentProfileImageCanvas
                                                            }
                                                            style={{
                                                              left: "-5px",
                                                              position:
                                                                "absolute",
                                                              top: "-5px",
                                                              height: "42px",
                                                              width: "42px",
                                                            }}
                                                          ></canvas>
                                                          <Link
                                                            href="#"
                                                            className={
                                                              styles.ContentProfileImageCanvasLink
                                                            }
                                                            style={{
                                                              width: "32px",
                                                              height: "32px",
                                                            }}
                                                          >
                                                            <Image
                                                              width={0}
                                                              height={0}
                                                              sizes="100vw"
                                                              src={user!.image}
                                                              alt={`${
                                                                post!
                                                                  .userNickname
                                                              }님의 프로필사진`}
                                                              className={
                                                                styles.ContentProfileImageCanvasImage
                                                              }
                                                              crossOrigin="anonymous"
                                                              draggable="false"
                                                            />
                                                          </Link>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.ContentSide2
                                                      }
                                                    >
                                                      <h2
                                                        className={
                                                          styles.ContentUserName
                                                        }
                                                        tabIndex={-1}
                                                      >
                                                        <div
                                                          className={
                                                            styles.ContentUserNameDiv
                                                          }
                                                        >
                                                          <span
                                                            className={
                                                              styles.ContentUserNameSpan
                                                            }
                                                          >
                                                            <div>
                                                              <Link
                                                                href="#"
                                                                role="link"
                                                                tabIndex={0}
                                                                className={
                                                                  styles.UserNameLink
                                                                }
                                                              >
                                                                {
                                                                  post!
                                                                    .userNickname
                                                                }
                                                              </Link>
                                                            </div>
                                                          </span>
                                                        </div>
                                                      </h2>
                                                      <div
                                                        className={
                                                          styles.ContentDiv2
                                                        }
                                                      >
                                                        <h1
                                                          className={
                                                            styles.ContentDivH1
                                                          }
                                                        >
                                                          {post!.content}
                                                        </h1>
                                                        <br />
                                                        <div
                                                          className={
                                                            styles.ContentDivH1
                                                          }
                                                          style={{
                                                            fontWeight:
                                                              "normal",
                                                          }}
                                                        >
                                                          {`주소 : ${address}`}
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={
                                                          styles.CotentCreatedDate
                                                        }
                                                      >
                                                        <span
                                                          className={
                                                            styles.ContentCreatedDateSpan
                                                          }
                                                          dir="ltr"
                                                        >
                                                          <time
                                                            className={
                                                              styles.ContentCreatedTime
                                                            }
                                                          >
                                                            {dayjs(
                                                              post!.createdAt
                                                            ).fromNow(true)}
                                                          </time>
                                                          <div
                                                            className={
                                                              styles.ContentCreatedTimeUnder
                                                            }
                                                          ></div>
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </li>
                                            </div>
                                            <div
                                              className={styles.ContentOtherDiv}
                                            ></div>
                                            <div
                                              className={
                                                styles.ContentCommentDiv
                                              }
                                            >
                                              <div
                                                className={
                                                  styles.ContentCommentDiv
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.ContentCommentDiv
                                                  }
                                                >
                                                  {comments &&
                                                    comments.map(
                                                      (comment, index) => (
                                                        <Comment
                                                          key={index}
                                                          comment={comment}
                                                          postId={postId.toString()}
                                                          onClickExitBtnChild={
                                                            onClickExitBtnChild
                                                          }
                                                          ReplyInfo={ReplyInfo}
                                                        />
                                                      )
                                                    )}
                                                </div>
                                              </div>
                                            </div>
                                          </ul>
                                        </div>
                                        <div
                                          className={
                                            styles.ContentCreatedTimeSide
                                          }
                                        >
                                          <div
                                            className={
                                              styles.ContentCreatedTimeSideInner
                                            }
                                          >
                                            <div
                                              className={
                                                styles.ContentCreatedTimeSideInner2
                                              }
                                              dir="auto"
                                            >
                                              <div
                                                className={
                                                  styles.ContentCreatedTimeSideInner3
                                                }
                                                role="link"
                                                tabIndex={0}
                                              >
                                                <span
                                                  className={
                                                    styles.ContentCreatedTimeSideInner4
                                                  }
                                                >
                                                  <time
                                                    className={
                                                      styles.ContentCreatedTimeSideInner5
                                                    }
                                                  >
                                                    {dayjs(
                                                      post!.createdAt
                                                    ).fromNow(true)}
                                                  </time>
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <section
                                          className={styles.AddCommentSide}
                                        >
                                          <div>
                                            <form
                                              className={styles.AddCommentForm}
                                              method="POST"
                                            >
                                              <div
                                                className={
                                                  styles.AddCommentFormDiv
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.CommentFormEmoticon
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.CommentFormEmoticonInner
                                                    }
                                                    role="button"
                                                    tabIndex={0}
                                                  >
                                                    <div
                                                      className={
                                                        styles.EmoticonInnerDiv
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="이모티콘"
                                                        className={
                                                          styles.EmoticonSvg
                                                        }
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>이모티콘</title>
                                                        <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                                <textarea
                                                  name="comment"
                                                  onChange={onChangeTextArea}
                                                  aria-label="댓글 달기..."
                                                  placeholder="댓글 달기..."
                                                  autoComplete="off"
                                                  autoCorrect="off"
                                                  className={
                                                    styles.CommentFormArea
                                                  }
                                                  value={CommentText}
                                                />
                                                <div
                                                  className={
                                                    styles.CommentFormEnter
                                                  }
                                                >
                                                  {CommentText ? (
                                                    <div
                                                      className={
                                                        styles.OtherEnterDiv
                                                      }
                                                      role="button"
                                                      tabIndex={0}
                                                      onClick={onSubmitComment}
                                                    >
                                                      게시
                                                    </div>
                                                  ) : (
                                                    <div
                                                      className={
                                                        styles.CommentFromEnterDiv
                                                      }
                                                      role="button"
                                                      tabIndex={-1}
                                                      aria-disabled="true"
                                                    >
                                                      <span
                                                        className={
                                                          styles.EnterSpan
                                                        }
                                                      >
                                                        게시
                                                      </span>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </form>
                                          </div>
                                        </section>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </article>
                          )}
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
      <div style={{ display: isClickedExitBtn ? "block" : "none" }}>
        <div>
          <div className={styles.ExitBtn}>
            <div className={styles.ExitBtn2}>
              <div className={styles.ExitBtn3}>
                <div className={styles.ExitBtn4}></div>
                <div className={styles.ExitBtn5} tabIndex={-1}>
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
        </div>
      </div>
    </>
  );
}
