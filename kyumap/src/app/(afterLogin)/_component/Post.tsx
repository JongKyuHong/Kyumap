"use client";

import React, { ChangeEvent, forwardRef, useState, useEffect } from "react";
import styles from "./post.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { Post as IPost } from "@/model/Post";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface Props {
  post: IPost;
}

export default function Post({ post }: Props) {
  const [isClicked, setClicked] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(event.target.value);
  };

  const imgArticle = [];

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
  }, []);

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
                      href={`/profile/${post.User.id}`}
                      style={{ height: "32px", width: "32px" }}
                      className={styles.articleUserSpan}
                    >
                      <img
                        alt="프로필 사진"
                        src={`${post.User.image}`}
                        width={1}
                        height={1}
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
                                href={`/profile/${post.User.nickname}`}
                                className={styles.nameLink}
                              >
                                <div className={styles.linkInnerDiv}>
                                  <div className={styles.linkInnerDiv2}>
                                    <span className={styles.linkInnerSpan}>
                                      {post.User.id}
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
                                            <img
                                              src={
                                                post.Images[currentNumber].link
                                              }
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
                        <img
                          alt="게시글"
                          crossOrigin="anonymous"
                          src={post.Images[0].link}
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
        <div className={styles.articleContent}>
          <div className={styles.articleContentDiv}>
            <div>
              <div className={styles.postIcon}>
                <div className={styles.leftSectionIcon}>
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
                        <span className={styles.iconInnerDivSpan}>
                          <svg
                            aria-label={isClicked ? "좋아요 취소" : "좋아요"}
                            className={
                              isClicked ? styles.iconSvgClicked : styles.iconSvg
                            }
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox={isClicked ? "0 0 48 48" : "0 0 24 24"}
                            width="24"
                          >
                            <title>
                              {isClicked ? "좋아요 취소" : "좋아요"}
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
                  <span>
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
                  </span>
                </div>
                <div className={styles.rightSectionIcon}>
                  <div>
                    <div
                      aria-disabled="false"
                      role="button"
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        className={styles.iconInnerDiv2}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.iconSvgOuterDiv}>
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
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                          {"좋아요"}
                          <span className={styles.likeCountSpan}>
                            {"#좋아요 개수 불러오기#"}
                          </span>
                          {"개"}
                        </span>
                      </Link>
                    </span>
                  </div>
                </div>
              </section>
              <div className={styles.postContent}>
                <div className={styles.postUserName}>
                  <span className={styles.postUserNameSpan}>
                    <div>
                      <Link
                        href={`/profile/${post.User.nickname}`}
                        className={styles.postUserProfile}
                        role="link"
                        tabIndex={0}
                      >
                        {post.User.nickname}
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
                    <Link
                      href={`/explore/tags/${post.hashTag}`}
                      className={styles.hashTag}
                    >
                      {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                    </Link>
                  </span>
                </span>
              </div>
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
                    {"#댓글#"}
                    <span className={styles.linkCommentInnerSpan}>
                      {"#댓글갯수#"}
                    </span>
                    {"#개 모두 보기#"}
                  </span>
                </Link>
              </div>
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
                          aria-label="댓글 달기..."
                          className={styles.formInputTextArea}
                          placeholder="댓글 달기..."
                          autoComplete="off"
                          autoCorrect="off"
                          onChange={handleTextareaChange}
                          // style={{
                          //   height: "18px!important",
                          // }}
                        ></textarea>
                        {textValue ? (
                          <div className={styles.EnterBtn}>
                            <div
                              className={styles.EnterDiv}
                              role="button"
                              tabIndex={0}
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
