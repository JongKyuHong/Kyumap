import React from "react";
import styles from "./profile.module.css";
import Image from "next/image";
import Link from "next/link";
import chi from "../../../../../public/chi.png";

export default function Page() {
  const dummyData2 = [
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: chi,
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
    {
      username: "jongkyu",
      User: {
        id: "jongkyu",
        image: "/chi.png",
      },
      content: "치이카와 너무 귀여워",
      createAt: new Date(),
      Images: "/chi.png",
    },
  ];

  const chunkSize = 3;
  const dummyData = [];

  for (let i = 0; i < dummyData2.length; i += chunkSize) {
    dummyData.push(dummyData2.slice(i, i + chunkSize));
  }

  return (
    <div>
      <section className={styles.MainSection}>
        <main className={styles.Main} role="main">
          <div className={styles.MainDiv}>
            <header className={styles.MainDivHeader}>
              <div className={styles.HeaderProfile}>
                <div
                  className={styles.HeaderProfileDiv}
                  aria-disabled="false"
                  role="button"
                  tabIndex={0}
                >
                  <canvas
                    className={styles.ProfileCanvas}
                    style={{
                      left: "-9px",
                      position: "absolute",
                      top: "-9px",
                      height: "168px",
                      width: "168px",
                    }}
                  ></canvas>
                  <span
                    className={styles.ProfileSpan}
                    role="link"
                    tabIndex={-1}
                    style={{ height: "150px", width: "150px" }}
                  >
                    <Image
                      src={chi}
                      alt={`누구의 프로필 사진`}
                      crossOrigin="anonymous"
                      draggable="false"
                      className={styles.ProfileImage}
                    ></Image>
                  </span>
                </div>
              </div>
              <section className={styles.HeaderSection}>
                <div className={styles.HeaderSectionNameDiv}>
                  <Link href="#" role="link" tabIndex={0}>
                    <h2 className={styles.NameH2} dir="auto" tabIndex={-1}>
                      {"닉네임"}
                    </h2>
                  </Link>
                  <div className={styles.HeaderSectionEmo}>
                    <div className={styles.HeaderSectionEmo2}>
                      <div
                        className={styles.HeaderSectionFollowBtn}
                        style={{ width: "34px" }}
                      >
                        <div
                          className={styles.HeaderSectionFollowBtn2}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.HeaderSectionFollowBtn3}>
                            <svg
                              aria-label="비슷한 계정"
                              className={styles.FollowSvg}
                              fill="currentColor"
                              height="16"
                              role="img"
                              viewBox="0 0 24 24"
                              width="16"
                            >
                              <title>비슷한 계정</title>
                              <path
                                d="M19.006 8.252a3.5 3.5 0 1 1-3.499-3.5 3.5 3.5 0 0 1 3.5 3.5Z"
                                fill="none"
                                stroke="currentColor"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                              ></path>
                              <path
                                d="M22 19.5v-.447a4.05 4.05 0 0 0-4.05-4.049h-4.906a4.05 4.05 0 0 0-4.049 4.049v.447"
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
                                strokeMiterlimit="10"
                                strokeWidth="2"
                                x1="5.001"
                                x2="5.001"
                                y1="7.998"
                                y2="14.003"
                              ></line>
                              <line
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeMiterlimit="10"
                                strokeWidth="2"
                                x1="8.004"
                                x2="2.003"
                                y1="11"
                                y2="11"
                              ></line>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.HeaderSectionBlank}>
                  <div></div>
                </div>
                <ul className={styles.ProfileInfo}>
                  <li className={styles.InfoLi}>
                    {"게시글 "}
                    <span className={styles.InfoSpan}>
                      <span className={styles.InfoInnerSpan}>{"508"}</span>
                    </span>
                  </li>
                  <li className={styles.InfoLi}>
                    {"팔로워 "}
                    <span className={styles.InfoSpan}>
                      <span className={styles.InfoInnerSpan}>{"6.8만"}</span>
                    </span>
                  </li>
                  <li className={styles.InfoLi}>
                    {"팔로우 "}
                    <span className={styles.InfoSpan}>
                      <span className={styles.InfoInnerSpan}>{"508"}</span>
                    </span>
                  </li>
                </ul>
                <div className={styles.ProfileContent}>
                  <div className={styles.ProfileContentId}>
                    <span className={styles.ProfileContentIdSpan}>
                      {"사용자 명"}
                    </span>
                  </div>
                  <div className={styles.ProfileContentType}>
                    <div className={styles.ProfileContentType2} dir="auto">
                      {"교육"}
                    </div>
                  </div>
                  <h1 className={styles.ProfileContentInfo} dir="auto">
                    {"자기가 쓴 소개 ~~"}
                    <br />
                    <Link
                      href="#"
                      className={styles.InfoLink}
                      tabIndex={0}
                      role="link"
                    >
                      {"자기가 태그한 사람~~~"}
                    </Link>
                  </h1>
                  <button className={styles.ProfileContentBtn} type="button">
                    <div className={styles.ProfileBtnLink}>
                      <span className={styles.LinkSvgSpan}>
                        <svg
                          aria-label="링크 아이콘"
                          className={styles.LinkSvg}
                          fill="currentColor"
                          height="12"
                          role="img"
                          viewBox="0 0 24 24"
                          width="12"
                        >
                          <title>링크 아이콘</title>
                          <path
                            d="m9.726 5.123 1.228-1.228a6.47 6.47 0 0 1 9.15 9.152l-1.227 1.227m-4.603 4.603-1.228 1.228a6.47 6.47 0 0 1-9.15-9.152l1.227-1.227"
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
                            x1="8.471"
                            x2="15.529"
                            y1="15.529"
                            y2="8.471"
                          ></line>
                        </svg>
                      </span>
                      <div className={styles.ProfileLinkDiv} dir="auto">
                        {"링크 명"}
                      </div>
                    </div>
                  </button>
                </div>
              </section>
            </header>
            {/* <div className={styles.}></div>  인스타로 치면 스토리 부분 일단 보류*/}
            <div className={styles.PostType} role="tablist">
              <Link
                href="#"
                role="tab"
                tabIndex={0}
                className={styles.PostLink}
              >
                <div className={styles.PostLinkDiv}>
                  <svg
                    className={styles.PostLinkSvg}
                    fill="currentColor"
                    height="12"
                    role="img"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <title></title>
                    <rect
                      fill="none"
                      height="18"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      width="18"
                      x="3"
                      y="3"
                    ></rect>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="9.015"
                      x2="9.015"
                      y1="3"
                      y2="21"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="14.985"
                      x2="14.985"
                      y1="3"
                      y2="21"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="21"
                      x2="3"
                      y1="9.015"
                      y2="9.015"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="21"
                      x2="3"
                      y1="14.985"
                      y2="14.985"
                    ></line>
                  </svg>
                  <span className={styles.PostLinkSpan}>게시글</span>
                </div>
              </Link>
              <Link
                aria-selected="false"
                className={styles.PostVideoLink}
                href="#"
                role="tab"
                tabIndex={0}
              >
                <div className={styles.PostLinkDiv}>
                  <svg
                    aria-label=""
                    className={styles.PostLinkSvg}
                    fill="currentColor"
                    height="12"
                    role="img"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <title></title>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="2.049"
                      x2="21.95"
                      y1="7.002"
                      y2="7.002"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="13.504"
                      x2="16.362"
                      y1="2.001"
                      y2="7.002"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="7.207"
                      x2="10.002"
                      y1="2.11"
                      y2="7.002"
                    ></line>
                    <path
                      d="M2 12.001v3.449c0 2.849.698 4.006 1.606 4.945.94.908 2.098 1.607 4.946 1.607h6.896c2.848 0 4.006-.699 4.946-1.607.908-.939 1.606-2.096 1.606-4.945V8.552c0-2.848-.698-4.006-1.606-4.945C19.454 2.699 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.546 2 5.704 2 8.552Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <path
                      d="M9.763 17.664a.908.908 0 0 1-.454-.787V11.63a.909.909 0 0 1 1.364-.788l4.545 2.624a.909.909 0 0 1 0 1.575l-4.545 2.624a.91.91 0 0 1-.91 0Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                  <span className={styles.PostLinkSpan}>릴스</span>
                </div>
              </Link>
            </div>
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
                {dummyData.map((rowData, rowIndex) => (
                  <div key={rowIndex} className={styles.PostDivList}>
                    {rowData.map((data, index) => (
                      <div key={index} className={styles.PostDiv}>
                        <Link
                          href="/detail"
                          className={styles.PostDivInnerLink}
                          role="link"
                          tabIndex={0}
                        >
                          <div className={styles.LinkDiv}>
                            <div className={styles.LinkDiv2}>
                              <Image
                                style={{
                                  objectFit: "contain",
                                  height: "auto",
                                }}
                                alt={`${data.content}`}
                                src={`${data.Images}`}
                                className={styles.ImageLink}
                                width={309}
                                height={309}
                                crossOrigin="anonymous"
                              ></Image>
                            </div>
                            <div className={styles.LinkDiv3}></div>
                          </div>
                        </Link>
                      </div>
                    ))}
                    {rowData.length < 3 && (
                      <>
                        {[...Array(3 - rowData.length)].map((_, index) => (
                          <div
                            key={`rrddata${index}`}
                            className={styles.PostDiv}
                          ></div>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
