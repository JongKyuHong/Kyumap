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
  };

  const onClickSearch = () => {
    setSearchHistory(!isSearchHistory);
  };

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
                  </>
                ) : (
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
                          <SearchResult searchParams={searchInput} />
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
