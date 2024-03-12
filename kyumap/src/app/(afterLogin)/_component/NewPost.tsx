"use client";

import React, {
  ChangeEventHandler,
  ReactEventHandler,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import styles from "./newpost.module.css";
import { useRouter } from "next/navigation";
import Cropper from "react-easy-crop";
import cx from "classnames";

export default function NewPost() {
  const [isActive, setActive] = useState(false);
  const [preview, setPreview] = useState<Array<string | null>>([]);
  const [onClickRatio, setRatio] = useState(false);
  const [ratioIndex, setRatioIndex] = useState(0);
  const router = useRouter();
  const imgRef = useRef<HTMLInputElement>(null);

  const onClickBackBtn = useCallback(() => {
    router.back();
  }, []);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setActive(false);
  };

  const handleFileSelect = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };

  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (e.target.files) {
      Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview];
            prev[index] = reader.result as string;
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  useEffect(() => {
    console.log(preview);
  }, [preview]);

  const onClickRatioBtn = () => {
    setRatio(!onClickRatio);
    console.log(onClickRatio, "asdf");
  };

  return (
    <div className={styles.ModalMainDiv}>
      <div className={styles.ModalInnerDiv}>
        <div className={styles.ModalInnerDiv2}>
          <div className={styles.ModalInnerDiv3}></div>
          <div className={styles.ModalXbox} onClick={onClickBackBtn}>
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
                        <div
                          className={styles.ModalInnerDiv10}
                          onDragEnter={handleDragEnter}
                          onDragOver={(e) => e.preventDefault()}
                          onDragLeave={handleDragLeave}
                        >
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
                                      style={{
                                        width: preview.length
                                          ? "calc(100% - 120px)"
                                          : "calc(100% + 0px);",
                                      }}
                                    >
                                      <div className={styles.HeaderDiv}>
                                        {preview.length
                                          ? "자르기"
                                          : "새 게시물 만들기"}
                                      </div>
                                    </h1>
                                  </div>
                                  <div className={styles.Underleft}>
                                    {preview.length && (
                                      <div className={styles.backarrowbtn}>
                                        <div
                                          className={styles.backarrowbtn2}
                                          role="button"
                                          tabIndex={0}
                                        >
                                          <div className={styles.backarrowbtn3}>
                                            <span
                                              className={styles.backarrowbtn4}
                                              style={{
                                                display: "inline-block",
                                                transform: "rotate(0deg)",
                                              }}
                                            >
                                              <svg
                                                aria-label="돌아가기"
                                                className={
                                                  styles.backarrowbtnSvg
                                                }
                                                fill="currentColor"
                                                height="24"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="24"
                                              >
                                                <title>돌아가기</title>
                                                <line
                                                  fill="none"
                                                  stroke="currentColor"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  stroke-width="2"
                                                  x1="2.909"
                                                  x2="22.001"
                                                  y1="12.004"
                                                  y2="12.004"
                                                ></line>
                                                <polyline
                                                  fill="none"
                                                  points="9.276 4.726 2.001 12.004 9.276 19.274"
                                                  stroke="currentColor"
                                                  stroke-linecap="round"
                                                  stroke-linejoin="round"
                                                  stroke-width="2"
                                                ></polyline>
                                              </svg>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.Underright}>
                                    {preview.length && (
                                      <div className={styles.NextBtn}>
                                        <div className={styles.NextBtn2}>
                                          다음
                                        </div>
                                      </div>
                                    )}
                                  </div>
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
                              {preview.length ? (
                                <div className={styles.ImageUploadDiv}>
                                  <div className={styles.ImageUploadDiv2}>
                                    <div className={styles.ImageUploadDiv3}>
                                      <div className={styles.ImageRatio}>
                                        <div className={styles.ImageRatio2}>
                                          <div
                                            className={styles.ImageRatio3}
                                            style={{ maxWidth: "100%" }}
                                          >
                                            {onClickRatio && (
                                              <div
                                                aria-hidden="false"
                                                className={styles.hiddenDiv}
                                              >
                                                <div
                                                  className={styles.NormalRatio}
                                                  role="button"
                                                  tabIndex={0}
                                                  onClick={() =>
                                                    setRatioIndex(0)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.NormalRatio2
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.NormalRatiotext
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "18px",
                                                          color:
                                                            ratioIndex === 0
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        dir="auto"
                                                        className={
                                                          styles.NormalRatioSpan
                                                        }
                                                      >
                                                        {"원본"}
                                                      </span>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.NormalRatioSvg
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="사진 윤곽선 아이콘"
                                                        style={{
                                                          color:
                                                            ratioIndex === 0
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        className={
                                                          styles.NormalRatioSvg2
                                                        }
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>
                                                          사진 윤곽선 아이콘
                                                        </title>
                                                        <path
                                                          d="M6.549 5.013A1.557 1.557 0 1 0 8.106 6.57a1.557 1.557 0 0 0-1.557-1.557Z"
                                                          fill-rule="evenodd"
                                                        ></path>
                                                        <path
                                                          d="m2 18.605 3.901-3.9a.908.908 0 0 1 1.284 0l2.807 2.806a.908.908 0 0 0 1.283 0l5.534-5.534a.908.908 0 0 1 1.283 0l3.905 3.905"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          stroke-linejoin="round"
                                                          stroke-width="2"
                                                        ></path>
                                                        <path
                                                          d="M18.44 2.004A3.56 3.56 0 0 1 22 5.564h0v12.873a3.56 3.56 0 0 1-3.56 3.56H5.568a3.56 3.56 0 0 1-3.56-3.56V5.563a3.56 3.56 0 0 1 3.56-3.56Z"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          stroke-linecap="round"
                                                          stroke-linejoin="round"
                                                          stroke-width="2"
                                                        ></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                                <hr
                                                  className={styles.DivHr}
                                                ></hr>
                                                <div
                                                  className={styles.NormalRatio}
                                                  role="button"
                                                  tabIndex={0}
                                                  onClick={() =>
                                                    setRatioIndex(1)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.NormalRatio2
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.NormalRatiotext
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "18px",
                                                          color:
                                                            ratioIndex === 1
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        dir="auto"
                                                        className={
                                                          styles.NormalRatioSpan
                                                        }
                                                      >
                                                        {"1:1"}
                                                      </span>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.NormalRatioSvg
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="정사각형 자르기 아이콘"
                                                        style={{
                                                          color:
                                                            ratioIndex === 1
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        className={
                                                          styles.NormalRatioSvg2
                                                        }
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>
                                                          정사각형 자르기 아이콘
                                                        </title>
                                                        <path d="M19 23H5a4.004 4.004 0 0 1-4-4V5a4.004 4.004 0 0 1 4-4h14a4.004 4.004 0 0 1 4 4v14a4.004 4.004 0 0 1-4 4ZM5 3a2.002 2.002 0 0 0-2 2v14a2.002 2.002 0 0 0 2 2h14a2.002 2.002 0 0 0 2-2V5a2.002 2.002 0 0 0-2-2Z"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                                <hr
                                                  className={styles.DivHr}
                                                ></hr>
                                                <div
                                                  className={styles.NormalRatio}
                                                  role="button"
                                                  tabIndex={0}
                                                  onClick={() =>
                                                    setRatioIndex(2)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.NormalRatio2
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.NormalRatiotext
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "18px",
                                                          color:
                                                            ratioIndex === 2
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        dir="auto"
                                                        className={
                                                          styles.NormalRatioSpan
                                                        }
                                                      >
                                                        {"4:5"}
                                                      </span>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.NormalRatioSvg
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="세로 방향 자르기 아이콘"
                                                        style={{
                                                          color:
                                                            ratioIndex === 2
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        className={
                                                          styles.NormalRatioSvg2
                                                        }
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>
                                                          세로 방향 자르기
                                                          아이콘
                                                        </title>
                                                        <path d="M16 23H8a4.004 4.004 0 0 1-4-4V5a4.004 4.004 0 0 1 4-4h8a4.004 4.004 0 0 1 4 4v14a4.004 4.004 0 0 1-4 4ZM8 3a2.002 2.002 0 0 0-2 2v14a2.002 2.002 0 0 0 2 2h8a2.002 2.002 0 0 0 2-2V5a2.002 2.002 0 0 0-2-2Z"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                                <hr
                                                  className={styles.DivHr}
                                                ></hr>
                                                <div
                                                  className={styles.NormalRatio}
                                                  role="button"
                                                  tabIndex={0}
                                                  onClick={() =>
                                                    setRatioIndex(3)
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.NormalRatio2
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.NormalRatiotext
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "18px",
                                                          color:
                                                            ratioIndex === 3
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        dir="auto"
                                                        className={
                                                          styles.NormalRatioSpan
                                                        }
                                                      >
                                                        {"16:9"}
                                                      </span>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.NormalRatioSvg
                                                      }
                                                    >
                                                      <svg
                                                        aria-label="가로 방향 자르기 아이콘"
                                                        style={{
                                                          color:
                                                            ratioIndex === 3
                                                              ? "rgb(255,255,255)"
                                                              : "rgb(115,115,115)",
                                                        }}
                                                        className={
                                                          styles.NormalRatioSvg2
                                                        }
                                                        fill="currentColor"
                                                        height="24"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="24"
                                                      >
                                                        <title>
                                                          가로 방향 자르기
                                                          아이콘
                                                        </title>
                                                        <path d="M19 20H5a4.004 4.004 0 0 1-4-4V8a4.004 4.004 0 0 1 4-4h14a4.004 4.004 0 0 1 4 4v8a4.004 4.004 0 0 1-4 4ZM5 6a2.002 2.002 0 0 0-2 2v8a2.002 2.002 0 0 0 2 2h14a2.002 2.002 0 0 0 2-2V8a2.002 2.002 0 0 0-2-2Z"></path>
                                                      </svg>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <div>
                                            <div
                                              className={styles.ImageRatio4}
                                              role="button"
                                            >
                                              <button
                                                className={styles.ImageRatioBtn}
                                                type="button"
                                                onClick={onClickRatioBtn}
                                              >
                                                <div
                                                  className={styles.ImageRatio5}
                                                  role="button"
                                                >
                                                  <svg
                                                    aria-label="자르기 선택"
                                                    className={
                                                      styles.ImageRatioSvg
                                                    }
                                                    fill="currentColor"
                                                    height="16"
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    width="16"
                                                  >
                                                    <title>자르기 선택</title>
                                                    <path d="M10 20H4v-6a1 1 0 0 0-2 0v7a1 1 0 0 0 1 1h7a1 1 0 0 0 0-2ZM20.999 2H14a1 1 0 0 0 0 2h5.999v6a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1Z"></path>
                                                  </svg>
                                                </div>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.ImageZoom}>
                                        <div className={styles.ImageRatio2}>
                                          <div
                                            className={styles.ImageRatio3}
                                            style={{ maxWidth: "100%" }}
                                          ></div>
                                          <div>
                                            <div
                                              className={styles.ImageRatio4}
                                              role="button"
                                            >
                                              <button
                                                className={styles.ImageRatioBtn}
                                                type="button"
                                              >
                                                <div
                                                  className={styles.ImageRatio5}
                                                  role="button"
                                                >
                                                  <svg
                                                    aria-label="확대/축소 선택"
                                                    className={
                                                      styles.ImageRatioSvg
                                                    }
                                                    fill="currentColor"
                                                    height="16"
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    width="16"
                                                  >
                                                    <title>
                                                      확대/축소 선택
                                                    </title>
                                                    <path d="m22.707 21.293-4.825-4.825a9.519 9.519 0 1 0-1.414 1.414l4.825 4.825a1 1 0 0 0 1.414-1.414ZM10.5 18.001a7.5 7.5 0 1 1 7.5-7.5 7.509 7.509 0 0 1-7.5 7.5Zm3.5-8.5h-2.5v-2.5a1 1 0 1 0-2 0v2.5H7a1 1 0 1 0 0 2h2.5v2.5a1 1 0 0 0 2 0v-2.5H14a1 1 0 0 0 0-2Z"></path>
                                                  </svg>
                                                </div>
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        className={styles.MultiImage}
                                        style={{ width: "100%" }}
                                      >
                                        <div className={styles.MultiImage2}>
                                          <div
                                            className={styles.MultiImage3}
                                            style={{ maxWidth: "100%" }}
                                          ></div>
                                          <div
                                            className={styles.ImageRatio4}
                                            role="button"
                                          >
                                            <button
                                              className={styles.ImageRatioBtn}
                                            >
                                              <div
                                                className={styles.ImageRatio5}
                                              >
                                                <svg
                                                  aria-label="미디어 갤러리 열기"
                                                  className={
                                                    styles.ImageRatioSvg
                                                  }
                                                  fill="currentColor"
                                                  height="16"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="16"
                                                >
                                                  <title>
                                                    미디어 갤러리 열기
                                                  </title>
                                                  <path
                                                    d="M19 15V5a4.004 4.004 0 0 0-4-4H5a4.004 4.004 0 0 0-4 4v10a4.004 4.004 0 0 0 4 4h10a4.004 4.004 0 0 0 4-4ZM3 15V5a2.002 2.002 0 0 1 2-2h10a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2H5a2.002 2.002 0 0 1-2-2Zm18.862-8.773A.501.501 0 0 0 21 6.57v8.431a6 6 0 0 1-6 6H6.58a.504.504 0 0 0-.35.863A3.944 3.944 0 0 0 9 23h6a8 8 0 0 0 8-8V9a3.95 3.95 0 0 0-1.138-2.773Z"
                                                    fill-rule="evenodd"
                                                  ></path>
                                                </svg>
                                              </div>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                      <div role="presentation">
                                        <div
                                          style={{
                                            height: "692px",
                                            width: "692px",
                                            alignItems: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                          }}
                                        >
                                          <img
                                            className={styles.ImageDiv}
                                            // style={{
                                            //   backgroundImage: `${preview[0].dataUrl}`,
                                            // }}
                                            src={`${preview[0]}`}
                                          ></img>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.ModalBodyInnerDiv}>
                                    <div
                                      className={styles.ModalBodyInnerDiv2}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                        handleDragEnter(e);
                                      }}
                                      onDragLeave={(e) => {
                                        e.preventDefault();
                                        handleDragLeave(e);
                                      }}
                                    >
                                      <svg
                                        aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                                        className={styles.ModalBodySvg}
                                        fill={
                                          isActive
                                            ? "rgb(0, 149, 246)"
                                            : "black"
                                        }
                                        height={77}
                                        role="img"
                                        viewBox="0 0 97.6 77.3"
                                        width={96}
                                      >
                                        <title>
                                          이미지나 동영상과 같은 미디어를
                                          나타내는 아이콘
                                        </title>
                                        <path
                                          d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                          fill={
                                            isActive
                                              ? "rgb(0, 149, 246)"
                                              : "black"
                                          }
                                        ></path>
                                        <path
                                          d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                          fill={
                                            isActive
                                              ? "rgb(0, 149, 246)"
                                              : "black"
                                          }
                                        ></path>
                                        <path
                                          d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                          fill={
                                            isActive
                                              ? "rgb(0, 149, 246)"
                                              : "black"
                                          }
                                        ></path>
                                      </svg>
                                      <div
                                        className={styles.ModalBodyInnerDiv3}
                                      >
                                        <span
                                          className={styles.ModalBodyInnerSpan}
                                        >
                                          {
                                            "사진과 동영상을 여기에 끌어다 놓으세요"
                                          }
                                        </span>
                                      </div>
                                      <div
                                        className={styles.ModalBodyInnerDiv4}
                                      >
                                        <div
                                          className={styles.ModalBodyInnerDiv5}
                                        >
                                          <button
                                            className={styles.ModalBodyInnerBtn}
                                            onClick={handleFileSelect}
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
                                      onChange={onUpload}
                                    ></input>
                                  </form>
                                </>
                              )}
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
