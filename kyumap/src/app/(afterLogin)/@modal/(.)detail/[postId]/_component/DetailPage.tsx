"use client";

import React, { useState, useCallback, useEffect } from "react";
import styles from "./detail.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useRouter, usePathname } from "next/navigation";
import relativeTime from "dayjs/plugin/relativeTime";
import { Post } from "@/model/Post";
import { Comment } from "@/model/Comment";
import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/app/(afterLogin)/_lib/getComments";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  postId: string;
};

export default function DetailPage({ postId }: Props) {
  const [isClicked, setClicked] = useState(false);
  const [CommentText, setComment] = useState("");
  const [saveIconClicked, setSaveClicked] = useState(false);
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isEmoClicked, setEmoClicked] = useState(false);

  const { data: comment } = useQuery<
    Comment[],
    Object,
    Comment[],
    [string, string, string]
  >({
    queryKey: ["posts", postId, "comments"],
    queryFn: getComments,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  const { data: post } = useQuery<Post, Object, Post, [string, string]>({
    queryKey: ["posts", postId],
    queryFn: getPost,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onChangeTextArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  useEffect(() => {
    if (post!.Images.length > 1) {
      setMultiImg(true);
    } else {
      setMultiImg(false);
    }
  }, []);

  const saveIconClick = useCallback(() => {
    setSaveClicked((prev) => !prev);
  }, [saveIconClicked]);

  const onClickXbox = useCallback(() => {
    router.back();
  }, []);

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  const onEmoClicked = () => {
    setEmoClicked(!isEmoClicked);
  };

  return (
    <div className={styles.rootModalDiv}>
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
                        {windowWidth < 737 ? (
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
                                              <img
                                                // width={32}
                                                // height={32}
                                                alt={`${
                                                  post!.User.nickname
                                                }님이 올린 사진`}
                                                src={post!.User.image}
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
                                  <div className={styles.DetailImageDivInner2}>
                                    <div
                                      className={styles.DetailImageDivInner3}
                                      style={{
                                        paddingBottom:
                                          windowWidth > 736 ? "75%" : "100%",
                                      }}
                                    ></div>
                                    <div
                                      className={styles.DetailImageDivInner4}
                                    >
                                      <div
                                        className={styles.DetailImageDivInner5}
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
                                                      <img
                                                        alt="Photo by"
                                                        className={
                                                          styles.ArticleImage
                                                        }
                                                        object-fit="cover"
                                                        crossOrigin="anonymous"
                                                        decoding="auto"
                                                        src={
                                                          post!.Images[
                                                            currentNumber
                                                          ].link
                                                        }
                                                      ></img>
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
                                              className={styles.arrow}
                                              viewBox="0 0 24 24"
                                              focusable="false"
                                              height="18"
                                              width="18"
                                            >
                                              <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                              ></path>
                                              <path d="M16.41 5.41L15 4l-8 8 8 8 1.41-1.41L9.83 12"></path>
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
                                              className={styles.arrow}
                                              viewBox="0 0 24 24"
                                              focusable="false"
                                              height="18"
                                              width="18"
                                            >
                                              <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                              ></path>
                                              <path d="M7.59 18.41L9 20l8-8-8-8-1.41 1.41L14.17 12"></path>
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
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
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
                                                  {"30"}
                                                </span>
                                                {"개"}
                                              </span>
                                            </Link>
                                          </span>
                                        </div>
                                      </div>
                                    </section>
                                    <div className={styles.ModalCommentDivW}>
                                      <div className={styles.ModalCommentDivW2}>
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
                                                {dayjs(post!.createdAt).fromNow(
                                                  true
                                                )}
                                              </time>
                                            </span>
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                    {isEmoClicked ? (
                                      <section
                                        className={styles.ModalCommentSectionW3}
                                      >
                                        <div>
                                          <form
                                            className={styles.ModalCommentFormW}
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
                                  <div className={styles.DetailImageDivInner2}>
                                    <div
                                      className={styles.DetailImageDivInner3}
                                      style={{
                                        paddingBottom:
                                          windowWidth > 736 ? "75%" : "100%",
                                      }}
                                    ></div>
                                    <div
                                      className={styles.DetailImageDivInner4}
                                    >
                                      <div
                                        className={styles.DetailImageDivInner5}
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
                                                      <img
                                                        alt="Photo by"
                                                        className={
                                                          styles.ArticleImage
                                                        }
                                                        object-fit="cover"
                                                        crossOrigin="anonymous"
                                                        decoding="auto"
                                                        src={
                                                          post!.Images[
                                                            currentNumber
                                                          ].link
                                                        }
                                                      ></img>
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
                                              className={styles.arrow}
                                              viewBox="0 0 24 24"
                                              focusable="false"
                                              height="18"
                                              width="18"
                                            >
                                              <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                              ></path>
                                              <path d="M16.41 5.41L15 4l-8 8 8 8 1.41-1.41L9.83 12"></path>
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
                                              className={styles.arrow}
                                              viewBox="0 0 24 24"
                                              focusable="false"
                                              height="18"
                                              width="18"
                                            >
                                              <path
                                                d="M0 0h24v24H0z"
                                                fill="none"
                                              ></path>
                                              <path d="M7.59 18.41L9 20l8-8-8-8-1.41 1.41L14.17 12"></path>
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
                                    <div className={styles.CommentModalTopSide}>
                                      <div
                                        className={
                                          styles.CommentModalTopSideInner
                                        }
                                      >
                                        <header
                                          className={styles.CommentModalHeader}
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
                                                    className={styles.ImageLink}
                                                    role="link"
                                                    tabIndex={0}
                                                    style={{
                                                      height: "32px",
                                                      width: "32px",
                                                    }}
                                                  >
                                                    <img
                                                      // height={32}
                                                      // width={32}
                                                      src={`${
                                                        post!.User.image
                                                      }`}
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
                                              className={styles.HeaderNickName}
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
                                                              post!.User
                                                                .nickname
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
                                              className={styles.MoreContentDiv}
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
                                                    className={styles.optionSvg}
                                                    aria-label="옵션 더 보기"
                                                    fill="currentColor"
                                                    height="24"
                                                    role="img"
                                                    width="24"
                                                    viewBox="0 0 24 24"
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
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      className={styles.CommentModalBottomSide}
                                    >
                                      <section className={styles.EmoticonSide}>
                                        <span className={styles.iconSpan}>
                                          <div
                                            className={`${styles.iconDiv} ${
                                              isClicked ? styles.clicked : ""
                                            }`}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() =>
                                              setClicked(!isClicked)
                                            }
                                          >
                                            <div
                                              className={styles.iconInnerDiv}
                                            >
                                              <span>
                                                <svg
                                                  aria-label={
                                                    isClicked
                                                      ? "좋아요 취소"
                                                      : "좋아요"
                                                  }
                                                  className={
                                                    isClicked
                                                      ? styles.iconSvgClicked
                                                      : styles.iconSvg
                                                  }
                                                  fill="currentColor"
                                                  height="24"
                                                  role="img"
                                                  viewBox={
                                                    isClicked
                                                      ? "0 0 48 48"
                                                      : "0 0 24 24"
                                                  }
                                                  width="24"
                                                >
                                                  <title>
                                                    {isClicked
                                                      ? "좋아요 취소"
                                                      : "좋아요"}
                                                  </title>
                                                  <path
                                                    d={
                                                      isClicked
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
                                            >
                                              <div
                                                className={styles.iconDiv}
                                                role="button"
                                                tabIndex={0}
                                                onClick={saveIconClick}
                                              >
                                                <div
                                                  className={
                                                    styles.iconInnerDiv
                                                  }
                                                >
                                                  {saveIconClicked ? (
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
                                                    className={styles.LikeCount}
                                                  >
                                                    {"100"}
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
                                                className={styles.ContentLiDiv}
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
                                                          <img
                                                            src={
                                                              post!.User.image
                                                            }
                                                            alt={`${
                                                              post!.User
                                                                .nickname
                                                            }님의 프로필사진`}
                                                            className={
                                                              styles.ContentProfileImageCanvasImage
                                                            }
                                                            crossOrigin="anonymous"
                                                            draggable="false"
                                                          ></img>
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
                                                              {post!.User.id}
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
                                            className={styles.ContentCommentDiv}
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
                                                {comment &&
                                                  comment.map(
                                                    (commentData, index) => (
                                                      <div
                                                        key={index}
                                                        className={
                                                          styles.CommentDiv
                                                        }
                                                      >
                                                        <ul
                                                          className={
                                                            styles.CommentUl
                                                          }
                                                        >
                                                          <div
                                                            role="button"
                                                            tabIndex={0}
                                                            className={
                                                              styles.CommentUlDiv
                                                            }
                                                          >
                                                            <li
                                                              className={
                                                                styles.CommentUlDivLi
                                                              }
                                                            >
                                                              <div
                                                                className={
                                                                  styles.CommentLiDiv
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.CommentContent
                                                                  }
                                                                >
                                                                  <div>
                                                                    <div>
                                                                      <div
                                                                        role="button"
                                                                        tabIndex={
                                                                          -1
                                                                        }
                                                                        className={
                                                                          styles.CommentUserProfileDiv
                                                                        }
                                                                      >
                                                                        <canvas
                                                                          style={{
                                                                            left: "-5px",
                                                                            position:
                                                                              "absolute",
                                                                            top: "-5px",
                                                                            height:
                                                                              "42px",
                                                                            width:
                                                                              "42px",
                                                                          }}
                                                                          className={
                                                                            styles.CommentUserProfileCanvas
                                                                          }
                                                                        ></canvas>
                                                                        <Link
                                                                          href="#"
                                                                          role="link"
                                                                          tabIndex={
                                                                            0
                                                                          }
                                                                          style={{
                                                                            height:
                                                                              "32px",
                                                                            width:
                                                                              "32px",
                                                                          }}
                                                                          className={
                                                                            styles.CommentUserProfileLink
                                                                          }
                                                                        >
                                                                          <img
                                                                            alt={`${commentData.User.id}님의 프로필 사진`}
                                                                            src={`${commentData.User.image}`}
                                                                            width={
                                                                              32
                                                                            }
                                                                            height={
                                                                              32
                                                                            }
                                                                            className={
                                                                              styles.CommentUserProfileImage
                                                                            }
                                                                            crossOrigin="anonymous"
                                                                            draggable="false"
                                                                          ></img>
                                                                        </Link>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                  <div
                                                                    className={
                                                                      styles.CommentContentInner
                                                                    }
                                                                  >
                                                                    <h3
                                                                      className={
                                                                        styles.CommentContentH3
                                                                      }
                                                                    >
                                                                      <div
                                                                        className={
                                                                          styles.CommentUserName
                                                                        }
                                                                      >
                                                                        <span
                                                                          className={
                                                                            styles.CommentUserNameSpan
                                                                          }
                                                                        >
                                                                          <div>
                                                                            <Link
                                                                              href="#"
                                                                              role="link"
                                                                              tabIndex={
                                                                                0
                                                                              }
                                                                              className={
                                                                                styles.CommentUserNameLink
                                                                              }
                                                                            >{`${commentData.User.id}`}</Link>
                                                                          </div>
                                                                        </span>
                                                                      </div>
                                                                    </h3>
                                                                    <div
                                                                      className={
                                                                        styles.CommentContentInnerDiv
                                                                      }
                                                                    >
                                                                      <span
                                                                        className={
                                                                          styles.CommentContentSpan
                                                                        }
                                                                        dir="auto"
                                                                      >
                                                                        {
                                                                          commentData.content
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                    <div
                                                                      className={
                                                                        styles.CommentContentTime
                                                                      }
                                                                    >
                                                                      <span
                                                                        className={
                                                                          styles.CommentContentTimeSpan
                                                                        }
                                                                        style={{
                                                                          lineHeight:
                                                                            "16px",
                                                                        }}
                                                                      >
                                                                        <div
                                                                          className={
                                                                            styles.CommentTimeDiv
                                                                          }
                                                                          role="link"
                                                                          tabIndex={
                                                                            0
                                                                          }
                                                                        >
                                                                          <time
                                                                            className={
                                                                              styles.CommentTimeTime
                                                                            }
                                                                          >
                                                                            {dayjs(
                                                                              commentData.createdAt
                                                                            ).fromNow(
                                                                              true
                                                                            )}
                                                                          </time>
                                                                        </div>
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                                <span
                                                                  className={
                                                                    styles.HeartSpan
                                                                  }
                                                                >
                                                                  <div
                                                                    className={
                                                                      styles.HeartSpanDiv
                                                                    }
                                                                  >
                                                                    <div
                                                                      className={
                                                                        styles.HeartSpanDiv2
                                                                      }
                                                                      role="button"
                                                                      tabIndex={
                                                                        0
                                                                      }
                                                                    >
                                                                      <div
                                                                        className={
                                                                          styles.HeartSpanDiv3
                                                                        }
                                                                      >
                                                                        <span>
                                                                          <svg
                                                                            aria-label="좋아요"
                                                                            className={
                                                                              styles.HeartSvg
                                                                            }
                                                                            fill="currentColor"
                                                                            height="12"
                                                                            role="img"
                                                                            viewBox="0 0 24 24"
                                                                            width="12"
                                                                          >
                                                                            <title>
                                                                              좋아요
                                                                            </title>
                                                                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                                                          </svg>
                                                                        </span>
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </span>
                                                              </div>
                                                            </li>
                                                          </div>
                                                        </ul>
                                                      </div>
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
                                                onChange={onChangeTextArea}
                                                aria-label="댓글 달기..."
                                                placeholder="댓글 달기..."
                                                autoComplete="off"
                                                autoCorrect="off"
                                                className={
                                                  styles.CommentFormArea
                                                }
                                              ></textarea>
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
  );
}
