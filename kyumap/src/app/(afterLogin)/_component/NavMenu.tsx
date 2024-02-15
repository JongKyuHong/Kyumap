"use client";
import React from "react";
import styles from "./navmenu.module.css";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
{
}
export default function NavMenu() {
  const segment = useSelectedLayoutSegment();

  return (
    <div className={styles.nav}>
      <div>
        <div className={styles.navDiv}>
          <span className={styles.navSpan}>
            <div className={styles.navSpanDiv}>
              <Link className={styles.navLink} href="/home">
                <div className={styles.LinkDiv}>
                  {segment === "home" ? (
                    <>
                      <div>
                        <div className={styles.navIconWrapper}>
                          <div className={styles.navIcon}>
                            <svg
                              aria-label="홈"
                              className={styles.Icon}
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>홈</title>
                              <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.navTitle}>
                        <div className={styles.titleOuter}>
                          <span
                            className={styles.titleInner}
                            style={{ fontWeight: 700 }}
                          >
                            <span className={styles.titleSpan}>홈</span>
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className={styles.navIconWrapper}>
                          <div className={styles.navIcon}>
                            <svg
                              aria-label="홈"
                              className={styles.Icon}
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>홈</title>
                              <path
                                d="M9.005 16.545a2.997 2.997 0 0 1 2.997-2.997A2.997 2.997 0 0 1 15 16.545V22h7V11.543L12 2 2 11.543V22h7.005Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinejoin="round"
                                strokeWidth="2"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.navTitle}>
                        <div className={styles.titleOuter}>
                          <span className={styles.titleInner}>
                            <span className={styles.titleSpan}>홈</span>
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            </div>
          </span>
        </div>
      </div>
      <div>
        <div className={styles.navDiv}>
          <span className={styles.navSpan}>
            <div className={styles.navSpanDiv}>
              <Link className={styles.navLink} href="/explore">
                {segment === "explore" ? (
                  <>
                    <div className={styles.LinkDiv}>
                      <div>
                        <div className={styles.navIconWrapper}>
                          <div className={styles.navIcon}>
                            <svg
                              aria-label="검색"
                              className={styles.Icon}
                              fill="currentColor"
                              height="24"
                              role="img"
                              viewBox="0 0 24 24"
                              width="24"
                            >
                              <title>검색</title>
                              <path
                                d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                              ></path>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                x1="16.511"
                                x2="21.643"
                                y1="16.511"
                                y2="21.643"
                              ></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className={styles.navTitle}>
                        <div className={styles.titleOuter}>
                          <span
                            className={styles.titleInner}
                            style={{ fontWeight: 700 }}
                          >
                            <span className={styles.titleSpan}>검색</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.LinkDiv}>
                    <div>
                      <div className={styles.navIconWrapper}>
                        <div className={styles.navIcon}>
                          <svg
                            aria-label="검색"
                            className={styles.Icon}
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <title>검색</title>
                            <path
                              d="M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            ></path>
                            <line
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              x1="16.511"
                              x2="22"
                              y1="16.511"
                              y2="22"
                            ></line>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className={styles.navTitle}>
                      <div className={styles.titleOuter}>
                        <span className={styles.titleInner}>
                          <span className={styles.titleSpan}>검색</span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          </span>
        </div>
      </div>
      <div>
        <div className={styles.navDiv}>
          <span className={styles.navSpan}>
            <div className={styles.navSpanDiv}>
              <Link className={styles.navLink} href="/AddPost">
                <div className={styles.LinkDiv}>
                  <div>
                    <div className={styles.navIconWrapper}>
                      <div className={styles.navIcon}>
                        <svg
                          aria-label="새로운 게시물"
                          className={styles.Icon}
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <title>새로운 게시물</title>
                          <path
                            d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          ></path>
                          <line
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            x1="6.545"
                            x2="17.455"
                            y1="12.001"
                            y2="12.001"
                          ></line>
                          <line
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            x1="12.003"
                            x2="12.003"
                            y1="6.545"
                            y2="17.455"
                          ></line>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className={styles.navTitle}>
                    <div className={styles.titleOuter}>
                      <span className={styles.titleInner}>
                        <span className={styles.titleSpan}>새로운 게시물</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
}
