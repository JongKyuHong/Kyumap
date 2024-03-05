"use client";
import styles from "./mainsection.module.css";
import useDeviceSize from "./useDeviceSize";
import Image from "next/image";
import Link from "next/link";
import chi from "@/../public/chi.png";

export default function FollowList() {
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  return (
    <>
      {isDesktop ? (
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
                                  crossOrigin="anonymous"
                                  draggable="false"
                                  alt="사용자님의 프로필"
                                  src={chi}
                                ></Image>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className={styles.MyAccountInfo}>
                          <div className={styles.MyAccountInfoDiv}>
                            <div className={styles.MyAccountInfoInnerDiv}>
                              <div className={styles.MyAccountInfoId}>
                                <Link
                                  href="#"
                                  className={styles.IdLink}
                                  tabIndex={0}
                                  role="link"
                                ></Link>
                              </div>
                              <span className={styles.MyAccountSpan}>
                                <span className={styles.MyAccountInnerSpan}>
                                  <div className={styles.InnerSpanDiv}>
                                    <span
                                      className={styles.NameSpan}
                                      style={{ lineHeight: "18px" }}
                                    >
                                      {"사용자 명"}
                                    </span>
                                  </div>
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={styles.AccountTransform}>
                          <div className={styles.AccountTransformDiv}>
                            <div
                              className={styles.TransformBtn}
                              role="button"
                              tabIndex={0}
                            >
                              <Link href="/NewLogin">전환</Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.FollowRecommendation}>
              <div className={styles.FollowRecommendationDiv}>
                <div className={styles.FollowRecommendationDiv2}>
                  <div className={styles.HeaderDiv}>
                    <div className={styles.HeaderDiv1}>
                      <div
                        className={styles.HeaderDiv1Span}
                        dir="auto"
                        style={{ lineHeight: "18px" }}
                      >
                        {"회원님을 위한 추천"}
                      </div>
                    </div>
                    <Link
                      href="#"
                      tabIndex={0}
                      role="link"
                      className={styles.HeaderDiv1Link}
                    >
                      <span
                        className={styles.HeaderDiv1LinkSpan}
                        dir="auto"
                        style={{ lineHeight: "16px" }}
                      >
                        {"모두 보기"}
                      </span>
                    </Link>
                  </div>
                  <div className={styles.RecommendationList}>
                    <div className={styles.RecommendationListDiv}>
                      <div
                        style={{
                          height: "auto",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingBottom: "0px",
                            paddingTop: "0px",
                            position: "relative",
                          }}
                        >
                          {/* 여기서 반복문으로 팔로우 목록 만들기 */}
                          <div className={styles.RecommendtionListDiv2}>
                            <div
                              className={styles.RecommendtionListDiv2InnerDiv}
                            >
                              <div
                                className={
                                  styles.RecommendtionListDiv2InnerDiv2
                                }
                              >
                                <div
                                  className={
                                    styles.RecommendtionListDiv2InnerDiv3
                                  }
                                >
                                  <div
                                    className={
                                      styles.RecommendtionListDiv2Image
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendtionListDiv2ImageDiv
                                      }
                                    >
                                      <div>
                                        <div>
                                          <div
                                            className={styles.ImageDiv2}
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
                                              className={styles.ImageDiv2Canvas}
                                            ></canvas>
                                            <Link
                                              href="#"
                                              role="link"
                                              tabIndex={0}
                                              style={{
                                                height: "44px",
                                                width: "44px",
                                              }}
                                              className={styles.ImageLink2}
                                            >
                                              <Image
                                                alt="팔로워추천1님의 프로필 사진"
                                                crossOrigin="anonymous"
                                                draggable="false"
                                                src={chi}
                                                className={
                                                  styles.ImageLink2Image
                                                }
                                              ></Image>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2Info
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendationListDiv2InfoInner
                                      }
                                    >
                                      <div
                                        className={
                                          styles.RecommendationListDiv2InfoInner2
                                        }
                                      >
                                        <div className={styles.IdSection}>
                                          <div className={styles.IdSectionDiv}>
                                            <div>
                                              <Link
                                                href="#"
                                                role="link"
                                                tabIndex={0}
                                                className={styles.IdSectionLink}
                                              >
                                                <div
                                                  className={
                                                    styles.IdSectionLinkInner
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.IdSectionLinkInner2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.IdSectionSpan
                                                      }
                                                      dir="auto"
                                                    >
                                                      {"jongkyu"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={styles.SpanSection}
                                          dir="auto"
                                          style={{ lineHeight: "16px" }}
                                        >
                                          <span
                                            className={styles.SpanSectionInner}
                                          >
                                            {"회원님을 위한 추천"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2FBtn
                                    }
                                  >
                                    <div className={styles.FBtnInner}>
                                      <button className={styles.FBtn}>
                                        <div
                                          className={styles.FBtnDiv}
                                          style={{ height: "100%" }}
                                        >
                                          <div className={styles.FBtnDivInner}>
                                            {"팔로우"}
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.RecommendtionListDiv2}>
                            <div
                              className={styles.RecommendtionListDiv2InnerDiv}
                            >
                              <div
                                className={
                                  styles.RecommendtionListDiv2InnerDiv2
                                }
                              >
                                <div
                                  className={
                                    styles.RecommendtionListDiv2InnerDiv3
                                  }
                                >
                                  <div
                                    className={
                                      styles.RecommendtionListDiv2Image
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendtionListDiv2ImageDiv
                                      }
                                    >
                                      <div>
                                        <div>
                                          <div
                                            className={styles.ImageDiv2}
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
                                              className={styles.ImageDiv2Canvas}
                                            ></canvas>
                                            <Link
                                              href="#"
                                              role="link"
                                              tabIndex={0}
                                              style={{
                                                height: "44px",
                                                width: "44px",
                                              }}
                                              className={styles.ImageLink2}
                                            >
                                              <Image
                                                alt="팔로워추천1님의 프로필 사진"
                                                crossOrigin="anonymous"
                                                draggable="false"
                                                src={chi}
                                                className={
                                                  styles.ImageLink2Image
                                                }
                                              ></Image>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2Info
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendationListDiv2InfoInner
                                      }
                                    >
                                      <div
                                        className={
                                          styles.RecommendationListDiv2InfoInner2
                                        }
                                      >
                                        <div className={styles.IdSection}>
                                          <div className={styles.IdSectionDiv}>
                                            <div>
                                              <Link
                                                href="#"
                                                role="link"
                                                tabIndex={0}
                                                className={styles.IdSectionLink}
                                              >
                                                <div
                                                  className={
                                                    styles.IdSectionLinkInner
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.IdSectionLinkInner2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.IdSectionSpan
                                                      }
                                                      dir="auto"
                                                    >
                                                      {"jongkyu"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={styles.SpanSection}
                                          dir="auto"
                                          style={{ lineHeight: "16px" }}
                                        >
                                          <span
                                            className={styles.SpanSectionInner}
                                          >
                                            {"회원님을 위한 추천"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2FBtn
                                    }
                                  >
                                    <div className={styles.FBtnInner}>
                                      <button className={styles.FBtn}>
                                        <div
                                          className={styles.FBtnDiv}
                                          style={{ height: "100%" }}
                                        >
                                          <div className={styles.FBtnDivInner}>
                                            {"팔로우"}
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.RecommendtionListDiv2}>
                            <div
                              className={styles.RecommendtionListDiv2InnerDiv}
                            >
                              <div
                                className={
                                  styles.RecommendtionListDiv2InnerDiv2
                                }
                              >
                                <div
                                  className={
                                    styles.RecommendtionListDiv2InnerDiv3
                                  }
                                >
                                  <div
                                    className={
                                      styles.RecommendtionListDiv2Image
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendtionListDiv2ImageDiv
                                      }
                                    >
                                      <div>
                                        <div>
                                          <div
                                            className={styles.ImageDiv2}
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
                                              className={styles.ImageDiv2Canvas}
                                            ></canvas>
                                            <Link
                                              href="#"
                                              role="link"
                                              tabIndex={0}
                                              style={{
                                                height: "44px",
                                                width: "44px",
                                              }}
                                              className={styles.ImageLink2}
                                            >
                                              <Image
                                                alt="팔로워추천1님의 프로필 사진"
                                                crossOrigin="anonymous"
                                                draggable="false"
                                                src={chi}
                                                className={
                                                  styles.ImageLink2Image
                                                }
                                              ></Image>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2Info
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendationListDiv2InfoInner
                                      }
                                    >
                                      <div
                                        className={
                                          styles.RecommendationListDiv2InfoInner2
                                        }
                                      >
                                        <div className={styles.IdSection}>
                                          <div className={styles.IdSectionDiv}>
                                            <div>
                                              <Link
                                                href="#"
                                                role="link"
                                                tabIndex={0}
                                                className={styles.IdSectionLink}
                                              >
                                                <div
                                                  className={
                                                    styles.IdSectionLinkInner
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.IdSectionLinkInner2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.IdSectionSpan
                                                      }
                                                      dir="auto"
                                                    >
                                                      {"jongkyu"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={styles.SpanSection}
                                          dir="auto"
                                          style={{ lineHeight: "16px" }}
                                        >
                                          <span
                                            className={styles.SpanSectionInner}
                                          >
                                            {"회원님을 위한 추천"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2FBtn
                                    }
                                  >
                                    <div className={styles.FBtnInner}>
                                      <button className={styles.FBtn}>
                                        <div
                                          className={styles.FBtnDiv}
                                          style={{ height: "100%" }}
                                        >
                                          <div className={styles.FBtnDivInner}>
                                            {"팔로우"}
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.RecommendtionListDiv2}>
                            <div
                              className={styles.RecommendtionListDiv2InnerDiv}
                            >
                              <div
                                className={
                                  styles.RecommendtionListDiv2InnerDiv2
                                }
                              >
                                <div
                                  className={
                                    styles.RecommendtionListDiv2InnerDiv3
                                  }
                                >
                                  <div
                                    className={
                                      styles.RecommendtionListDiv2Image
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendtionListDiv2ImageDiv
                                      }
                                    >
                                      <div>
                                        <div>
                                          <div
                                            className={styles.ImageDiv2}
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
                                              className={styles.ImageDiv2Canvas}
                                            ></canvas>
                                            <Link
                                              href="#"
                                              role="link"
                                              tabIndex={0}
                                              style={{
                                                height: "44px",
                                                width: "44px",
                                              }}
                                              className={styles.ImageLink2}
                                            >
                                              <Image
                                                alt="팔로워추천1님의 프로필 사진"
                                                crossOrigin="anonymous"
                                                draggable="false"
                                                src={chi}
                                                className={
                                                  styles.ImageLink2Image
                                                }
                                              ></Image>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2Info
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendationListDiv2InfoInner
                                      }
                                    >
                                      <div
                                        className={
                                          styles.RecommendationListDiv2InfoInner2
                                        }
                                      >
                                        <div className={styles.IdSection}>
                                          <div className={styles.IdSectionDiv}>
                                            <div>
                                              <Link
                                                href="#"
                                                role="link"
                                                tabIndex={0}
                                                className={styles.IdSectionLink}
                                              >
                                                <div
                                                  className={
                                                    styles.IdSectionLinkInner
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.IdSectionLinkInner2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.IdSectionSpan
                                                      }
                                                      dir="auto"
                                                    >
                                                      {"jongkyu"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={styles.SpanSection}
                                          dir="auto"
                                          style={{ lineHeight: "16px" }}
                                        >
                                          <span
                                            className={styles.SpanSectionInner}
                                          >
                                            {"회원님을 위한 추천"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2FBtn
                                    }
                                  >
                                    <div className={styles.FBtnInner}>
                                      <button className={styles.FBtn}>
                                        <div
                                          className={styles.FBtnDiv}
                                          style={{ height: "100%" }}
                                        >
                                          <div className={styles.FBtnDivInner}>
                                            {"팔로우"}
                                          </div>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={styles.RecommendtionListDiv2}>
                            <div
                              className={styles.RecommendtionListDiv2InnerDiv}
                            >
                              <div
                                className={
                                  styles.RecommendtionListDiv2InnerDiv2
                                }
                              >
                                <div
                                  className={
                                    styles.RecommendtionListDiv2InnerDiv3
                                  }
                                >
                                  <div
                                    className={
                                      styles.RecommendtionListDiv2Image
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendtionListDiv2ImageDiv
                                      }
                                    >
                                      <div>
                                        <div>
                                          <div
                                            className={styles.ImageDiv2}
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
                                              className={styles.ImageDiv2Canvas}
                                            ></canvas>
                                            <Link
                                              href="#"
                                              role="link"
                                              tabIndex={0}
                                              style={{
                                                height: "44px",
                                                width: "44px",
                                              }}
                                              className={styles.ImageLink2}
                                            >
                                              <Image
                                                alt="팔로워추천1님의 프로필 사진"
                                                crossOrigin="anonymous"
                                                draggable="false"
                                                src={chi}
                                                className={
                                                  styles.ImageLink2Image
                                                }
                                              ></Image>
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2Info
                                    }
                                  >
                                    <div
                                      className={
                                        styles.RecommendationListDiv2InfoInner
                                      }
                                    >
                                      <div
                                        className={
                                          styles.RecommendationListDiv2InfoInner2
                                        }
                                      >
                                        <div className={styles.IdSection}>
                                          <div className={styles.IdSectionDiv}>
                                            <div>
                                              <Link
                                                href="#"
                                                role="link"
                                                tabIndex={0}
                                                className={styles.IdSectionLink}
                                              >
                                                <div
                                                  className={
                                                    styles.IdSectionLinkInner
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.IdSectionLinkInner2
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles.IdSectionSpan
                                                      }
                                                      dir="auto"
                                                    >
                                                      {"jongkyu"}
                                                    </span>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                        <span
                                          className={styles.SpanSection}
                                          dir="auto"
                                          style={{ lineHeight: "16px" }}
                                        >
                                          <span
                                            className={styles.SpanSectionInner}
                                          >
                                            {"회원님을 위한 추천"}
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.RecommendationListDiv2FBtn
                                    }
                                  >
                                    <div className={styles.FBtnInner}>
                                      <button className={styles.FBtn}>
                                        <div
                                          className={styles.FBtnDiv}
                                          style={{ height: "100%" }}
                                        >
                                          <div className={styles.FBtnDivInner}>
                                            {"팔로우"}
                                          </div>
                                        </div>
                                      </button>
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
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
