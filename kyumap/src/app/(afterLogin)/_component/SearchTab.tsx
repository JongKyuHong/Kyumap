import React from "react";
import styles from "./searchtab.module.css";
import Link from "next/link";
import Image from "next/image";
import chi from "../../../../public/chi.png";

export default function SearchTab() {
  return (
    <div style={{ transform: "translateX(0%)" }} className={styles.container}>
      <div className={styles.containerDiv}>
        <div style={{ opacity: "1" }} className={styles.containerDiv2}>
          <div className={styles.barHeader}>
            <div>
              <span
                style={{ lineHeight: "30px" }}
                dir="auto"
                className={styles.headerSpan}
              >
                {"검색"}
              </span>
            </div>
          </div>
          <div className={styles.barBody}>
            <div className={styles.barBody2}>
              <div className={styles.barBody3}>
                <div className={styles.searchBar}>
                  <div>
                    <div className={styles.searchBarInner}>
                      <input
                        className={styles.searchBarInput}
                        aria-label="입력 검색"
                        autoCapitalize="none"
                        placeholder="검색"
                        type="text"
                      ></input>
                      <div className={styles.searchBarDiv}></div>
                      <div
                        className={styles.searchBarDiv2}
                        style={{ cursor: "pointer" }}
                        aria-disabled="false"
                        aria-label="검색란 지우기"
                        role="button"
                        tabIndex={0}
                      >
                        <svg
                          // onClick={onInputRemove}
                          aria-label="닫기"
                          className={styles.XboxSvg}
                          fill="currentColor"
                          height="16"
                          width="16"
                          role="img"
                          viewBox="0 0 24 24"
                        >
                          <title>닫기</title>
                          <polyline
                            fill="none"
                            points="20.643 3.357 12 12 3.353 20.647"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                          ></polyline>
                          <line
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="3"
                            x1="20.649"
                            x2="3.354"
                            y1="20.649"
                            y2="3.354"
                          ></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className={styles.searchBarHr}></hr>
                <div className={styles.searchBarDiv3}>
                  <div className={styles.searchBarDiv4}>
                    <div className={styles.searchBarDiv5}>
                      <div className={styles.searchBarDiv6}>
                        <span
                          style={{ lineHeight: "20px" }}
                          dir="auto"
                          className={styles.searchBarDivSpan}
                        >
                          {"최근 검색 항목"}
                        </span>
                        <div
                          className={styles.allClear}
                          role="button"
                          tabIndex={0}
                        >
                          모두 지우기
                        </div>
                      </div>
                      <ul className={styles.searchBarUl}>
                        <Link
                          href="#"
                          className={styles.recentLink}
                          role="link"
                          tabIndex={0}
                        >
                          <div className={styles.linkInnerDiv}>
                            <div className={styles.linkInnerDiv3}>
                              <div className={styles.linkInnerDiv4}>
                                <div className={styles.profileImage}>
                                  <div className={styles.profileImage2}>
                                    <div className={styles.profileImage3}>
                                      <object type="nested/pressable">
                                        <Link
                                          href="#"
                                          role="link"
                                          style={{
                                            height: "44px",
                                            width: "44px",
                                          }}
                                          className={styles.profileLink}
                                        >
                                          <Image
                                            src={chi}
                                            alt="profile이미지"
                                            draggable="false"
                                            crossOrigin="anonymous"
                                            className={styles.profileLinkImage}
                                          ></Image>
                                        </Link>
                                      </object>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.profileBody}>
                                  <div className={styles.profileBody2}>
                                    <div className={styles.profileBody3}>
                                      <div className={styles.profileBody4}>
                                        <span
                                          style={{ lineHeight: "18px" }}
                                          className={styles.profileId}
                                        >
                                          {"사용자 아이디"}
                                        </span>
                                      </div>
                                      <span
                                        style={{ lineHeight: "18px" }}
                                        className={styles.profileBodySpan}
                                      >
                                        <span
                                          className={styles.profileBodySpan2}
                                        >
                                          {"사용자 이름"}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.profileXbox}>
                                  <div className={styles.profileXbox2}>
                                    <div
                                      className={styles.profileXbox3}
                                      role="button"
                                      tabIndex={0}
                                    >
                                      <div className={styles.profileXbox4}>
                                        <svg
                                          aria-label="닫기"
                                          className={styles.XboxSvg}
                                          fill="currentColor"
                                          height="16"
                                          role="img"
                                          viewBox="0 0 24 24"
                                          width="16"
                                        >
                                          <title>닫기</title>
                                          <polyline
                                            fill="none"
                                            points="20.643 3.357 12 12 3.353 20.647"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="3"
                                          ></polyline>
                                          <line
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="3"
                                            x1="20.649"
                                            x2="3.354"
                                            y1="20.649"
                                            y2="3.354"
                                          ></line>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.linkInnerDiv2}
                            role="none"
                            style={{ inset: "0px" }}
                          ></div>
                        </Link>
                      </ul>
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
