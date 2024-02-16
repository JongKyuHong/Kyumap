"use client";
import React, { useRef, useState, useCallback } from "react";
import styles from "./mainsection.module.css";
import Image from "next/image";
import Link from "next/link";
import Emoticon from "./Emoticon";
import Post from "./Post";

export default function MainSection() {
  const [clickedEmotionMenu, setEmotionMenu] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  const svgRef = useRef(
    Array.from({ length: 10 }, () => React.createRef<SVGSVGElement>())
  );

  const handleSvgClick = useCallback(
    (index: number) => {
      const currentRef = svgRef.current[index];
      if (currentRef && currentRef.current) {
        const svgRect = currentRef.current.getBoundingClientRect();
        const modalTop = svgRect.top + window.scrollY;
        const modalLeft = svgRect.right + window.scrollX;
        setModalPosition({ top: modalTop, left: modalLeft });
        setEmotionMenu(!clickedEmotionMenu);
      }
    },

    [clickedEmotionMenu]
  );

  const EmoticonClick = () => {};

  return (
    <section className={styles.rootSection}>
      <main className={styles.rootMain}>
        <div className={styles.mainrootDiv}>
          <div style={{ maxWidth: "630px", width: "100%" }}>
            <div className={styles.rootDivInner}>
              <div className={styles.rootDivInner2}>
                <div>
                  <div className={styles.rootDivInner3}>
                    <div className={styles.rootDivInner4}>
                      <div className={styles.rootDivInner5}>
                        <div className={styles.rootDivInner6}>
                          <div className={styles.rootDivInner7}>
                            <ul className={styles.followUl}>
                              <li
                                style={{
                                  transform: "translateX(0px)",
                                  width: "2px",
                                }}
                              ></li>
                              <li
                                style={{
                                  transform: "translateX(400px)",
                                  width: "2px",
                                }}
                              ></li>
                              {
                                "여기서는 팔로우한 사람들의 새 게시글 translateX는 요소의 개수만큼 80씩커짐"
                              }
                              <li
                                className={styles.foolowLi}
                                tabIndex={-1}
                                style={{ transform: "translateX(2px)" }}
                              ></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.postDiv}>
                <div
                  className={styles.postDivInner}
                  style={{ maxWidth: "100%", width: "min(470px, 100vw)" }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        paddingBottom: "0px",
                        paddingTop: "0px",
                        position: "relative",
                      }}
                    >
                      {/* {"게시글을 article로 출력"} */}
                      {svgRef.current.map((ref, index) => (
                        <Post
                          key={index}
                          onClickProps={() => handleSvgClick(index)}
                          ref={ref}
                        />
                      ))}
                    </div>
                  </div>
                  <div className={styles.postFooter}>
                    <div
                      className={styles.postFooterDiv}
                      style={{ height: "32px", width: "32px" }}
                    >
                      <svg
                        aria-label="읽어들이는 중..."
                        className={styles.footerLoading}
                      >
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0"
                          rx="3"
                          ry="3"
                          width="25"
                          x="72"
                          y="47"
                          transform="rotate(-90, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.0833333"
                          rx="3"
                          ry="3"
                          width="25"
                          x="72"
                          y="47"
                          transform="rotate(-60, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.166667"
                          rx="3"
                          ry="3"
                          width="25"
                          x="72"
                          y="47"
                          transform="rotate(-30, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.25"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(0, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.333333"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(30, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.416667"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(60, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.5"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(90, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.583333"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(120, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.666667"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(150, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.75"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(180, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.833333"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(210, 50, 50)"
                        ></rect>
                        <rect
                          className={styles.loadingAnimation1}
                          height="6"
                          opacity="0.916667"
                          rx="3"
                          width="25"
                          ry="3"
                          x="72"
                          y="47"
                          transform="rotate(240, 50, 50)"
                        ></rect>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.FollowList}>
            <div className={styles.FollowListDiv}>
              <div className={styles.MyAccount}>
                <div className={styles.MyAccountDiv} style={{ width: "100%" }}>
                  <div className={styles.MyAccountInnerDiv}>
                    <div className={styles.MyAccountInnerDiv2}>
                      <div className={styles.MyAccountInnerDiv3}>
                        <div className={styles.MyAccountInnerDiv4}>
                          <div className={styles.MyAccountImage}>
                            <div className={styles.MyAccountImage2}>
                              <div
                                className={styles.MyAccountImage3}
                                aria-disabled="true"
                                role="button"
                                tabIndex={-1}
                              >
                                <canvas
                                  style={{
                                    left: "-5px",
                                    position: "absolute",
                                    top: "-5px",
                                    height: "54px",
                                    width: "54px",
                                  }}
                                ></canvas>
                                <Link
                                  href="#"
                                  className={styles.ImageLink}
                                  style={{ height: "44px", width: "44px" }}
                                  tabIndex={0}
                                  role="link"
                                >
                                  <Image
                                    className={styles.ProfileImage}
                                  ></Image>
                                </Link>
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
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div></div>
      </main>
      <div></div>
      {clickedEmotionMenu ? (
        <Emoticon top={modalPosition.top} left={modalPosition.left} />
      ) : (
        <div></div>
      )}
    </section>
  );
}
