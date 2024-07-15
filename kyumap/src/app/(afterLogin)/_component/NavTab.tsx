"use client";

import React, { useState, useEffect } from "react";
import styles from "./navtab.module.css";
import Image from "next/image";
import smallLogo from "../../../../public/smallLogo.png";
import smallLogodark from "../../../../public/smallLogodark.png";
import smallLogodark2 from "../../../../public/smallLogodark2.png";
import smallLogo2 from "../../../../public/smallLogo2.png";
import Link from "next/link";
import MenuDetail from "./MenuDetail";
import SearchTab from "./SearchTab";
import useDeviceSize from "./useDeviceSize";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { IUser } from "../../../model/User";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type Props = {
  me: any;
};

export default function NavTab() {
  const pathname = usePathname();
  const [isEx, setEx] = useState(false);
  const [clickedMenu, setMenu] = useState(false);
  const [isMounted, setMounted] = useState(true);
  const [isDark, setDark] = useState<boolean>(false);
  const [isHome, setHome] = useState<boolean>(
    pathname === "/home" ? true : false
  );
  const [isReels, setReels] = useState<boolean>(
    pathname === "/reels" ? true : false
  );
  const [isProfile, setProfile] = useState<boolean>(
    pathname.startsWith("/profile") ? true : false
  );
  const { isDesktop, isTablet, isMobile } = useDeviceSize();
  const { data: session } = useSession();

  // const userEmail = me?.user?.email;
  const userEmail = session?.user?.email;
  console.log(userEmail, session, "session");
  const queryClient = useQueryClient();

  const onClickEx = () => {
    if (isEx) {
      setEx(false);
      if (pathname === "/home") {
        setHome(true);
      }
    } else {
      setEx(true);
      setHome(false);
    }
    setMounted(false);
  };

  const onClickMenu = () => {
    setMenu(!clickedMenu);
  };

  useEffect(() => {
    setMounted(true);
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      console.log(isDark, "isDark");
      setDark(isDark);
      console.log(isDark, "isDark2");
      document.documentElement.setAttribute(
        "color-theme",
        isDark ? "dark" : "light"
      );
    }
  }, []);

  useEffect(() => {
    console.log(pathname.startsWith("/profile"), "pathname");
    setHome(pathname === "/home" ? true : false);
    setReels(pathname === "/reels" ? true : false);
    setProfile(pathname.startsWith("/profile") ? true : false);
  }, [pathname]);

  useEffect(() => {
    const invalidateQuery = async () => {
      await queryClient.invalidateQueries({ queryKey: ["users", userEmail] });
    };
    invalidateQuery();
  }, [queryClient, userEmail]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
  }, [isDark]);

  // useEffect(() => {
  //   if (!isEx) {
  //     const Anime = setTimeout(() => {}, 500);
  //     return () => {
  //       clearTimeout(Anime);
  //     };
  //   }
  // }, [isEx]);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", userEmail as string],
    queryFn: getUser,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
    enabled: !!userEmail,
  });

  if (userLoading) {
    return <div>로딩중...</div>;
  }

  const onClickDark = () => {
    if (isDark) {
      document.documentElement.setAttribute("color-theme", "light");
      setDark(false);
    } else {
      document.documentElement.setAttribute("color-theme", "dark");
      setDark(true);
    }
  };

  return (
    <>
      {userData &&
        (isMobile ? (
          <div className={styles.MleftSectionWrapper}>
            <div className={styles.MleftSectionOuter} tabIndex={-1}>
              <div className={styles.MleftSectionInner}>
                <div
                  className={styles.Mleft1}
                  style={{ transform: "translateX(0)" }}
                >
                  <div
                    className={styles.Mleft2}
                    style={{ transform: "translateX(0)" }}
                  >
                    <div className={styles.Mleft3}>
                      <div>
                        <div className={styles.MHomeBtn}>
                          <span
                            aria-describedby=":rt:"
                            className={styles.MHomeSpan}
                          >
                            <div className={styles.MHomeDiv}>
                              <Link
                                href={"/home"}
                                role="link"
                                tabIndex={0}
                                className={styles.MHomeLink}
                              >
                                <div className={styles.MHomeDiv2}>
                                  <div>
                                    <div className={styles.MHomeDiv3}>
                                      <div className={styles.MHomeDiv4}>
                                        {isHome ? (
                                          <svg
                                            aria-label="홈"
                                            className={styles.MSvg}
                                            fill="currentColor"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                          >
                                            <title>홈</title>
                                            <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
                                          </svg>
                                        ) : (
                                          <svg
                                            aria-label="홈"
                                            className={styles.MSvg}
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          </span>
                        </div>
                      </div>
                      <div>
                        <span
                          aria-describedby=":ru:"
                          className={styles.MHomeSpan}
                        >
                          <div className={styles.MHomeDiv}>
                            <Link
                              href="#" // /explore/
                              role="link"
                              tabIndex={0}
                              className={styles.MHomeLink}
                            >
                              <div className={styles.MHomeDiv2}>
                                <div>
                                  <div className={styles.MHomeDiv3}>
                                    <div className={styles.MHomeDiv4}>
                                      <svg
                                        aria-label="탐색 탭"
                                        className={styles.MSvg}
                                        fill="currentColor"
                                        height="24"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="24"
                                      >
                                        <title>탐색 탭</title>
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
                              </div>
                            </Link>
                          </div>
                        </span>
                      </div>
                      <div>
                        <span
                          aria-describedby=":rv:"
                          className={styles.MHomeSpan}
                        >
                          <div className={styles.MHomeDiv}>
                            <Link
                              href="#" // /explore/
                              role="link"
                              tabIndex={0}
                              className={styles.MHomeLink}
                            >
                              <div className={styles.MHomeDiv2}>
                                <div>
                                  <div className={styles.MHomeDiv3}>
                                    <div className={styles.MHomeDiv4}>
                                      <svg
                                        aria-label="릴스"
                                        className={styles.MSvg}
                                        fill="currentColor"
                                        height="24"
                                        role="img"
                                        viewBox="0 0 24 24"
                                        width="24"
                                      >
                                        <title>릴스</title>
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
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </span>
                      </div>
                      <div>
                        <div>
                          <div>
                            <span
                              aria-describedby=":r10:"
                              className={styles.MHomeSpan}
                            >
                              <div className={styles.MHomeDiv}>
                                <Link
                                  href="#" // /message/
                                  role="link"
                                  tabIndex={0}
                                  className={styles.MHomeLink}
                                >
                                  <div className={styles.MHomeDiv2}>
                                    <div>
                                      <div className={styles.MHomeDiv3}>
                                        <div className={styles.MHomeDiv4}>
                                          <svg
                                            aria-label="Direct"
                                            className={styles.MSvg}
                                            fill="currentColor"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                          >
                                            <title>Direct</title>
                                            <line
                                              fill="none"
                                              stroke="currentColor"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              x1="22"
                                              x2="9.218"
                                              y1="3"
                                              y2="10.083"
                                            ></line>
                                            <polygon
                                              fill="none"
                                              points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                                              stroke="currentColor"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                            ></polygon>
                                          </svg>
                                        </div>
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
                        <div className={styles.MDiv}>
                          <span
                            aria-describedby=":r11:"
                            className={styles.MHomeSpan}
                          >
                            <div className={styles.MHomeDiv}>
                              <Link
                                href={`/profile/${userData!.nickname}`} // /profile/myid me?.user?.name
                                role="link"
                                tabIndex={0}
                                className={styles.MHomeLink}
                              >
                                <div className={styles.MHomeDiv2}>
                                  <div>
                                    <div className={styles.MHomeDiv3}>
                                      <div className={styles.MHomeDiv4}>
                                        <span
                                          className={styles.MHomeSpan2}
                                          style={{
                                            height: "24px",
                                            width: "24px",
                                          }}
                                          tabIndex={-1}
                                          role="link"
                                        >
                                          <Image
                                            alt={`${
                                              userData!.nickname
                                            }님의 프로필`} // me?.user?.name
                                            height={0}
                                            width={0}
                                            sizes="100vw"
                                            src={`${userData!.image}`} // me?.user?.image
                                            className={styles.MImage}
                                          />
                                        </span>
                                      </div>
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
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.leftSectionWrapper}>
            <div className={styles.leftSectionOuter} tabIndex={-1}>
              <div className={styles.leftSectionInner}>
                <div
                  className={styles.leftSection}
                  style={{
                    width: isEx ? "72px" : "",
                    transform: isEx ? "translateX(-172px)" : "translateX(0px)",
                    transition: "transform 0.3s ease-in-out",
                  }}
                >
                  <div
                    className={styles.leftDiv2}
                    style={{
                      width: isEx ? "72px" : "",
                      transform: isEx ? "translateX(172px)" : "translateX(0px)",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  >
                    <div className={styles.logoOuter}>
                      <div className={styles.logoInner}>
                        {isEx || !isDesktop ? (
                          <div style={{ transform: "scale(1)" }}>
                            <span
                              className={styles.spanS}
                              aria-describedby=":r19:"
                            >
                              <div className={styles.divS}>
                                <Link
                                  className={styles.logoDetail}
                                  href={"/home"}
                                  role="link"
                                  tabIndex={0}
                                >
                                  <div className={styles.logoImageOuter}>
                                    <div className={styles.logoImageInner}>
                                      {isDark ? (
                                        <picture>
                                          <source
                                            srcSet={"/smallLogodark2.png"}
                                            width="24px"
                                            height="24px"
                                            media="(max-width: 1263px)"
                                          />
                                          <Image
                                            className={styles.logo}
                                            src={smallLogodark2}
                                            alt="logo"
                                            width={24}
                                            height={24}
                                          />
                                        </picture>
                                      ) : (
                                        <picture>
                                          <source
                                            srcSet={"/smallLogo2.png"}
                                            width="24px"
                                            height="24px"
                                            media="(max-width: 1263px)"
                                          />
                                          <Image
                                            className={styles.logo}
                                            src={smallLogo2}
                                            alt="logo"
                                            width={24}
                                            height={29}
                                          />
                                        </picture>
                                      )}
                                    </div>
                                  </div>
                                </Link>
                              </div>
                            </span>
                          </div>
                        ) : (
                          <div style={{ opacity: 1 }}>
                            <Link
                              className={styles.logoDetail}
                              href={"/home"}
                              role="link"
                              tabIndex={0}
                            >
                              <div className={styles.logoImageOuter}>
                                <div className={styles.logoImageInner}>
                                  {isDark ? (
                                    <picture>
                                      <source
                                        srcSet={"/smallLogodark.png"}
                                        width="24px"
                                        height="24px"
                                        media="(max-width: 1263px)"
                                      />
                                      <Image
                                        className={styles.logo}
                                        src={smallLogodark}
                                        alt="logo"
                                        width={103}
                                        height={29}
                                      />
                                    </picture>
                                  ) : (
                                    <picture>
                                      <source
                                        srcSet={"/smallLogo.png"}
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
                                  )}
                                </div>
                              </div>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.nav}>
                      <div>
                        <div
                          className={isDesktop ? styles.navDiv : styles.navDivW}
                        >
                          <span
                            aria-describedby=":r2:"
                            className={styles.navSpan}
                          >
                            <div
                              className={
                                isEx || !isDesktop
                                  ? styles.navSpanDivEx
                                  : styles.navSpanDiv
                              }
                            >
                              <Link
                                className={styles.navLink}
                                href={"/home"}
                                role="link"
                                tabIndex={0}
                              >
                                <div
                                  className={
                                    isEx || !isDesktop
                                      ? styles.LinkDivExHome
                                      : styles.LinkDivHome
                                  }
                                >
                                  <div>
                                    <div className={styles.navIconWrapper}>
                                      <div className={styles.navIcon}>
                                        {isHome ? (
                                          <svg
                                            aria-label="홈"
                                            className={styles.MSvg}
                                            fill="currentColor"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                          >
                                            <title>홈</title>
                                            <path d="M22 23h-6.001a1 1 0 0 1-1-1v-5.455a2.997 2.997 0 1 0-5.993 0V22a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V11.543a1.002 1.002 0 0 1 .31-.724l10-9.543a1.001 1.001 0 0 1 1.38 0l10 9.543a1.002 1.002 0 0 1 .31.724V22a1 1 0 0 1-1 1Z"></path>
                                          </svg>
                                        ) : (
                                          <svg
                                            aria-label="홈"
                                            className={styles.MSvg}
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isEx || !isDesktop ? null : (
                                    <div
                                      style={{ opacity: "1" }}
                                      className={styles.navTitle}
                                    >
                                      <div className={styles.titleOuter}>
                                        <span
                                          className={styles.titleInner}
                                          style={{ fontWeight: 700 }}
                                        >
                                          <span className={styles.titleSpan}>
                                            홈
                                          </span>
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
                        <div
                          className={
                            !isDesktop ? styles.navDivW : styles.navDiv
                          }
                        >
                          <span
                            aria-describedby=":r3:"
                            className={styles.navSpan}
                            onClick={onClickEx}
                          >
                            <div
                              className={
                                isEx || !isDesktop
                                  ? styles.navSpanDivEx
                                  : styles.navSpanDiv
                              }
                            >
                              <Link
                                href="#"
                                className={styles.navLink}
                                role="link"
                                tabIndex={0}
                              >
                                <div
                                  className={
                                    isEx || !isDesktop
                                      ? styles.LinkDivExHome
                                      : styles.LinkDivHome
                                  }
                                >
                                  <div>
                                    <div className={styles.navIconWrapper}>
                                      <div className={styles.navIcon}>
                                        {isEx ? (
                                          <svg
                                            aria-label="검색"
                                            className={styles.MSvg}
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
                                        ) : (
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isEx || !isDesktop ? null : (
                                    <div
                                      className={styles.navTitle}
                                      style={{
                                        display: isDesktop ? "" : "none ",
                                      }}
                                    >
                                      <div style={{ width: "100%" }}>
                                        <div style={{ width: "100%" }}>
                                          <span className={styles.titleInner}>
                                            <span className={styles.titleSpan}>
                                              검색
                                            </span>
                                          </span>
                                        </div>
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
                        <div
                          className={
                            !isDesktop ? styles.navDivW : styles.navDiv
                          }
                        >
                          <span
                            aria-describedby=":r3:"
                            className={styles.navSpan}
                          >
                            <div
                              className={
                                isEx || !isDesktop
                                  ? styles.navSpanDivEx
                                  : styles.navSpanDiv
                              }
                            >
                              <Link
                                href="/reels"
                                className={styles.navLink}
                                role="link"
                                tabIndex={0}
                              >
                                <div
                                  className={
                                    isEx || !isDesktop
                                      ? styles.LinkDivExHome
                                      : styles.LinkDivHome
                                  }
                                >
                                  <div>
                                    <div className={styles.navIconWrapper}>
                                      <div className={styles.navIcon}>
                                        {isReels ? (
                                          <svg
                                            aria-label="릴스"
                                            className={styles.Icon}
                                            fill="currentColor"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                          >
                                            <title>릴스</title>
                                            <path
                                              d="m12.823 1 2.974 5.002h-5.58l-2.65-4.971c.206-.013.419-.022.642-.027L8.55 1Zm2.327 0h.298c3.06 0 4.468.754 5.64 1.887a6.007 6.007 0 0 1 1.596 2.82l.07.295h-4.629L15.15 1Zm-9.667.377L7.95 6.002H1.244a6.01 6.01 0 0 1 3.942-4.53Zm9.735 12.834-4.545-2.624a.909.909 0 0 0-1.356.668l-.008.12v5.248a.91.91 0 0 0 1.255.84l.109-.053 4.545-2.624a.909.909 0 0 0 .1-1.507l-.1-.068-4.545-2.624Zm-14.2-6.209h21.964l.015.36.003.189v6.899c0 3.061-.755 4.469-1.888 5.64-1.151 1.114-2.5 1.856-5.33 1.909l-.334.003H8.551c-3.06 0-4.467-.755-5.64-1.889-1.114-1.15-1.854-2.498-1.908-5.33L1 15.45V8.551l.003-.189Z"
                                              fill-rule="evenodd"
                                            ></path>
                                          </svg>
                                        ) : (
                                          <svg
                                            aria-label="릴스"
                                            className={styles.Icon}
                                            fill="currentColor"
                                            height="24"
                                            role="img"
                                            viewBox="0 0 24 24"
                                            width="24"
                                          >
                                            <title>릴스</title>
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
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {isEx || !isDesktop ? null : (
                                    <div
                                      className={styles.navTitle}
                                      style={{
                                        display: isDesktop ? "" : "none ",
                                      }}
                                    >
                                      <div style={{ width: "100%" }}>
                                        <div style={{ width: "100%" }}>
                                          <span className={styles.titleInner}>
                                            <span className={styles.titleSpan}>
                                              릴스
                                            </span>
                                          </span>
                                        </div>
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
                        <div
                          className={
                            !isDesktop ? styles.navDivW : styles.navDiv
                          }
                        >
                          <span
                            className={styles.navSpan}
                            aria-describedby=":r8:"
                          >
                            <div
                              className={
                                isEx || !isDesktop
                                  ? styles.navSpanDivEx
                                  : styles.navSpanDiv
                              }
                            >
                              <Link
                                className={
                                  isEx ? styles.navLinkEx : styles.navLink
                                }
                                href="/AddPost"
                                role="link"
                                tabIndex={0}
                              >
                                <div
                                  className={
                                    isEx || !isDesktop
                                      ? styles.LinkDivExHome
                                      : styles.LinkDivHome
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
                                  {isEx || !isDesktop ? null : (
                                    <div className={styles.navTitle}>
                                      <div className={styles.titleOuter}>
                                        <span className={styles.titleInner}>
                                          <span className={styles.titleSpan}>
                                            새로운 게시물
                                          </span>
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
                        <div
                          className={isDesktop ? styles.navDiv : styles.navDivW}
                        >
                          <span
                            aria-describedby=":r2:"
                            className={styles.navSpan}
                          >
                            <div
                              className={
                                isEx || !isDesktop
                                  ? styles.navSpanDivEx
                                  : styles.navSpanDiv
                              }
                            >
                              <Link
                                className={styles.navLink}
                                href={`/profile/${userData!.nickname}`} // me?.user?.name
                                role="link"
                                tabIndex={0}
                              >
                                <div
                                  className={
                                    isEx || !isDesktop
                                      ? styles.LinkDivExHome
                                      : styles.LinkDivHome
                                  }
                                >
                                  <div>
                                    <div className={styles.navIconWrapper}>
                                      {isProfile && (
                                        <div
                                          className={styles.navProfile}
                                        ></div>
                                      )}
                                      <div className={styles.navIcon}>
                                        <span
                                          className={styles.profileImageSpan}
                                          style={{
                                            width: "24px",
                                            height: "24px",
                                          }}
                                          tabIndex={-1}
                                          role="link"
                                        >
                                          <Image
                                            src={`${userData!.image}`} // me?.user?.image
                                            alt="프로필"
                                            crossOrigin="anonymous"
                                            draggable="false"
                                            className={styles.ProfileImageImage}
                                            width={24}
                                            height={24}
                                          ></Image>
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  {isEx || !isDesktop ? null : (
                                    <div className={styles.navTitle}>
                                      <div className={styles.titleOuter}>
                                        <span className={styles.titleInner}>
                                          <span className={styles.titleSpan}>
                                            프로필
                                          </span>
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
                    </div>
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
                              <div
                                className={styles.menuTitleOuter}
                                style={{
                                  display: isDesktop ? "" : "none ",
                                }}
                              >
                                <div style={{ width: "100%" }}>
                                  <div style={{ width: "100%" }}>
                                    <span
                                      className={styles.menuSpan}
                                      style={{
                                        lineHeight: "20px",
                                      }}
                                    >
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
                    {clickedMenu ? (
                      <MenuDetail onClickDark={onClickDark} darkMode={isDark} />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
                {!isMounted && (
                  <div
                    style={{
                      transform: isEx ? "translateX(172px)" : "translateX(0%)",
                    }}
                    className={`${styles.containerOpen} ${
                      !isEx && styles.containerClose
                    }`}
                  >
                    <SearchTab onClickMounted={onClickEx} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
