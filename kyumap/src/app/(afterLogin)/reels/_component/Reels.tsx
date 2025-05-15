"use client";

import Link from "next/link";
import styles from "./reels.module.css";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEventHandler,
} from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUser } from "@/app/(afterLogin)/_lib/getUser"; // 유저 정보를 가져오는 함수
import MoreInfoOverlay from "../../_component/Post/MoreInfoOverlay";
import { useRouter, usePathname } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IPost } from "@/model/Post";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";
import {
  useHeart,
  useSave,
  useUnheart,
  useUnsave,
} from "../../_lib/mutateFactory";

type Props = {
  post: any;
};

function Reels({ post }: Props) {
  const { data: session } = useSession();
  const [isMuted, setMuted] = useState(true);
  const [isMoreInfo, setMoreInfo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFollowed, setFollowed] = useState(false);
  const [isSaved, setSaved] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isLiked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [HeartsCount, setHeartsCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", session?.user?.email as string],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // 좋아요 저장됨 상태 업데이트
  useEffect(() => {
    if (userData) {
      const ssave = !!userData?.Saved.find(
        (v: any) => v.id === post?.postId.toString()
      );

      const liked = !!post?.Hearts?.find(
        (v: any) => v.email === session?.user?.email
      );
      setLiked(liked);
      setSaved(ssave);
      setHeartsCount(post._count.Hearts);
    }
  }, [userData, post, session?.user?.email]);

  const heart = useHeart({ setIsLiking, isLiking });

  const unheart = useUnheart({ setIsLiking, isLiking });

  const saved = useSave({ setSaved });

  const unsaved = useUnsave({ setSaved });
  // 릴스 클릭 시
  const onClickVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  //
  const onClickMoreInfo = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setMoreInfo(!isMoreInfo);
  };

  // 음소거 토글
  const toggleMute = () => {
    setMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const onClickMenu = () => {
    setIsMenu(true);
  };

  const closeMenu = () => {
    setIsMenu(false);
  };

  const onOpenDetail = useCallback(() => {
    setIsMenu(false);
    router.push(`/detailInfo/${post.postId}`);
  }, [router, post.postId]);

  const onClickHeart: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isLiking) return;
    if (isLiked) {
      // 이미 좋아요를 눌렀으면
      unheart.mutate({ postId: post.postId, session });
    } else {
      heart.mutate({ postId: post.postId, session });
    }
  };

  const onClickSaved: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isSaved) {
      // 이미 저장함
      unsaved.mutate({ postId: post.postId, session });
    } else {
      saved.mutate({ postId: post.postId, session });
    }
  };

  if (userLoading) return <LoadingComponent />;

  return (
    <>
      <div className={styles.rootDiv2}>
        <div className={styles.rootDiv3}>
          <div
            className={styles.rootDiv4}
            // style={{ height: "820px", width: "461px" }}
          >
            <div className={styles.rootDiv6}>
              <div className={styles.rootDiv7}>
                <div className={styles.rootDiv8}>
                  <div className={styles.rootDiv9}>
                    <div className={styles.rootDiv10}>
                      <div className={styles.rootDiv11}>
                        <video
                          ref={videoRef}
                          src={`${post.Images}`}
                          className={styles.video}
                          playsInline
                          preload="auto"
                          autoPlay
                          loop
                          muted
                          style={{ display: "block" }}
                          crossOrigin="anonymous"
                        >
                          <p>동영상을 로드할 수 없습니다.</p>
                        </video>
                        <div>
                          <div className={styles.rootDiv12}>
                            <div className={styles.rootDiv13}>
                              <div className={styles.rootDiv14}>
                                <div
                                  className={styles.rootDiv15}
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className={styles.header}>
                                    <div
                                      className={styles.muteDiv}
                                      onClick={toggleMute}
                                    >
                                      {isMuted ? (
                                        <svg
                                          aria-label="오디오 소리 꺼짐"
                                          className={styles.muteSvg}
                                          fill="currentColor"
                                          height="16"
                                          role="img"
                                          viewBox="0 0 48 48"
                                          width="16"
                                        >
                                          <title>오디오 소리 꺼짐</title>
                                          <path
                                            clipRule="evenodd"
                                            d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z"
                                            fillRule="evenodd"
                                          ></path>
                                        </svg>
                                      ) : (
                                        <svg
                                          aria-label="오디오를 재생 중입니다"
                                          className={styles.muteSvg}
                                          fill="currentColor"
                                          height="16"
                                          role="img"
                                          viewBox="0 0 24 24"
                                          width="16"
                                        >
                                          <title>오디오를 재생 중입니다</title>
                                          <path d="M16.636 7.028a1.5 1.5 0 10-2.395 1.807 5.365 5.365 0 011.103 3.17 5.378 5.378 0 01-1.105 3.176 1.5 1.5 0 102.395 1.806 8.396 8.396 0 001.71-4.981 8.39 8.39 0 00-1.708-4.978zm3.73-2.332A1.5 1.5 0 1018.04 6.59 8.823 8.823 0 0120 12.007a8.798 8.798 0 01-1.96 5.415 1.5 1.5 0 002.326 1.894 11.672 11.672 0 002.635-7.31 11.682 11.682 0 00-2.635-7.31zm-8.963-3.613a1.001 1.001 0 00-1.082.187L5.265 6H2a1 1 0 00-1 1v10.003a1 1 0 001 1h3.265l5.01 4.682.02.021a1 1 0 001.704-.814L12.005 2a1 1 0 00-.602-.917z"></path>
                                        </svg>
                                      )}

                                      <div className={styles.muteDiv2}></div>
                                    </div>
                                  </div>
                                  <div
                                    className={styles.body}
                                    style={{ width: "100%" }}
                                    onClick={onClickVideo}
                                  >
                                    <div
                                      className={styles.body2}
                                      style={{ maxHeight: "108px" }}
                                    >
                                      <div className={styles.bodyHeader}>
                                        <Link
                                          aria-label={`${post.userNickname}님의 릴스`}
                                          href={`/profile/${post.userNickname}`}
                                          className={styles.profileLink}
                                        >
                                          <div className={styles.profileLink2}>
                                            <div
                                              className={styles.profileLink3}
                                            >
                                              <div>
                                                <span
                                                  className={
                                                    styles.profileImage
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
                                                    alt={`${post.userNickname}님의 프로필`}
                                                    src={`${userData!.image}`}
                                                    className={
                                                      styles.profileImage2
                                                    }
                                                  />
                                                </span>
                                              </div>
                                            </div>
                                            <span
                                              className={styles.bodyHeader2}
                                              style={{ lineHeight: "18px" }}
                                            >
                                              {post.userNickname}
                                            </span>
                                          </div>
                                        </Link>
                                        <div className={styles.followBtn}>
                                          <span className={styles.dotSpan}>
                                            <span
                                              className={styles.dotSpan2}
                                              style={{ lineHeight: "18px" }}
                                            >
                                              {"•"}
                                            </span>
                                          </span>
                                          <div
                                            className={styles.followBtn2}
                                            role="button"
                                          >
                                            {isFollowed ? "팔로잉" : "팔로우"}
                                          </div>
                                        </div>
                                      </div>
                                      {isMoreInfo ? (
                                        <div
                                          className={styles.moreInfo}
                                          onClick={onClickMoreInfo}
                                        >
                                          <span
                                            className={styles.moreInfoSpan}
                                            style={{ lineHeight: "18px" }}
                                          >
                                            {post.content || " "}
                                          </span>
                                          <span
                                            aria-hidden="true"
                                            className={styles.bodySpan2}
                                          >
                                            {"접기"}
                                          </span>
                                        </div>
                                      ) : (
                                        // <MoreInfoOverlay postId={post.postId} />
                                        <div
                                          role="button"
                                          style={{ cursor: "pointer" }}
                                          aria-disabled="false"
                                          onClick={onClickMoreInfo}
                                        >
                                          <div className={styles.bodyBody}>
                                            <div className={styles.bodyBody2}>
                                              <span className={styles.bodySpan}>
                                                {post.content.length > 10
                                                  ? `${post.content.slice(
                                                      0,
                                                      10
                                                    )}...`
                                                  : post.content || " "}
                                              </span>
                                              {post.content.length > 10 && (
                                                <span
                                                  aria-hidden="true"
                                                  className={styles.bodySpan2}
                                                >
                                                  {"더 보기"}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      <div className={styles.bodyFooter}></div>
                                    </div>
                                  </div>
                                </div>
                                {!isPlaying ? (
                                  <div
                                    className={styles.rootDiv16}
                                    style={{
                                      opacity: "1",
                                      transform: "none",
                                    }}
                                  >
                                    <div
                                      aria-label="재생하려면 누르세요"
                                      className={styles.play}
                                      role="button"
                                    >
                                      <div className={styles.play2}>
                                        <svg
                                          aria-label="재생 버튼 아이콘"
                                          className={styles.playSvg}
                                          fill="currentColor"
                                          height="24"
                                          role="img"
                                          viewBox="0 0 24 24"
                                          width="24"
                                        >
                                          <title>재생 버튼 아이콘</title>
                                          <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className={styles.rootDiv16}
                                    style={{
                                      opacity: "0",
                                      transform: "scale(0)",
                                    }}
                                  >
                                    <div
                                      aria-label="재생하려면 누르세요"
                                      className={styles.play}
                                      role="button"
                                    >
                                      <div className={styles.play2}>
                                        <svg
                                          aria-label="재생 버튼 아이콘"
                                          className={styles.playSvg}
                                          fill="currentColor"
                                          height="24"
                                          role="img"
                                          viewBox="0 0 24 24"
                                          width="24"
                                        >
                                          <title>재생 버튼 아이콘</title>
                                          <path d="M5.888 22.5a3.46 3.46 0 0 1-1.721-.46l-.003-.002a3.451 3.451 0 0 1-1.72-2.982V4.943a3.445 3.445 0 0 1 5.163-2.987l12.226 7.059a3.444 3.444 0 0 1-.001 5.967l-12.22 7.056a3.462 3.462 0 0 1-1.724.462Z"></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
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
          </div>
          <div className={styles.rootDiv5}>
            <div className={styles.hearts}>
              <span>
                <div
                  className={styles.hearts2}
                  role="button"
                  onClick={onClickHeart}
                >
                  <div className={styles.hearts3}>
                    {isLiked ? (
                      <span className={styles.heartsSpan}>
                        <svg
                          aria-label="좋아요 취소"
                          className={styles.heartsCancel}
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 48 48"
                          width="24"
                        >
                          <title>좋아요 취소</title>
                          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
                        </svg>
                      </span>
                    ) : (
                      <span>
                        <svg
                          aria-label="좋아요"
                          className={styles.heartsSvg}
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
                    )}
                  </div>
                </div>
              </span>
              <div className={styles.heartsCnt} role="button">
                <div className={styles.heartsCnt2}>
                  <div className={styles.heartsCnt3}>
                    <span
                      className={styles.heartsCnt4}
                      style={{ lineHeight: "16px" }}
                    >
                      <span className={styles.heartsCnt5}>{HeartsCount}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Link
              href={`/detailInfo/${post.postId}`}
              className={styles.comments}
            >
              <div className={styles.comments2}>
                <div className={styles.comments3}>
                  <svg
                    aria-label="댓글"
                    className={styles.commentsSvg}
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>댓글</title>
                    <path
                      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                  <div className={styles.commentsCnt}>
                    <div className={styles.commentsCnt2}>
                      <span
                        className={styles.commentsCnt3}
                        style={{ lineHeight: "16px" }}
                        dir="auto"
                      >
                        <span className={styles.commentsCnt4}>
                          {post._count.Comments}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <div className={styles.saved}>
              <div>
                <div
                  style={{ cursor: "pointer" }}
                  role="button"
                  aria-disabled="false"
                  onClick={onClickSaved}
                >
                  <div className={styles.savedDiv}>
                    <div className={styles.savedDiv2}>
                      {isSaved ? (
                        <svg
                          aria-label="삭제"
                          className={styles.savedSvg}
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
                          className={styles.savedSvg}
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
            <div className={styles.threeDotInfo}>
              <div
                className={styles.threeDotInfo2}
                role="button"
                onClick={onClickMenu}
              >
                <div className={styles.threeDotInfo3}>
                  <svg
                    aria-label="더 보기"
                    className={styles.threeDotInfoSvg}
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>더 보기</title>
                    <circle cx="12" cy="12" r="1.5"></circle>
                    <circle cx="6" cy="12" r="1.5"></circle>
                    <circle cx="18" cy="12" r="1.5"></circle>
                  </svg>
                </div>
              </div>
            </div>
            <div className={styles.profileImg}>
              <Link
                href={`/profile/${post.userNickname}`}
                className={styles.profileImgLink}
              >
                <div className={styles.profileImg2}>
                  <div className={styles.profileImg3}>
                    <Image
                      className={styles.profileImg5}
                      style={{ objectFit: "cover" }}
                      src={`${userData!.image}`}
                      alt={`${post.userNickname}님의 프로필`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div className={styles.profileImg4}></div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.underDiv}
        style={{ height: "16px", width: "100%" }}
      ></div>
      {isMenu && (
        <MoreInfoOverlay
          postId={post.postId}
          onClose={closeMenu}
          onOpenDetail={onOpenDetail}
        />
      )}
    </>
  );
}

export default React.memo(Reels, (prevProps, nextProps) => {
  return (
    prevProps.post.postId === nextProps.post.postId &&
    prevProps.post._count.Hearts === nextProps.post._count.Hearts &&
    prevProps.post._count.Comments === nextProps.post._count.Comments
  );
});
