"use client";

import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import styles from "./smallscreenvernewpost.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SmallScreenVerNewPost() {
  const [fileOpen, setFileOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!fileOpen && fileInputRef.current) {
      fileInputRef.current.click();
      //setFileOpen(true);
    }

    // const BackHome = () => {
    //   router.back();
    //   setFileOpen(false);
    // };

    // if (fileOpen) {
    //   window.addEventListener("click", BackHome);
    // }

    // return () => {
    //   window.removeEventListener("click", BackHome);
    // };
  }, [fileOpen]);

  const onClickBackBtn = () => {
    router.back();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // 첫 번째 파일만 선택합니다.

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreview(e.target.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container2}>
          <div className={styles.container3}>
            <div className={styles.container4}>
              <div className={styles.header}>
                <section className={styles.header2}>
                  <div className={styles.header3}>
                    <header className={styles.header4}>
                      <div className={styles.header5}>
                        <div className={styles.xbox}>
                          <button
                            className={styles.xboxBtn}
                            onClick={onClickBackBtn}
                          >
                            <svg
                              aria-label="닫기"
                              className={styles.XboxSvg}
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>닫기</title>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                x1="21"
                                x2="3"
                                y1="3"
                                y2="21"
                              ></line>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                x1="21"
                                x2="3"
                                y1="21"
                                y2="3"
                              ></line>
                            </svg>
                          </button>
                        </div>
                        <h1 className={styles.headerH1} tabIndex={-1}>
                          {"새로운 사진 게시물"}
                        </h1>
                        <div className={styles.nextBtn}>
                          <button className={styles.nextBtn2}>{"다음"}</button>
                        </div>
                      </div>
                      <div className={styles.body}>
                        <div className={styles.body2}>
                          <div className={styles.body3}>
                            <div className={styles.body4}>
                              <div className={styles.body5}>
                                <Image
                                  src={preview!}
                                  alt={"previewImage"}
                                  height={0}
                                  width={0}
                                  sizes="100vw"
                                  priority={true}
                                  style={{
                                    // height: "100%",
                                    // width: "150%",
                                    left: "-25%",
                                    position: "absolute",
                                    top: "0%",
                                    transform: "rotate(0deg)",
                                    transformOrigin: "50% 50%",
                                    transition: "all 0.2s ease 0s",
                                  }}
                                  className={styles.bodyImg}
                                />
                              </div>
                              <div className={styles.body6}>
                                <textarea
                                  className={styles.textarea}
                                  placeholder="여기에 내용을 입력하세요..."
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </header>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </>
  );
}
