"use client";

import React, { useEffect, useState } from "react";
import styles from "./mainsection.module.css";
import smallLogo from "../../../../public/smallLogo.png";
import smallLogodark from "../../../../public/smallLogodark.png";
import Image from "next/image";
import Link from "next/link";
import useDeviceSize from "./useDeviceSize";

export default function ResponsiveNav() {
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  const [clickedAddPost, setAddPost] = useState(false);
  const [isDark, setDark] = useState<boolean>(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setDark(isDark);
      document.documentElement.setAttribute(
        "color-theme",
        isDark ? "dark" : "light"
      );
    }
  }, []);

  const onClickAddpost = () => {
    setAddPost(!clickedAddPost);
  };

  return (
    <>
      <div style={{ order: 0 }}>
        <nav className={styles.MNav}>
          <div className={styles.MDiv2}>
            <header className={styles.MHeader}>
              <div className={styles.MDiv3}>
                <h1 className={styles.Mh1}>
                  <div className={styles.MDiv4}>
                    <div className={styles.MDiv5}>
                      <div
                        className={styles.MDiv6}
                        aria-expanded="false"
                        aria-haspopup="menu"
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.MDiv7}>
                          <div className={styles.MDiv9}>
                            {isDark ? (
                              <Image
                                alt="Kyumap"
                                src={smallLogodark}
                                aria-label="Kyumap"
                                width={103}
                                height={29}
                              />
                            ) : (
                              <Image
                                alt="Kyumap"
                                src={smallLogo}
                                aria-label="Kyumap"
                                width={103}
                                height={29}
                              />
                            )}
                          </div>
                        </div>
                        <div className={styles.MDiv8} role="none"></div>
                      </div>
                    </div>
                  </div>
                </h1>
                <div className={styles.MDiv10}>
                  <div className={styles.MDiv11} style={{ width: "48px" }}>
                    <div className={styles.MDiv13}>
                      <span aria-describedby=":r12:" className={styles.MSpan}>
                        <div className={styles.MDiv15}>
                          <Link
                            href="/create/style"
                            role="link"
                            tabIndex={0}
                            className={styles.MLink}
                            onClick={onClickAddpost}
                          >
                            <div className={styles.MDiv16}>
                              <div>
                                <div className={styles.MDiv17}>
                                  <div className={styles.MDiv18}>
                                    <svg
                                      aria-label="새로운 게시물"
                                      className={styles.MSvg2}
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
                            </div>
                          </Link>
                        </div>
                      </span>
                    </div>
                    <div className={styles.MDiv14}></div>
                  </div>
                  <div className={styles.MDiv12}>
                    <div>
                      <span aria-describedby=":r1r:" className={styles.MSpan2}>
                        <div className={styles.MDiv19}>
                          <Link
                            href="#"
                            role="link"
                            tabIndex={0}
                            className={styles.MLink}
                          >
                            <div className={styles.MDiv16}>
                              <div className={styles.MDiv17}>
                                <div className={styles.MDiv18}>
                                  <svg
                                    aria-label="알림"
                                    className={styles.MSvg2}
                                    fill="currentColor"
                                    height="24"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    width="24"
                                  >
                                    <title>알림</title>
                                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </header>
          </div>
        </nav>
      </div>
      <div className={styles.MDiv}></div>
    </>
  );
}
