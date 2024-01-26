import styles from "./mainsection.module.css";
import Image from "next/image";
import Link from "next/link";

export default function MainSection({ onClickEmoticon }: any) {
  return (
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
                                  className={styles.articleUserImageCanvas}
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
                                    src="/chi.png"
                                    width={1}
                                    height={1}
                                    className={styles.articleUserProfileImage}
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
                                    <span className={styles.nameInnerSpan}>
                                      <span className={styles.nameInnerSpan2}>
                                        <div>
                                          <Link
                                            href="#"
                                            className={styles.nameLink}
                                          >
                                            <div
                                              className={styles.linkInnerDiv}
                                            >
                                              <div
                                                className={styles.linkInnerDiv2}
                                              >
                                                <span
                                                  className={
                                                    styles.linkInnerSpan
                                                  }
                                                >
                                                  {"사용자 명"}
                                                </span>
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
                                    <circle cx="12" cy="12" r="1.5"></circle>
                                    <circle cx="6" cy="12" r="1.5"></circle>
                                    <circle cx="18" cy="12" r="1.5"></circle>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.articleBody}>
                      <div
                        className={styles.articleBodyDiv}
                        role="button"
                        aria-hidden="true"
                        tabIndex={0}
                      >
                        <div className={styles.bodyInnerDiv}>
                          <div className={styles.bodyInnerDiv2}>
                            <div>
                              <div className={styles.bodyInnerDiv3}>
                                <div className={styles.bodyInnerDiv4}>
                                  <Image
                                    alt="게시글"
                                    crossOrigin="anonymous"
                                    src="/chi3.png"
                                    width={500}
                                    height={500}
                                    className={styles.postImage}
                                    style={{ objectFit: "cover" }}
                                  ></Image>
                                </div>
                                <div
                                  className={styles.bodyInnerDiv4Outer}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.articleBodyFooter}></div>
                    </div>
                    <div className={styles.articleContent}>
                      <div className={styles.articleContentDiv}>
                        <div>
                          <div className={styles.postIcon}>
                            <div className={styles.leftSectionIcon}>
                              <span className={styles.iconSpan}>
                                <div
                                  className={styles.iconDiv}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <div className={styles.iconInnerDiv}>
                                    <span>
                                      <svg
                                        aria-label="좋아요"
                                        className={styles.iconSvg}
                                        fill="currentColor"
                                        height="24"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="24"
                                      >
                                        <title>좋아요</title>
                                        <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </span>
                              <span>
                                <div
                                  className={styles.iconDiv}
                                  role="button"
                                  tabIndex={0}
                                >
                                  <div className={styles.iconInnerDiv}>
                                    <svg
                                      aria-label="댓글 달기"
                                      className={styles.iconSvg}
                                      fill="currentColor"
                                      height="24"
                                      role="img"
                                      viewBox="0 0 24 24"
                                      width="24"
                                    >
                                      <title>댓글 달기</title>
                                      <path
                                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                      ></path>
                                    </svg>
                                  </div>
                                </div>
                              </span>
                            </div>
                            <div className={styles.rightSectionIcon}>
                              <div>
                                <div
                                  aria-disabled="false"
                                  role="button"
                                  style={{ cursor: "pointer" }}
                                >
                                  <div
                                    className={styles.iconInnerDiv2}
                                    role="button"
                                    tabIndex={0}
                                  >
                                    <div className={styles.iconSvgOuterDiv}>
                                      <svg
                                        aria-label="저장"
                                        className={styles.iconSvg}
                                        fill="currentColor"
                                        height="24"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="24"
                                      >
                                        <title>저장</title>
                                        <polygon
                                          fill="none"
                                          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                        ></polygon>
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <section className={styles.likeSection}>
                            <div className={styles.likeSectionDiv}>
                              <div className={styles.likeSectionInnerDiv}>
                                <span className={styles.likeSectionSpan}>
                                  <Link
                                    href="#"
                                    className={styles.likeModalLink}
                                    role="link"
                                    tabIndex={0}
                                  >
                                    <span
                                      className={styles.likeInnerSpan}
                                      style={{ lineHeight: "18px" }}
                                    >
                                      {"좋아요"}
                                      <span className={styles.likeCountSpan}>
                                        {"#좋아요 개수 불러오기#"}
                                      </span>
                                      {"개"}
                                    </span>
                                  </Link>
                                </span>
                              </div>
                            </div>
                          </section>
                          <div className={styles.postContent}>
                            <div className={styles.postUserName}>
                              <span className={styles.postUserNameSpan}>
                                <div>
                                  <Link
                                    href="#"
                                    className={styles.postUserProfile}
                                    role="link"
                                    tabIndex={0}
                                  >
                                    {"#유저 이름#"}
                                  </Link>
                                </div>
                              </span>
                            </div>
                            <span className={styles.postContentSpan} dir="auto">
                              <span
                                className={styles.postContentSpan}
                                dir="auto"
                              >
                                {"#포스트 컨텐츠 내용#"}
                                <br />
                                <br />
                                <Link href="#" className={styles.hashTag}>
                                  {"#해시태그 내용#"}
                                </Link>
                              </span>
                            </span>
                            <div className={styles.postComment}>
                              <Link
                                href="#"
                                className={styles.commentLink}
                                role="link"
                                tabIndex={0}
                              >
                                <span
                                  style={{ lineHeight: "18px" }}
                                  className={styles.linkCommentSpan}
                                  dir="auto"
                                >
                                  {"#댓글#"}
                                  <span className={styles.linkCommentInnerSpan}>
                                    {"#댓글갯수#"}
                                  </span>
                                  {"#개 모두 보기#"}
                                </span>
                              </Link>
                            </div>
                            <div className={styles.commentInput}>
                              <section className={styles.inputSection}>
                                <div className={styles.inputSecitonDiv}>
                                  <form
                                    className={styles.formInput}
                                    method="POST"
                                  >
                                    <div className={styles.formInputDiv}>
                                      <div className={styles.formInputInnerDiv}>
                                        <div
                                          className={styles.formInputInnerDiv2}
                                          role="button"
                                          tabIndex={0}
                                        >
                                          <div
                                            className={
                                              styles.formInputInnerDiv3
                                            }
                                          >
                                            <svg
                                              aria-label="이모티콘"
                                              className={styles.Emoticon}
                                              fill="currentColor"
                                              height="13"
                                              role="img"
                                              viewBox="0 0 24 24"
                                              width="13"
                                              onClick={onClickEmoticon}
                                            >
                                              <title>이모티콘</title>
                                              <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                      <textarea
                                        aria-label="댓글 달기..."
                                        placeholder="댓글 달기..."
                                        autoComplete="off"
                                        autoCorrect="off"
                                        className={styles.formInputTextArea}
                                        style={{ height: "18px!important" }}
                                      ></textarea>
                                    </div>
                                  </form>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
  );
}