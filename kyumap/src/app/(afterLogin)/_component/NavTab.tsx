"use client";

import React, { useState } from "react";
import styles from "./navtab.module.css";
import Image from "next/image";
import smallLogo from "../../../../public/smallLogo.png";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import MenuDetail from "./MenuDetail";

export default function NavTab() {
  const [isEx, setEx] = useState(false);
  const [clickedMenu, setMenu] = useState(false);
  const segment = useSelectedLayoutSegment();

  const onClickEx = () => {
    setEx(!isEx);
  };

  const onClickMenu = () => {
    setMenu(!clickedMenu);
  };

  return (
    <div
      className={styles.leftSection}
      style={{ transform: isEx ? "translateX(-172px)" : "translateX(0px)" }}
    >
      <div
        className={styles.leftDiv2}
        style={{ transform: isEx ? "translateX(172px)" : "translateX(0px)" }}
      >
        <div className={styles.logoOuter}>
          <div className={styles.logoInner}>
            <div style={{ opacity: 1 }}>
              <Link
                className={styles.logoDetail}
                href="/home"
                role="link"
                tabIndex={0}
              >
                <div className={styles.logoImageOuter}>
                  <div className={styles.logoImageInner}>
                    <picture>
                      <source
                        srcSet="/smallLogo2.png"
                        width="24px"
                        height="24px"
                        media="(max-width: 1263px)"
                      />
                      <Image
                        className={styles.logo}
                        src={smallLogo}
                        alt="logo"
                        width={103}
                        height={29}
                      />
                    </picture>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.nav}>
          <div>
            <div className={styles.navDiv}>
              <span className={styles.navSpan}>
                <div className={isEx ? styles.navSpanDivEx : styles.navSpanDiv}>
                  <Link
                    className={isEx ? styles.navLinkEx : styles.navLink}
                    href="/home"
                    role="link"
                    tabIndex={0}
                  >
                    <div
                      className={
                        isEx ? styles.LinkDivExHome : styles.LinkDivHome
                      }
                    >
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
                      {isEx ? null : (
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
                      )}
                    </div>
                  </Link>
                </div>
              </span>
            </div>
          </div>
          <div>
            <span
              aria-describedby=":r3:"
              className={styles.navSpan}
              onClick={onClickEx}
            >
              <div className={isEx ? styles.navSpanDivEx : styles.navSpanDiv}>
                <Link
                  href="#"
                  className={styles.SpanInnerLink}
                  role="link"
                  tabIndex={0}
                >
                  <div className={isEx ? styles.LinkDivEx : styles.LinkDivHome}>
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
                      <div style={{ width: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <span className={styles.titleInner}>
                            <span className={styles.titleSpan}>검색</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </span>
          </div>
          <div>
            <div className={styles.navDiv}>
              <span className={styles.navSpan} aria-describedby=":r8:">
                <div className={isEx ? styles.navSpanDivEx : styles.navSpanDiv}>
                  <Link
                    className={isEx ? styles.navLinkEx : styles.navLink}
                    href="/AddPost"
                    role="link"
                    tabIndex={0}
                  >
                    <div
                      className={
                        isEx ? styles.LinkDivExHome : styles.LinkDivHome
                      }
                    >
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
                            <span className={styles.titleSpan}>
                              새로운 게시물
                            </span>
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
        <div>
          <div className={styles.bottomNav} onClick={onClickMenu}>
            <span className={styles.nav2}>
              <div className={styles.navInner}>
                <div className={styles.navLink2}>
                  <div className={styles.navLinkInner}>
                    <div>
                      <div className={styles.menuBtn}>
                        <div className={styles.menuBtnInner}>
                          <svg
                            aria-label="설정"
                            className={styles.menuBtnsetting}
                            fill="currentColor"
                            height="24"
                            role="img"
                            viewBox="0 0 24 24"
                            width="24"
                          >
                            <title>설정</title>
                            <path d="M3.5 6.5h17a1.5 1.5 0 0 0 0-3h-17a1.5 1.5 0 0 0 0 3Zm17 4h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Zm0 7h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Z"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className={styles.menuTitleOuter}>
                      <div style={{ width: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <span className={styles.menuSpan}>
                            <span className={styles.menuSpanInner}>
                              더 보기
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </span>
          </div>
          {clickedMenu ? <MenuDetail /> : <div></div>}
        </div>
      </div>
    </div>
  );
}
