"use client";

import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/model/User";
import { getFollowRecommends } from "@/app/(afterLogin)/_lib/getFollowRecommends";
import FollowList from "@/app/(afterLogin)/_component/FollowList";
import styles from "./mainsection.module.css";
import useDeviceSize from "./useDeviceSize";
import Link from "next/link";
import Image from "next/image";
import { Session } from "@auth/core/types";
import { useSession } from "next-auth/react";

// type Props = {
//   me: Session | null;
// };

export default function FollowRecommendSection() {
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  const { data: session } = useSession();
  const { data: RecommendsData, isLoading } = useQuery<IUser[]>({
    queryKey: ["users", "followRecommends", session?.user!.email],
    queryFn: () => getFollowRecommends(session?.user!.email as string),
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });
  if (isLoading) {
    return <p>로딩중...</p>;
  }
  if (!isDesktop || !session) return null;

  return (
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
                            href={`/profile/${session?.user?.email}`}
                            className={styles.ImageLink}
                            style={{ height: "44px", width: "44px" }}
                            tabIndex={0}
                            role="link"
                          >
                            <Image
                              className={styles.ProfileImage}
                              crossOrigin="anonymous"
                              draggable="false"
                              width={44}
                              height={44}
                              alt={`${session?.user?.name}님의 프로필`}
                              src={`${session?.user?.image}`}
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
                              href={`/profile/${session?.user?.email}`}
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
                                  {`${session?.user?.name}`}
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
                        {RecommendsData &&
                          RecommendsData?.map((user, index) => (
                            <FollowList user={user} key={index} />
                          ))}
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
