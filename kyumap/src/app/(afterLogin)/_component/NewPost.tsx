"use client";

import React, { useCallback, useRef } from "react";
import styles from "./newpost.module.css";
import { useRouter } from "next/navigation";

export default function NewPost() {
  const router = useRouter();
  const imgRef = useRef<HTMLInputElement>(null);

  const onClickBackBtn = useCallback(() => {
    router.back();
  }, []);

  return (
    <div className={styles.ModalMainDiv}>
      <div className={styles.ModalInnerDiv}>
        <div className={styles.ModalInnerDiv2}>
          <div className={styles.ModalInnerDiv3} onClick={onClickBackBtn}></div>
          <div className={styles.ModalXbox}>
            <div className={styles.ModalXboxInner} role="button" tabIndex={0}>
              <div className={styles.ModalXboxDiv}>
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
          <div className={styles.ModalInnerDiv4} tabIndex={-1}>
            <div className={styles.ModalInnerDiv5}>
              <div className={styles.ModalInnerDiv6}>
                <div
                  className={styles.ModalInnerDiv7}
                  aria-label="새 게시물 만들기"
                  role="dialog"
                >
                  <div className={styles.ModalInnerDiv8}>
                    <div className={styles.ModalInnerDiv9} role="dialog">
                      <div
                        style={{
                          maxHeight: "898px",
                          maxWidth: "855px",
                          minHeight: "391px",
                          minWidth: "348px",
                          width: "692px",
                        }}
                      >
                        <div className={styles.ModalInnerDiv10}>
                          <div className={styles.ModalInnerDiv11}>
                            <div
                              className={styles.ModalHeader}
                              style={{ width: "100%" }}
                            >
                              <div className={styles.ModalHeader2}>
                                <div className={styles.ModalHeader3}>
                                  <div
                                    className={styles.ModalHeader4}
                                    style={{ width: "100%", height: "100%" }}
                                    dir="auto"
                                    tabIndex={-1}
                                  >
                                    <h1
                                      className={styles.HeaderH1}
                                      dir="auto"
                                      tabIndex={-1}
                                      style={{ width: "calc(100% + 0px);" }}
                                    >
                                      <div className={styles.HeaderDiv}>
                                        새 게시물 만들기
                                      </div>
                                    </h1>
                                  </div>
                                  <div className={styles.Underleft}></div>
                                  <div className={styles.Underright}></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.ModalBody}
                            style={{ width: "692px" }}
                          >
                            <div
                              className={styles.ModalBodyDiv}
                              style={{ opacity: "1" }}
                            >
                              <div className={styles.ModalBodyInnerDiv}>
                                <div className={styles.ModalBodyInnerDiv2}>
                                  <svg
                                    aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                                    className={styles.ModalBodySvg}
                                    fill="currentColor"
                                    height={77}
                                    role="img"
                                    viewBox="0 0 97.6 77.3"
                                    width={96}
                                  >
                                    <title>
                                      이미지나 동영상과 같은 미디어를 나타내는
                                      아이콘
                                    </title>
                                    <path
                                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                      fill="currentColor"
                                    ></path>
                                    <path
                                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                      fill="currentColor"
                                    ></path>
                                    <path
                                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                      fill="currentColor"
                                    ></path>
                                  </svg>
                                  <div className={styles.ModalBodyInnerDiv3}>
                                    <span className={styles.ModalBodyInnerSpan}>
                                      {"사진과 동영상을 여기에 끌어다 놓으세요"}
                                    </span>
                                  </div>
                                  <div className={styles.ModalBodyInnerDiv4}>
                                    <div className={styles.ModalBodyInnerDiv5}>
                                      <button
                                        className={styles.ModalBodyInnerBtn}
                                      >
                                        {"컴퓨터에서 선택"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <form
                                className={styles.ModalBodyForm}
                                method="POST"
                                role="presentation"
                                encType="multipart/form-data"
                              >
                                <input
                                  className={styles.FormInput}
                                  accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime"
                                  multiple
                                  type="file"
                                  ref={imgRef}
                                ></input>
                              </form>
                            </div>
                            <div
                              className={styles.ModalBodyUnderDiv}
                              style={{ opacity: "1" }}
                            >
                              <div className={styles.ModalBodyUnderDiv2}>
                                <div
                                  className={styles.ModalBodyUnderDiv3}
                                ></div>
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
  );
}
