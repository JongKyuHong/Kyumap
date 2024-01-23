import styles from "./rightsection.module.css";
import Link from "next/link";
import Image from "next/image";

export default function RightSearchZone() {
  return (
    <section className={styles.rootSection}>
      <main className={styles.rootMain}>
        <div className={styles.rootDiv}>
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
                      {"게시글을 article로 출력"}
                      <article>
                        <div className={styles.articleDiv}>
                          <div className={styles.articleHead}>
                            <div className={styles.articleHeadDiv}>
                              <div className={styles.articleHeadInnerDiv}>
                                <div>
                                  <div>
                                    <div
                                      className={styles.articleUserImage}
                                      aria-disabled="true"
                                      role="button"
                                      tabIndex={0}
                                    >
                                      <canvas
                                        className={
                                          styles.articleUserImageCanvas
                                        }
                                        style={{
                                          left: "-5px",
                                          position: "absolute",
                                          top: "-5px",
                                          height: "42px",
                                          width: "42px",
                                        }}
                                      ></canvas>
                                      <span className={styles.articleUserSpan}>
                                        <Image
                                          alt="프로필 사진"
                                          src="#"
                                          className={
                                            styles.articleUserProfileImage
                                          }
                                        ></Image>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.articleUserName}>
                                <div className={styles.userNameInner}>
                                  <div className={styles.userNameInnerDiv}>
                                    <div>
                                      <div className={styles.userName}>
                                        <span
                                          className={styles.userNameSpan}
                                          style={{
                                            lineHeight: "18px",
                                          }}
                                        >
                                          <span
                                            className={styles.nameInnerSpan}
                                          >
                                            <span
                                              className={styles.nameInnerSpan2}
                                            >
                                              <div>
                                                <Link
                                                  href="#"
                                                  className={styles.nameLink}
                                                >
                                                  <div
                                                    className={
                                                      styles.linkInnerDiv
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.linkInnerDiv2
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          styles.linkInnerSpan
                                                        }
                                                      ></span>
                                                    </div>
                                                  </div>
                                                </Link>
                                              </div>
                                            </span>
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={styles.articleMoreInfo}>
                                <div className={styles.articleMoreInfo2}>
                                  <div className={styles.articleMoreInfo3}>
                                    <div className={styles.articleMoreInfo4}>
                                      <div
                                        className={styles.articleMoreInfo5}
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                        }}
                                      >
                                        <svg
                                          className={styles.articleMoreInfoSvg}
                                          style={{
                                            fill: "currentcolor",
                                            width: "24px",
                                            height: "24px",
                                          }}
                                        >
                                          <title>옵션 더 보기</title>
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                          <circle
                                            cx="6"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                          <circle
                                            cx="18"
                                            cy="12"
                                            r="1.5"
                                          ></circle>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.articleBody}></div>
                          <div className={styles.articleContent}></div>
                        </div>
                      </article>
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
                          transform="rotate(-90deg, 50, 50)"
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
                          transform="rotate(-60deg, 50, 50)"
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
                          transform="rotate(-30deg, 50, 50)"
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
                          transform="rotate(0deg, 50, 50)"
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
                          transform="rotate(30deg, 50, 50)"
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
                          transform="rotate(60deg, 50, 50)"
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
                          transform="rotate(90deg, 50, 50)"
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
                          transform="rotate(120deg, 50, 50)"
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
                          transform="rotate(150deg, 50, 50)"
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
                          transform="rotate(180deg, 50, 50)"
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
                          transform="rotate(210deg, 50, 50)"
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
                          transform="rotate(240deg, 50, 50)"
                        ></rect>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.rightSideInner}>
              <div className={styles.rightSideHeader}>
                <div className={styles.headerInner}>
                  <div className={styles.headerInner2}>
                    <div className={styles.headerInner3}>
                      <div className={styles.headerInner4}>
                        <div className={styles.headerfront}>
                          <div className={styles.frontInner}>
                            <div className={styles.frontInner2}>
                              <canvas
                                className={styles.innerCanvas}
                                style={{
                                  height: "54px",
                                  width: "54px",
                                  left: "-5px",
                                  position: "absolute",
                                  top: "-5px",
                                }}
                              />
                              <Link
                                style={{ height: "44px", width: "44px" }}
                                className={styles.canvasLink}
                                href="#"
                              >
                                <Image
                                  alt={`누구님의 프로필 사진`}
                                  className={styles.linkImage}
                                  height={44}
                                  width={44}
                                  src={"/chi.png"}
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className={styles.headerMid}>
                          <div className={styles.headermidInner}>
                            <div className={styles.headermidInner2}>
                              <div className={styles.midSpanDiv}>
                                <Link
                                  href="#"
                                  className={styles.spandivLink}
                                ></Link>
                              </div>
                              <span
                                className={styles.midSpan}
                                style={{
                                  lineHeight:
                                    "var(--base-line-clamp-line-height)",
                                }}
                              >
                                <span className={styles.midInnerspan}>
                                  <div className={styles.innerSpanDiv}>
                                    <span className={styles.divInnerSpan}>
                                      {"사용자 이름"}
                                    </span>
                                  </div>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.headerback}>
                          <div className={styles.backInnerDiv}>
                            <div className={styles.backInnerDiv2}>전환</div>
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
    </section>
  );
}
