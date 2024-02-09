"use client";

import React, { useState, useCallback } from "react";
import styles from "./detail.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Detail() {
  const [isClicked, setClicked] = useState(false);
  const [saveIconClicked, setSaveClicked] = useState(false);

  console.log("pageDetail");

  const saveIconClick = useCallback(() => {
    setSaveClicked((prev) => !prev);
  }, [saveIconClicked]);

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
                        <article
                          className={styles.DetailModalRootArticle}
                          role="presentation"
                          tabIndex={-1}
                        >
                          <div
                            className={styles.DetailModalDiv}
                            style={{
                              maxWidth: "inherit",
                              maxHeight: "inherit",
                            }}
                          >
                            <div
                              style={{
                                maxHeight: "1223px",
                                maxWidth: "978.4px",
                                aspectRatio: "1440 / 1800",
                                flexBasis: "978.4px",
                              }}
                              className={styles.DetailModalImageDiv}
                            >
                              <div className={styles.DetailImageDivInner}>
                                <div className={styles.DetailImageDivInner2}>
                                  <div
                                    className={styles.DetailImageDivInner3}
                                    style={{ paddingBottom: "75%" }}
                                  ></div>
                                  <div className={styles.DetailImageDivInner4}>
                                    <div
                                      className={styles.DetailImageDivInner5}
                                    >
                                      <div
                                        className={styles.DetailImageDivInner6}
                                        role="presentation"
                                      >
                                        <div
                                          className={
                                            styles.DetailImageDivInner7
                                          }
                                        >
                                          <ul className={styles.DetailImageUl}>
                                            {/* 첫번째 li안에는 이미지 갯수 * 1223 (해상도에따라 다름) 아래 li들은 이미지 총 개수만큼*/}
                                            <li
                                              style={{
                                                transform: "translageX(1223px)",
                                                width: "1px",
                                              }}
                                            ></li>
                                            <li
                                              className={styles.ImageLi}
                                              tabIndex={-1}
                                              style={{
                                                transform: "translageX(0px)",
                                              }}
                                            >
                                              <div
                                                style={{ width: "1223px" }}
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
                                                        <Image
                                                          alt="Photo by"
                                                          className={
                                                            styles.ArticleImage
                                                          }
                                                          objectFit="cover"
                                                          crossOrigin="anonymous"
                                                          decoding="auto"
                                                          width={1223}
                                                          height={921}
                                                          src="/chi.png"
                                                        ></Image>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      {/* 이전 이미지가 존재하면 */}
                                      <button
                                        aria-label="돌아가기"
                                        className={styles.prevBtn}
                                        tabIndex={-1}
                                      ></button>
                                      <button
                                        aria-label="다음"
                                        className={styles.nextBtn}
                                        tabIndex={-1}
                                      ></button>
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
                                                >
                                                  <Image
                                                    src="/chi.png"
                                                    alt="profile"
                                                    width="32"
                                                    height="32"
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
                                      </header>
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
                                          onClick={() => setClicked(!isClicked)}
                                        >
                                          <div className={styles.iconInnerDiv}>
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
                                                className={styles.iconInnerDiv}
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </article>
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
