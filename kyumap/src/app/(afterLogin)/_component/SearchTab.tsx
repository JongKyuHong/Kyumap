"use client";

import React, { ChangeEvent, useState } from "react";
import styles from "./searchtab.module.css";
import Link from "next/link";
import Image from "next/image";
import chi from "../../../../public/chi.png";
import SearchResult from "./SearchResult";

export default function SearchTab() {
  const [isSearchHistory, setSearchHistory] = useState(true);
  const [searchInput, setInput] = useState("");

  const onChangeInputData = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!e.target.value) {
      setSearchHistory(true);
    }
  };

  const onClickSearch = () => {
    setSearchHistory(false);
  };

  const recentHistory = {
    User: {
      id: "jongkyu",
      image: "/chi.png",
      nickname: "jongkyuboy",
    },
  };

  return (
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
                      onChange={onChangeInputData}
                    ></input>
                    <div className={styles.searchBarDiv}></div>
                    <div
                      className={styles.searchBarDiv2}
                      style={{ cursor: "pointer" }}
                      aria-disabled="false"
                      aria-label="검색란 지우기"
                      role="button"
                      onClick={onClickSearch}
                      tabIndex={0}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.XboxSvg}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ flexShrink: 0, marginRight: "8px" }} // 인라인 스타일 적용
                      >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {isSearchHistory ? (
                <>
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
                            href={`/profile/${recentHistory.User.id}`}
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
                                            href={`/profile/${recentHistory.User.id}`}
                                            role="link"
                                            style={{
                                              height: "44px",
                                              width: "44px",
                                            }}
                                            className={styles.profileLink}
                                          >
                                            <Image
                                              width={0}
                                              height={0}
                                              sizes="100vw"
                                              src={recentHistory.User.image}
                                              alt="profile이미지"
                                              draggable="false"
                                              crossOrigin="anonymous"
                                              className={
                                                styles.profileLinkImage
                                              }
                                            />
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
                                            {recentHistory.User.id}
                                          </span>
                                        </div>
                                        <span
                                          style={{ lineHeight: "18px" }}
                                          className={styles.profileBodySpan}
                                        >
                                          <span
                                            className={styles.profileBodySpan2}
                                          >
                                            {recentHistory.User.nickname}
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
                </>
              ) : (
                <ul className={styles.searchBarUl}>
                  <SearchResult searchParams={searchInput} />
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
