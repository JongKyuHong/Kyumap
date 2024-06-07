"use client";

import styles from "../profile.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { IUser } from "@/model/User";
import { IPost } from "@/model/Post";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/app/(afterLogin)/_lib/getUser";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { MouseEventHandler } from "react";
import UserPosts from "./UserPosts";
import Image from "next/image";

type Props = {
  userEmail: string;
};

export default function ProfileSection({ userEmail }: Props) {
  const [followed, setFollowed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isMe, setMe] = useState(false);

  // userData나 session이 변경될 때마다 팔로우 상태를 업데이트

  const { data: session } = useSession();

  const queryClient = useQueryClient();

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", userEmail],
    queryFn: getUser,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  useEffect(() => {
    const isFollowed = !!userData?.Followers?.find(
      (v) => v.email === session?.user?.email
    );
    setFollowed(isFollowed);
  }, [userData, session]);

  useEffect(() => {
    if (session) {
      if (userEmail === session?.user!.email) {
        setMe(true);
      }
    }
  }, [userEmail, session]);

  // const followed = !!userData?.Followers?.find(
  //   (v) => v.email === session?.user?.email
  // );

  const follow = useMutation({
    mutationFn: (userEmail: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/follow`,
        {
          credentials: "include",
          method: "post",
          body: JSON.stringify(session?.user?.email),
        }
      );
    },
    onMutate(userEmail: string) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.email === userEmail);
        const shallow: any = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: [{ email: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: IUser | undefined = queryClient.getQueryData([
        "users",
        userEmail,
      ]);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userEmail], shallow);
      }
    },
    onError(error, userId: string) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.email === userId);
        const shallow: any = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v: any) => v.email !== session?.user?.email
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: IUser | undefined = queryClient.getQueryData([
        "users",
        userEmail,
      ]);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.email !== session?.user?.email
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", userEmail], shallow);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userEmail] });
      setFollowed(true);
    },
  });

  const unfollow = useMutation({
    mutationFn: (userEmail: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/follow`,
        {
          credentials: "include",
          method: "delete",
          body: JSON.stringify(session?.user?.email),
        }
      );
    },
    onMutate(userEmail: string) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.email === userEmail);
        const shallow: any = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v: any) => v.email !== session?.user?.email
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: IUser | undefined = queryClient.getQueryData([
        "users",
        userEmail,
      ]);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: value2.Followers.filter(
            (v) => v.email !== session?.user?.email
          ),
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", userEmail], shallow);
      }
    },
    onError(error, userEmail: string) {
      const value: IUser[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.email === userEmail);
        const shallow: any = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: [{ email: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: IUser | undefined = queryClient.getQueryData([
        "users",
        userEmail,
      ]);
      if (value2) {
        const shallow = {
          ...value2,
          Followers: [{ email: session?.user?.email as string }],
          _count: {
            ...value2._count,
            Followers: value2._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", userEmail], shallow);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userEmail] });
      setFollowed(false);
    },
  });

  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (followed) {
      unfollow.mutate(userEmail);
    } else {
      follow.mutate(userEmail);
    }
  };

  if (!userData) return null;
  if (!session) return null;

  if (userError) {
    return (
      <section className={styles.MainSection}>
        <main className={styles.Main}>
          <div style={{ maxWidth: "100%" }}>
            <div className={styles.errorDiv}>
              <span style={{ lineHeight: "30px" }} className={styles.errorSpan}>
                {"죄송합니다. 페이지를 사용할 수 없습니다."}
              </span>
              <div className={styles.errorDiv2}>
                <span
                  style={{ lineHeight: "20px" }}
                  className={styles.errorSpan2}
                >
                  {"클릭사힌 링크가 잘못되었거나 페이지가 삭제되었습니다."}
                  <Link
                    href="/home"
                    role="link"
                    tabIndex={0}
                    className={styles.goHome}
                  >
                    {"홈으로 돌아가기"}
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </main>
      </section>
    );
  }

  return (
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
                    width={0}
                    height={0}
                    sizes="100vw"
                    src={`${userData?.image}`}
                    alt={`${userData?.nickname}의 프로필 사진 `}
                    crossOrigin="anonymous"
                    draggable="false"
                    className={styles.ProfileImage}
                  />
                </span>
              </div>
            </div>
            <section className={styles.HeaderSection}>
              <div className={styles.HeaderSectionNameDiv}>
                <Link href="#" role="link" tabIndex={0}>
                  <h2 className={styles.NameH2} dir="auto" tabIndex={-1}>
                    {`${userData?.email}`}
                  </h2>
                </Link>
                <div className={styles.HeaderSectionEmo}>
                  <div className={styles.HeaderSectionFollowBtn}>
                    <div
                      className={styles.HeaderSectionFollowBtn2}
                      tabIndex={0}
                    >
                      {!isMe && (
                        <button
                          className={styles.HeaderSectionFollowBtn4}
                          style={{
                            backgroundColor: followed
                              ? "rgb(239, 239, 239)"
                              : "rgb(0, 149, 246)",
                            color: followed ? "rgb(0,0,0)" : "rgb(255,255,255)",
                          }}
                          type="button"
                          onClick={onFollow}
                        >
                          <div
                            className={styles.HeaderSectionFollowBtn5}
                            style={{ height: "100%" }}
                          >
                            <div
                              className={styles.HeaderSectionFollowBtn6}
                              dir="auto"
                              onMouseEnter={() => setHovered(true)}
                              onMouseLeave={() => setHovered(false)}
                            >
                              {followed
                                ? hovered
                                  ? "팔로우 취소"
                                  : "팔로잉"
                                : "팔로우"}
                            </div>
                          </div>
                        </button>
                      )}
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
                    <span className={styles.InfoInnerSpan}>{`${
                      userData?._count?.Followers || 0
                    }`}</span>
                  </span>
                </li>
                <li className={styles.InfoLi}>
                  {"팔로우 "}
                  <span className={styles.InfoSpan}>
                    <span className={styles.InfoInnerSpan}>{`${
                      userData?._count?.Followings || 0
                    }`}</span>
                  </span>
                </li>
              </ul>
              <div className={styles.ProfileContent}>
                <div className={styles.ProfileContentId}>
                  <span className={styles.ProfileContentIdSpan}>
                    {`${userData?.nickname}`}
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
            <Link href="#" role="tab" tabIndex={0} className={styles.PostLink}>
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
          <UserPosts userEmail={userEmail} />
        </div>
      </main>
    </section>
  );
}
