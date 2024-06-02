"use client";

import React, { ChangeEvent, forwardRef, useState, useEffect } from "react";
import styles from "./post.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { IPost } from "@/model/Post";
import ActionButtons from "./ActionButtons";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface Props {
  post: IPost;
}

export default function Post({ post }: Props) {
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const imgArticle = [];

  console.log(post, "component post.tsx에서 post출력");

  for (let i = 0; i < post.Images.length; i++) {
    imgArticle.push(
      <div
        key={i}
        style={{ opacity: currentNumber == i ? 1 : "" }}
        className={styles.selectImg}
      ></div>
    );
  }

  useEffect(() => {
    if (post.Images.length > 1) {
      setMultiImg(true);
    } else {
      setMultiImg(false);
    }
  }, [post.Images.length]);

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  return (
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
                      href={`/profile/${post.User.email}`}
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
                                href={`${process.env.NEXT_PUBLIC_BASE_URL}/profile/${post.User.email}`}
                                className={styles.nameLink}
                              >
                                <div className={styles.linkInnerDiv}>
                                  <div className={styles.linkInnerDiv2}>
                                    <span className={styles.linkInnerSpan}>
                                      {post.User.email}
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
                <div className={styles.articleMoreInfo3}>
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
                                          </div>
                                          <div
                                            className={styles.InnerDivM3}
                                          ></div>
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
                        <Image
                          width={0}
                          height={0}
                          sizes="100vw"
                          alt="게시글"
                          crossOrigin="anonymous"
                          src={post.Images[0]}
                          className={styles.postImage}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div className={styles.bodyInnerDiv4Outer}></div>
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
  );
}
