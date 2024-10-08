"use client";

import Link from "next/link";
import styles from "./menudetail.module.css";
import { useState } from "react";
import DarkMode from "./DarkMode";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  darkMode: boolean;
  onClickDark: () => void;
};

// NavTab의 햄버거 버튼을 클릭하면 나오는 메뉴
export default function MenuDetail({ darkMode, onClickDark }: Props) {
  const queryClient = useQueryClient();
  const [clicked, setClicked] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const onClickBtn = () => {
    setClicked((clicked) => !clicked);
  };

  // 로그아웃 버튼 클릭 시 처리하는 함수
  const onClickLogOut = async () => {
    // 포스트 및 유저 관련 쿼리를 무효화하여 최신 데이터를 가져오도록 함
    queryClient.invalidateQueries({
      queryKey: ["posts"],
    });
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });
    try {
      // 로그아웃 후 콜백 URL로 이동
      await signOut({ callbackUrl: "/" });
      // 서버 로그아웃 API 호출
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logout`, {
        method: "post",
        credentials: "include",
      });
      router.refresh();
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <div>
        <div>
          <div className={styles.Container}>
            <div className={styles.Nav}>
              <div>
                <div className={styles.navInner1}>
                  <div className={styles.navInner2}>
                    <div className={styles.navInner3}>
                      <div className={styles.navInner4}>
                        <div
                          className={styles.navInner5}
                          style={{ height: clicked ? "119px" : "305px" }}
                        >
                          <div
                            className={styles.navInner6}
                            style={{
                              transform: clicked
                                ? "translateX(-100%) translateZ(1px)"
                                : "translateX(0%) translateZ(1px)",
                              opacity: clicked ? 0 : 1,
                              pointerEvents: clicked ? "none" : "all",
                              visibility: clicked ? "hidden" : "visible",
                            }}
                            aria-hidden={clicked ? "true" : "false"}
                          >
                            <div className={styles.navInner7}>
                              <Link
                                className={styles.navLink}
                                href={`/accounts/edit`}
                              >
                                <div className={styles.linkDiv}>
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.linkInnerDiv2}>
                                      <div className={styles.navIcon}>
                                        <div className={styles.iconInner}>
                                          <svg
                                            aria-label="설정"
                                            className={styles.Icon}
                                            fill="currentColor"
                                            height="18"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="18"
                                          >
                                            <title>설정</title>
                                            <circle
                                              cx="12"
                                              cy="12"
                                              fill="none"
                                              r="8.635"
                                              stroke="currentColor"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                            ></circle>
                                            <path
                                              d="M14.232 3.656a1.269 1.269 0 0 1-.796-.66L12.93 2h-1.86l-.505.996a1.269 1.269 0 0 1-.796.66m-.001 16.688a1.269 1.269 0 0 1 .796.66l.505.996h1.862l.505-.996a1.269 1.269 0 0 1 .796-.66M3.656 9.768a1.269 1.269 0 0 1-.66.796L2 11.07v1.862l.996.505a1.269 1.269 0 0 1 .66.796m16.688-.001a1.269 1.269 0 0 1 .66-.796L22 12.93v-1.86l-.996-.505a1.269 1.269 0 0 1-.66-.796M7.678 4.522a1.269 1.269 0 0 1-1.03.096l-1.06-.348L4.27 5.587l.348 1.062a1.269 1.269 0 0 1-.096 1.03m11.8 11.799a1.269 1.269 0 0 1 1.03-.096l1.06.348 1.318-1.317-.348-1.062a1.269 1.269 0 0 1 .096-1.03m-14.956.001a1.269 1.269 0 0 1 .096 1.03l-.348 1.06 1.317 1.318 1.062-.348a1.269 1.269 0 0 1 1.03.096m11.799-11.8a1.269 1.269 0 0 1-.096-1.03l.348-1.06-1.317-1.318-1.062.348a1.269 1.269 0 0 1-1.03-.096"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                            ></path>
                                          </svg>
                                        </div>
                                      </div>
                                      <div className={styles.iconTitle}>
                                        <div className={styles.titleInner}>
                                          <div className={styles.spanOuter}>
                                            <span className={styles.Span}>
                                              <span
                                                className={styles.innerSpan}
                                              >
                                                설정
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.linkDivOuter}></div>
                              </Link>
                              <Link
                                className={styles.navLink}
                                href={`/profile/${session?.user!.name}/saved`}
                              >
                                <div className={styles.linkDiv}>
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.linkInnerDiv2}>
                                      <div className={styles.navIcon}>
                                        <div className={styles.iconInner}>
                                          <svg
                                            aria-label="저장됨"
                                            className={styles.Icon}
                                            fill="currentColor"
                                            height="18"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="18"
                                          >
                                            <title>저장됨</title>
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
                                      <div className={styles.iconTitle}>
                                        <div className={styles.titleInner}>
                                          <div className={styles.spanOuter}>
                                            <span className={styles.Span}>
                                              <span
                                                className={styles.innerSpan}
                                              >
                                                저장됨
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className={styles.linkDivOuter}></div>
                              </Link>
                              <div>
                                <div
                                  className={styles.navLink}
                                  onClick={onClickBtn}
                                >
                                  <div className={styles.linkDiv}>
                                    <div className={styles.linkInnerDiv}>
                                      <div className={styles.linkInnerDiv2}>
                                        <div className={styles.navIcon}>
                                          <div className={styles.iconInner}>
                                            <svg
                                              aria-label="테마 아이콘"
                                              className={styles.Icon}
                                              fill="currentColor"
                                              height="18"
                                              role="img"
                                              viewBox="0 0 24 24"
                                              width="18"
                                            >
                                              <title>테마 아이콘</title>
                                              <path d="M12.00018,4.5a1,1,0,0,0,1-1V2a1,1,0,0,0-2,0V3.5A1.00005,1.00005,0,0,0,12.00018,4.5ZM5.28241,6.69678A.99989.99989,0,1,0,6.69647,5.28271l-1.06054-1.061A.99989.99989,0,0,0,4.22186,5.63574ZM4.50018,12a1,1,0,0,0-1-1h-1.5a1,1,0,0,0,0,2h1.5A1,1,0,0,0,4.50018,12Zm.78223,5.30322-1.06055,1.061a.99989.99989,0,1,0,1.41407,1.41406l1.06054-1.061a.99989.99989,0,0,0-1.41406-1.41407ZM12.00018,19.5a1.00005,1.00005,0,0,0-1,1V22a1,1,0,0,0,2,0V20.5A1,1,0,0,0,12.00018,19.5Zm6.71729-2.19678a.99989.99989,0,0,0-1.41406,1.41407l1.06054,1.061A.99989.99989,0,0,0,19.778,18.36426ZM22.00018,11h-1.5a1,1,0,0,0,0,2h1.5a1,1,0,0,0,0-2ZM18.01044,6.98975a.996.996,0,0,0,.707-.293l1.06055-1.061A.99989.99989,0,0,0,18.364,4.22168l-1.06054,1.061a1,1,0,0,0,.707,1.707ZM12.00018,6a6,6,0,1,0,6,6A6.00657,6.00657,0,0,0,12.00018,6Zm0,10a4,4,0,1,1,4-4A4.00458,4.00458,0,0,1,12.00018,16Z"></path>
                                            </svg>
                                          </div>
                                        </div>
                                        <div className={styles.iconTitle}>
                                          <div className={styles.titleInner}>
                                            <div className={styles.spanOuter}>
                                              <span className={styles.Span}>
                                                <span
                                                  className={styles.innerSpan}
                                                >
                                                  모드 전환
                                                </span>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className={styles.linkDivOuter}></div>
                                </div>
                              </div>
                              <div className={styles.underline}></div>
                              <div
                                className={styles.linkDivv}
                                style={{ cursor: "pointer" }}
                                // onClick={onClickLogOut}
                              >
                                <div className={styles.linkDiv}>
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.iconTitle2}>
                                      <div className={styles.titleInner2}>
                                        <div className={styles.spanOuter2}>
                                          <div className={styles.spanOuter3}>
                                            <span
                                              className={styles.Span}
                                              style={{ lineHeight: "18px" }}
                                            >
                                              <span
                                                className={styles.innerSpan}
                                              >
                                                <Link href="/NewLogin">
                                                  계정전환
                                                </Link>
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className={styles.titleInnerright}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className={styles.linkDiv2}></div> */}
                              </div>
                              <div className={styles.underline2}></div>
                              <div
                                className={styles.linkDivv}
                                style={{ cursor: "pointer" }}
                                onClick={onClickLogOut}
                              >
                                <div className={styles.linkDiv}>
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.iconTitle2}>
                                      <div className={styles.titleInner2}>
                                        <div className={styles.spanOuter2}>
                                          <div className={styles.spanOuter3}>
                                            <span
                                              className={styles.Span}
                                              style={{ lineHeight: "18px" }}
                                            >
                                              <span
                                                className={styles.innerSpan}
                                              >
                                                로그아웃
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                        <div
                                          className={styles.titleInnerright}
                                        ></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className={styles.linkDiv2}></div> */}
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.navInner62}
                            style={{
                              transform: clicked
                                ? "translateX(0%) translageZ(1px)"
                                : "translateX(100%) translageZ(1px)",
                              opacity: clicked ? 1 : 0,
                              pointerEvents: clicked ? "all" : "none",
                              visibility: clicked ? "visible" : "hidden",
                              // transition-property: opacity, transform;
                            }}
                            aria-hidden={clicked ? "false" : "true"}
                          >
                            <div className={styles.modeInner}>
                              <div className={styles.modeDiv}>
                                <div className={styles.modeDivInner}>
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.linkInnerDiv2}>
                                      <div
                                        className={styles.navIcon}
                                        onClick={onClickBtn}
                                      >
                                        <div className={styles.iconInner}>
                                          <div className={styles.iconInnerDiv}>
                                            <div
                                              className={styles.iconInnerDiv2}
                                            >
                                              <span className={styles.iconSpan}>
                                                <svg
                                                  aria-label="돌아가기"
                                                  className={styles.iconSpansvg}
                                                  fill="currentColor"
                                                  height="12"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="12"
                                                >
                                                  <title>돌아가기</title>
                                                  <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path>
                                                </svg>
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.iconTitle}>
                                        <div className={styles.titleInner}>
                                          <div className={styles.spanOuter}>
                                            <span className={styles.Span2}>
                                              <span
                                                className={styles.innerSpan}
                                              >
                                                모드전환
                                              </span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.navIcon}>
                                        <div className={styles.innerIcon}>
                                          <div className={styles.innerIconDiv}>
                                            {darkMode ? (
                                              <svg
                                                aria-label="테마 아이콘"
                                                className={styles.Icon}
                                                fill="currentColor"
                                                height="18"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="18"
                                              >
                                                <title>테마 아이콘</title>
                                                <path d="M11.502,22.99805A11.4313,11.4313,0,0,1,.49512,14.83691a.99889.99889,0,0,1,.251-.998,1.01148,1.01148,0,0,1,.99707-.249,9.43041,9.43041,0,0,0,2.75879.40821A9.5082,9.5082,0,0,0,13.5957,1.74023a1.00039,1.00039,0,0,1,1.24707-1.248A11.501,11.501,0,0,1,11.502,22.99805ZM3.08984,15.91211A9.49991,9.49991,0,0,0,21.002,11.498,9.57875,9.57875,0,0,0,15.916,3.08594,11.5083,11.5083,0,0,1,3.08984,15.91211Z"></path>
                                              </svg>
                                            ) : (
                                              <svg
                                                aria-label="테마 아이콘"
                                                className={styles.Icon}
                                                fill="currentColor"
                                                height="18"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="18"
                                              >
                                                <title>테마 아이콘</title>
                                                <path d="M12.00018,4.5a1,1,0,0,0,1-1V2a1,1,0,0,0-2,0V3.5A1.00005,1.00005,0,0,0,12.00018,4.5ZM5.28241,6.69678A.99989.99989,0,1,0,6.69647,5.28271l-1.06054-1.061A.99989.99989,0,0,0,4.22186,5.63574ZM4.50018,12a1,1,0,0,0-1-1h-1.5a1,1,0,0,0,0,2h1.5A1,1,0,0,0,4.50018,12Zm.78223,5.30322-1.06055,1.061a.99989.99989,0,1,0,1.41407,1.41406l1.06054-1.061a.99989.99989,0,0,0-1.41406-1.41407ZM12.00018,19.5a1.00005,1.00005,0,0,0-1,1V22a1,1,0,0,0,2,0V20.5A1,1,0,0,0,12.00018,19.5Zm6.71729-2.19678a.99989.99989,0,0,0-1.41406,1.41407l1.06054,1.061A.99989.99989,0,0,0,19.778,18.36426ZM22.00018,11h-1.5a1,1,0,0,0,0,2h1.5a1,1,0,0,0,0-2ZM18.01044,6.98975a.996.996,0,0,0,.707-.293l1.06055-1.061A.99989.99989,0,0,0,18.364,4.22168l-1.06054,1.061a1,1,0,0,0,.707,1.707ZM12.00018,6a6,6,0,1,0,6,6A6.00657,6.00657,0,0,0,12.00018,6Zm0,10a4,4,0,1,1,4-4A4.00458,4.00458,0,0,1,12.00018,16Z"></path>
                                              </svg>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <DarkMode
                                onClickDark={onClickDark}
                                darkMode={darkMode}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles.navInnerOuter}
                          style={{
                            transform: clicked
                              ? "translateX(100%) translateZ(1px)"
                              : "translateX(200%) translateZ(1px)",
                          }}
                        ></div>
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
  );
}
