"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import styles from "./post.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { IPost } from "@/model/Post";
import ActionButtons from "./ActionButtons";
import { useSession } from "next-auth/react";
import PostMenu from "./PostMenu";
import { useRouter } from "next/navigation";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface Props {
  post: IPost;
}

export default function Post({ post }: Props) {
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const [isMuted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isUserPaused, setIsUserPaused] = useState(false); // 사용자가 직접 일시정지했는지 여부
  const [isMenu, setMenu] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const imgArticle = [];

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        if (videoRef.current && !isPlaying && !isUserPaused) {
          videoRef.current.play().catch((error) => {
            console.log("Autoplay prevented: ", error);
          });
          setIsPlaying(true);
        }
      } else {
        if (videoRef.current && isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      }
    },
    [isPlaying, isUserPaused]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // 비디오의 50%가 보일 때 트리거
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [handleIntersection]);

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  const getFileExtension = (url: any) => {
    return url.split(".").pop();
  };

  // console.log(post, "post오류뜨나?");
  const currentFile = post.Images[currentNumber];

  const fileExtension = getFileExtension(currentFile);

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

  const toggleMute = () => {
    setMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    if (post && post.Images.length > 1) {
      setMultiImg(true);
    } else {
      setMultiImg(false);
    }
  }, [post]);

  for (let i = 0; i < post.Images.length; i++) {
    imgArticle.push(
      <div
        key={i}
        style={{ opacity: currentNumber == i ? 1 : "" }}
        className={styles.selectImg}
      ></div>
    );
  }

  const onClickMenu = () => {
    // setMenu(!isMenu);
    router.push(`/home/${post.postId}`);
  };

  const onClickRemoveComment = () => {};

  if (!post) return null;

  return (
    <>
      <article>
        <div className={styles.articleDiv}>
          <div className={styles.articleHead}>
            <div className={styles.articleHeadDiv}>
              <div className={styles.articleHeadInnerDiv}>
                <div>
                  <div>
                    <div
                      className={styles.articleUserImage}
                      aria-disabled="true"
                      role="button"
                      tabIndex={0}
                    >
                      <canvas
                        className={styles.articleUserImageCanvas}
                        style={{
                          left: "-5px",
                          position: "absolute",
                          top: "-5px",
                          height: "42px",
                          width: "42px",
                        }}
                      ></canvas>
                      <Link
                        href={`/profile/${post?.User?.nickname}`}
                        style={{ height: "32px", width: "32px" }}
                        className={styles.articleUserSpan}
                      >
                        <Image
                          alt="프로필 사진"
                          src={`${post.User.image}`}
                          width={32}
                          height={32}
                          className={styles.articleUserProfileImage}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.articleUserName}>
                <div className={styles.userNameInner}>
                  <div className={styles.userNameInnerDiv}>
                    <div>
                      <div className={styles.userName}>
                        <span
                          className={styles.userNameSpan}
                          style={{
                            lineHeight: "18px",
                          }}
                        >
                          <span className={styles.nameInnerSpan}>
                            <span className={styles.nameInnerSpan2}>
                              <div>
                                <Link
                                  href={`/profile/${post?.User?.nickname}`}
                                  className={styles.nameLink}
                                >
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.linkInnerDiv2}>
                                      <span className={styles.linkInnerSpan}>
                                        {post.User.nickname}
                                      </span>
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className={styles.articleDay}>
                      <span className={styles.articleDaySpan}>
                        <span className={styles.articleDayInnerSpan} dir="auto">
                          {"•"}
                        </span>
                      </span>
                      <div className={styles.articleDayDiv}>
                        <Link href="#" className={styles.articleDayLink}>
                          <span className={styles.articleDayLinkSpan}>
                            <time className={styles.articleDayTime}>
                              {dayjs(post.createdAt).fromNow(true)}
                            </time>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.articleMoreInfo}>
                <div className={styles.articleMoreInfo2}>
                  <div
                    className={styles.articleMoreInfo3}
                    // onClick={onClickMenu}
                  >
                    <Link href={`/home/${post.postId}`}>
                      <div className={styles.articleMoreInfo4}>
                        <div
                          className={styles.articleMoreInfo5}
                          style={{
                            width: "24px",
                            height: "24px",
                          }}
                        >
                          <svg
                            className={styles.articleMoreInfoSvg}
                            style={{
                              fill: "currentcolor",
                              width: "24px",
                              height: "24px",
                            }}
                          >
                            <title>옵션 더 보기</title>
                            <circle cx="12" cy="12" r="1.5"></circle>
                            <circle cx="6" cy="12" r="1.5"></circle>
                            <circle cx="18" cy="12" r="1.5"></circle>
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.articleBody}>
            <div
              className={styles.articleBodyDiv}
              role="button"
              aria-hidden="true"
              tabIndex={0}
            >
              <div className={styles.bodyInnerDiv}>
                {isMultiImg ? (
                  <div className={styles.bodyInnerDiv2M}>
                    <div className={styles.bodyInnerDiv3M}>
                      <div className={styles.bodyInnerDiv4M}>
                        <div
                          className={styles.bodyInnerDiv5M}
                          style={{ paddingBottom: "125.115%" }}
                        ></div>
                        <div className={styles.bodyInnerDiv6M}>
                          <div className={styles.bodyInnerDiv7M}>
                            <div
                              className={styles.bodyInnerDiv8M}
                              role="presentation"
                            >
                              <div className={styles.bodyInnerDiv9M}>
                                <ul className={styles.Imgul}>
                                  <li
                                    style={{
                                      transform: "translateX(1871px)",
                                      width: "1px",
                                    }}
                                  ></li>
                                  <li
                                    className={styles.Imgli}
                                    style={{ transform: "translateX(0px)" }}
                                    tabIndex={-1}
                                  >
                                    <div style={{ width: "468px" }}>
                                      <div className={styles.liDiv}>
                                        <div>
                                          <div className={styles.InnerDivM}>
                                            <div
                                              className={styles.InnerDivM2}
                                              style={{
                                                paddingBottom: "125%",
                                              }}
                                            >
                                              {fileExtension.match(
                                                /(mp4|avi|mov)$/i
                                              ) ? (
                                                // 확장자가 mp4, avi, mov인 경우 동영상으로 간주
                                                <div
                                                  className={styles.videoDiv}
                                                >
                                                  <div
                                                    className={styles.videoDiv2}
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
                                                            ref={videoRef}
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
                                                              display: "block",
                                                            }}
                                                            src={currentFile}
                                                            crossOrigin="anonymous"
                                                          >
                                                            <p>
                                                              동영상을 로드할 수
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
                                                                {!isPlaying && (
                                                                  <div
                                                                    className={
                                                                      styles.videoDiv8
                                                                    }
                                                                  >
                                                                    <div aria-label="재생"></div>
                                                                  </div>
                                                                )}
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
                                                  width={0}
                                                  height={0}
                                                  sizes="100vw"
                                                  src={
                                                    post.Images[currentNumber]
                                                  }
                                                  alt={
                                                    post.altTexts[currentNumber]
                                                      ? post.altTexts[
                                                          currentNumber
                                                        ]
                                                      : "사용자님의 사진"
                                                  }
                                                  crossOrigin="anonymous"
                                                  style={{ objectFit: "cover" }}
                                                  className={styles.ImgM}
                                                />
                                              )}
                                            </div>
                                            {/* <div
                                            className={styles.InnerDivM3}
                                          ></div> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <button
                              aria-label="돌아가기"
                              style={{
                                left: 0,
                                visibility:
                                  currentNumber === 0 ? "hidden" : "visible",
                                pointerEvents:
                                  currentNumber === 0 ? "none" : "auto",
                              }}
                              className={styles.BtnM}
                              tabIndex={-1}
                            >
                              <div
                                className={styles.prevBtn}
                                onClick={onClickPrevBtn}
                              >
                                <svg
                                  className={styles.arrow}
                                  viewBox="0 0 24 24"
                                  focusable="false"
                                  height="18"
                                  width="18"
                                >
                                  <path d="M0 0h24v24H0z" fill="none"></path>
                                  <path d="M16.41 5.41L15 4l-8 8 8 8 1.41-1.41L9.83 12"></path>
                                </svg>
                              </div>
                            </button>
                            <button
                              aria-label="다음"
                              style={{
                                right: 0,
                                visibility:
                                  currentNumber === imgArticle.length - 1
                                    ? "hidden"
                                    : "visible",
                                pointerEvents:
                                  currentNumber === imgArticle.length - 1
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
                                  className={styles.arrow}
                                  viewBox="0 0 24 24"
                                  focusable="false"
                                  height="18"
                                  width="18"
                                >
                                  <path d="M0 0h24v24H0z" fill="none"></path>
                                  <path d="M7.59 18.41L9 20l8-8-8-8-1.41 1.41L14.17 12"></path>
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.NumberOfA}>{imgArticle}</div>
                  </div>
                ) : (
                  <div className={styles.bodyInnerDiv2}>
                    <div className={styles.bodyInnerDivDiv}>
                      <div className={styles.bodyInnerDiv3}>
                        <div
                          className={styles.bodyInnerDiv4}
                          style={{ paddingBottom: "125.04%" }}
                        >
                          {fileExtension.match(/(mp4|avi|mov)$/i) ? (
                            // 확장자가 mp4, avi, mov인 경우 동영상으로 간주
                            <div className={styles.videoDiv}>
                              <div className={styles.videoDiv2}>
                                <div className={styles.videoDiv3}>
                                  <div className={styles.videoDiv4}>
                                    <div className={styles.videoDiv5}>
                                      <video
                                        ref={videoRef}
                                        className={styles.video}
                                        playsInline
                                        // preload="none"
                                        muted
                                        autoPlay
                                        loop
                                        // controls
                                        style={{
                                          display: "block",
                                        }}
                                        src={currentFile}
                                        crossOrigin="anonymous"
                                      >
                                        <p>동영상을 로드할 수 없습니다.</p>
                                      </video>
                                      <div>
                                        <div
                                          className={styles.videoDiv6}
                                          onClick={onClickVideo}
                                        >
                                          <div className={styles.videoDiv66}>
                                            {!isPlaying && (
                                              <div className={styles.videoDiv8}>
                                                <div aria-label="재생"></div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className={styles.videoDiv7}
                                          onClick={toggleMute}
                                        >
                                          <button
                                            className={styles.videoButton}
                                            aria-label="오디오 켜기/끄기"
                                          >
                                            <div className={styles.videoBtn}>
                                              {!isMuted ? (
                                                <svg
                                                  aria-label="오디오를 재생 중입니다"
                                                  className={styles.audioSvg}
                                                  fill="currentColor"
                                                  height="12"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="12"
                                                >
                                                  <title>
                                                    오디오를 재생 중입니다
                                                  </title>
                                                  <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z"></path>
                                                </svg>
                                              ) : (
                                                <svg
                                                  aria-label="오디오 소리 꺼짐"
                                                  className={styles.audioSvg}
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
                          ) : (
                            <Image
                              width={0}
                              height={0}
                              sizes="100vw"
                              src={post.Images[currentNumber]}
                              alt="사용자님의 사진"
                              crossOrigin="anonymous"
                              style={{ objectFit: "cover" }}
                              className={styles.ImgM}
                            />
                          )}
                        </div>
                        {/* <div className={styles.bodyInnerDiv4Outer}></div> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.articleBodyFooter}></div>
          </div>
          <ActionButtons post={post} />
        </div>
      </article>
      {/* {isMenu && <PostMenu post={post}  onClickMenu={onClickMenu} />} */}
    </>
  );
}
