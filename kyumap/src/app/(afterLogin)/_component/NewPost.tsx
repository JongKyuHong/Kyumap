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
import cx from "classnames";
import useDeviceSize from "./useDeviceSize";

export default function NewPost() {
  const [textValue, setTextValue] = useState("");
  const [isActive, setActive] = useState(false);
  const [preview, setPreview] = useState<Array<string | null>>([]);
  const [onClickRatio, setRatio] = useState(false);
  const [ratioIndex, setRatioIndex] = useState(0);
  const [ratioWidth, setWidth] = useState<number>(0);
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const router = useRouter();
  const imgRef = useRef<HTMLInputElement>(null);
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const onClickBackBtn = useCallback(() => {
    router.back();
  }, []);

  // const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setActive(true);
  // };

  // const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   setActive(false);
  // };

  const handleFileSelect = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };

  // const [preview, setPreview] = useState<Array<string | null>>([]);
  const onUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newPreviews: (string | null)[] = Array.from(e.target.files).map(
        () => null
      ); // 새로운 파일 수만큼 null로 초기화된 배열 생성

      // 이전 미리보기 데이터를 새 배열에 복사
      for (let i = 0; i < preview.length; i++) {
        newPreviews[i] = preview[i];
      }

      Array.from(e.target.files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview((prevPreview) => {
            const prev = [...prevPreview];
            prev[preview.length + index] = reader.result as string; // 이전 데이터 길이를 더해 새로운 데이터를 추가
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });

      setPreview(newPreviews); // 새로운 미리보기 배열로 업데이트
    }
  };

  const calculateSize = () => {
    if (isMobile) {
      // setWidth(378);
      return {
        maxHeight: "420px",
        maxWidth: "378px",
        minHeight: "292px",
        minWidth: "250px",
        width: "378px",
      };
    } else if (isTablet) {
      // setWidth(558);
      return {
        maxHeight: "600px",
        maxWidth: "558px",
        minHeight: "420px",
        minWidth: "378px",
        width: "558px",
      };
    } else if (isDesktop) {
      // setWidth(855);
      return {
        maxHeight: "897px",
        maxWidth: "1195px",
        minHeight: "600px",
        minWidth: "558px",
        width: "1195px",
      };
    }
  };

  const calculateImgSize = () => {
    if (isMobile) {
      // setWidth(378);
      return {
        maxHeight: "420px",
        maxWidth: "378px",
        minHeight: "292px",
        minWidth: "250px",
        width: "378px",
      };
    } else if (isTablet) {
      // setWidth(558);
      return {
        maxHeight: "600px",
        maxWidth: "558px",
        minHeight: "420px",
        minWidth: "378px",
        width: "558px",
      };
    } else if (isDesktop) {
      // setWidth(855);
      return {
        maxHeight: "700px",
        maxWidth: "855px",
        minHeight: "600px",
        minWidth: "558px",
        width: "855px",
      };
    }
  };

  const onRemovePreview = () => {
    setPreview([]);
  };

  const stopPropa = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (preview.length > 1) {
      setMultiImg(true);
    } else {
      setMultiImg(false);
    }
  }, []);

  useEffect(() => {
    console.log(preview, "prev");
  }, [preview]);

  useEffect(() => {
    if (isMobile) {
      setWidth(378);
    } else if (isTablet) {
      setWidth(558);
    } else if (isDesktop) {
      // setWidth(855);
      setWidth(855);
    }
  }, [isMobile, isTablet, isDesktop]);

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  return (
    <div className={styles.ModalMainDiv}>
      <div className={styles.ModalInnerDiv}>
        <div className={styles.ModalInnerDiv2}>
          <div className={styles.ModalInnerDiv3} onClick={onClickBackBtn}></div>
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
                  onClick={stopPropa}
                >
                  <div className={styles.ModalInnerDiv8}>
                    <div className={styles.ModalInnerDiv9} role="dialog">
                      <div
                        style={{
                          ...calculateSize(),
                        }}
                      >
                        <div
                          className={styles.ModalInnerDiv10}
                          // onDragEnter={handleDragEnter}
                          // onDragLeave={handleDragLeave}
                          onDragOver={(e) => e.preventDefault()}
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
                                          : "calc(100% + 0px)",
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
                                    {preview.length ? (
                                      <div
                                        className={styles.backarrowbtn}
                                        onClick={onRemovePreview}
                                      >
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
                                    ) : null}
                                  </div>
                                  <div className={styles.Underright}>
                                    {preview.length ? (
                                      <div className={styles.NextBtn}>
                                        <div
                                          className={styles.NextBtn2}
                                          onClick={() => {}}
                                        >
                                          공유하기
                                        </div>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.ModalBody}
                            style={{
                              width: isDesktop
                                ? "1195px"
                                : isTablet
                                ? "898px"
                                : "378px",
                              height: isDesktop
                                ? "700px"
                                : isTablet
                                ? "558px"
                                : "378px",
                            }}
                          >
                            <div
                              className={styles.ModalBodyDiv}
                              style={{ opacity: "1" }}
                            >
                              {preview.length ? (
                                <div className={styles.ImageUploadDiv}>
                                  <div className={styles.ImageUploadDiv2}>
                                    <div className={styles.ImageUploadDiv3}>
                                      {isMultiImg ? (
                                        <>
                                          <span className={styles.OtherSpan}>
                                            <div
                                              className={styles.prevBtn}
                                              onClick={onClickPrevBtn}
                                              style={{
                                                visibility:
                                                  currentNumber === 0
                                                    ? "hidden"
                                                    : "visible",
                                              }}
                                            >
                                              <div
                                                className={styles.prevBtn2}
                                                role="button"
                                              >
                                                <button
                                                  className={styles.prevBtn3}
                                                  type="button"
                                                >
                                                  <div
                                                    className={styles.prevBtn4}
                                                    role="button"
                                                  >
                                                    <svg
                                                      aria-label="왼쪽 방향 아이콘"
                                                      className={
                                                        styles.prevBtn5
                                                      }
                                                      fill="currentColor"
                                                      height="16"
                                                      role="img"
                                                      viewBox="0 0 24 24"
                                                      width="16"
                                                    >
                                                      <title>
                                                        왼쪽 방향 아이콘
                                                      </title>
                                                      <polyline
                                                        fill="none"
                                                        points="16.502 3 7.498 12 16.502 21"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                      ></polyline>
                                                    </svg>
                                                  </div>
                                                </button>
                                              </div>
                                            </div>
                                            <div
                                              className={styles.nextBtn}
                                              onClick={onClickNextBtn}
                                              style={{
                                                visibility:
                                                  currentNumber ===
                                                  preview.length - 1
                                                    ? "hidden"
                                                    : "visible",
                                              }}
                                            >
                                              <div className={styles.nextBtn2}>
                                                <button
                                                  className={styles.nextBtn3}
                                                  type="button"
                                                >
                                                  <div
                                                    className={styles.nextBtn4}
                                                  >
                                                    <svg
                                                      aria-label="오른쪽 방향 아이콘"
                                                      className={
                                                        styles.nextBtn5
                                                      }
                                                      fill="currentColor"
                                                      height="16"
                                                      role="img"
                                                      viewBox="0 0 24 24"
                                                      width="16"
                                                    >
                                                      <title>
                                                        오른쪽 방향 아이콘
                                                      </title>
                                                      <polyline
                                                        fill="none"
                                                        points="8 3 17.004 12 8 21"
                                                        stroke="currentColor"
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                      ></polyline>
                                                    </svg>
                                                  </div>
                                                </button>
                                              </div>
                                            </div>
                                            <div className={styles.slider}>
                                              <div className={styles.slider2}>
                                                {preview.map((pimg, index) => (
                                                  <div
                                                    className={styles.sliderDiv}
                                                    style={{
                                                      background:
                                                        currentNumber === index
                                                          ? "rgb(0, 149, 246)"
                                                          : "rgb(168, 168, 168)",
                                                    }}
                                                  ></div>
                                                ))}
                                              </div>
                                            </div>
                                          </span>
                                          <div className={styles.ImgTab}>
                                            <img
                                              src={`${preview[currentNumber]}`}
                                              className={styles.ImgTab2}
                                              style={{ ...calculateImgSize() }}
                                            ></img>
                                            <div
                                              className={styles.imgTab3}
                                            ></div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
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
                                                  className={
                                                    styles.ImageRatioBtn
                                                  }
                                                  type="button"
                                                  onClick={handleFileSelect}
                                                >
                                                  <div
                                                    className={
                                                      styles.ImageRatio5
                                                    }
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
                                                // ...calWidthHeight(),
                                                ...calculateImgSize(),
                                                alignItems: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                              }}
                                            >
                                              <img
                                                className={styles.ImageDiv}
                                                src={`${preview[0]}`}
                                                style={{
                                                  // ...calWidthHeight(),
                                                  ...calculateImgSize(),
                                                }}
                                              ></img>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className={styles.ModalBodyInnerDiv}>
                                    <div
                                      className={styles.ModalBodyInnerDiv2}
                                      // onDragOver={(e) => {
                                      //   e.preventDefault();
                                      //   handleDragEnter(e);
                                      // }}
                                      // onDragLeave={(e) => {
                                      //   e.preventDefault();
                                      //   handleDragLeave(e);
                                      // }}
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
                                </>
                              )}
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
                            </div>
                            <div
                              className={styles.rightBody}
                              style={{ opacity: "1" }}
                            >
                              <div className={styles.rightBody2}>
                                <div className={styles.rightBody3}>
                                  <div>
                                    <div className={styles.bodyInnerText}>
                                      <div className={styles.profileArea}></div>
                                      <div>
                                        <div className={styles.InnerTextArea}>
                                          <div className={styles.textHeader}>
                                            <div
                                              aria-label="문구를 입력하세요..."
                                              className={styles.textHeader2}
                                              contentEditable="true"
                                              suppressContentEditableWarning={
                                                true
                                              }
                                              role="textbox"
                                              spellCheck="true"
                                              tabIndex={0}
                                              style={{
                                                userSelect: "text",
                                                whiteSpace: "pre-wrap",
                                                wordBreak: "break-word",
                                              }}
                                            >
                                              <p className={styles.textP}>
                                                {textValue ? (
                                                  <span>{textValue}</span>
                                                ) : (
                                                  <br />
                                                )}
                                              </p>
                                            </div>
                                            <div className={styles.textHeader3}>
                                              {"문구를 입력하세요..."}
                                            </div>
                                          </div>
                                          <div className={styles.textBody}>
                                            <div className={styles.textEmo}>
                                              <button
                                                className={styles.EmoBtn}
                                                type="button"
                                              >
                                                <div className={styles.EmoBtn2}>
                                                  <svg
                                                    aria-label="이모티콘"
                                                    className={styles.Emoticon}
                                                    fill="currentColor"
                                                    height="20"
                                                    role="img"
                                                    viewBox="0 0 24 24"
                                                    width="20"
                                                  >
                                                    <title>이모티콘</title>
                                                    <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                                                  </svg>
                                                </div>
                                              </button>
                                              <div
                                                style={{
                                                  top: "5px",
                                                  right: "5px",
                                                }}
                                              ></div>
                                            </div>
                                            <div className={styles.textEnter}>
                                              <span
                                                className={styles.textEnterSpan}
                                              >
                                                <div
                                                  className={styles.textEnter2}
                                                >
                                                  <span
                                                    style={{
                                                      lineHeight: "16px",
                                                    }}
                                                    dir="auto"
                                                    className={
                                                      styles.textEnterSpan2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.textEnterSpan3
                                                      }
                                                    >
                                                      0
                                                    </span>
                                                    /
                                                    <span
                                                      className={
                                                        styles.textEnterSpan3
                                                      }
                                                    >
                                                      2200
                                                    </span>
                                                  </span>
                                                </div>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div
                              className={styles.ModalBodyUnderDiv}
                              style={{ opacity: "1" }}
                            >
                              <div className={styles.ModalBodyUnderDiv2}>
                                <div
                                  className={styles.ModalBodyUnderDiv3}
                                ></div>
                              </div>
                            </div> */}
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
