"use client";
import styles from "./mainsection.module.css";

import Image from "next/image";
import Link from "next/link";
import chi from "../../../../public/chi.png";
import cx from "classnames";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { User } from "@/model/User";
import { MouseEventHandler } from "react";

type Props = {
  user: User;
};

export default function FollowList({ user }: Props) {
  const { data: session } = useSession();
  const followed = !!user.Followers?.find((v) => v.id === session?.user?.email);
  const queryClient = useQueryClient();

  const follow = useMutation({
    mutationFn: (userId: string) => {
      console.log("follow", userId);
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: "include",
          method: "post",
        }
      );
    },
    onMutate(userId: string) {
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        console.log(value, userId, index);
        const shallow = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: User | undefined = queryClient.getQueryData([
        "users",
        userId,
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
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
    onError(error, userId: string) {
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        console.log(value, userId, index);
        const shallow = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.id !== session?.user?.email
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
        const value2: User | undefined = queryClient.getQueryData([
          "users",
          userId,
        ]);
        if (value2) {
          const shallow = {
            ...value2,
            Followers: value2.Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...value2._count,
              Followers: value2._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", userId], shallow);
        }
      }
    },
  });
  const unfollow = useMutation({
    mutationFn: (userId: string) => {
      console.log("unfollow", userId);
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/follow`,
        {
          credentials: "include",
          method: "delete",
        }
      );
    },
    onMutate(userId: string) {
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        console.log(value, userId, index);
        const shallow = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: shallow[index].Followers.filter(
            (v) => v.id !== session?.user?.email
          ),
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers - 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
        const value2: User | undefined = queryClient.getQueryData([
          "users",
          userId,
        ]);
        if (value2) {
          const shallow = {
            ...value2,
            Followers: value2.Followers.filter(
              (v) => v.id !== session?.user?.email
            ),
            _count: {
              ...value2._count,
              Followers: value2._count?.Followers - 1,
            },
          };
          queryClient.setQueryData(["users", userId], shallow);
        }
      }
    },
    onError(error, userId: string) {
      const value: User[] | undefined = queryClient.getQueryData([
        "users",
        "followRecommends",
      ]);
      if (value) {
        const index = value.findIndex((v) => v.id === userId);
        console.log(value, userId, index);
        const shallow = [...value];
        shallow[index] = {
          ...shallow[index],
          Followers: [{ id: session?.user?.email as string }],
          _count: {
            ...shallow[index]._count,
            Followers: shallow[index]._count?.Followers + 1,
          },
        };
        queryClient.setQueryData(["users", "followRecommends"], shallow);
      }
      const value2: User | undefined = queryClient.getQueryData([
        "users",
        userId,
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
        queryClient.setQueryData(["users", userId], shallow);
      }
    },
  });
  const onFollow: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (followed) {
      unfollow.mutate(user.id);
    } else {
      follow.mutate(user.id);
    }
  };

  return (
    <div className={styles.RecommendtionListDiv2}>
      <div className={styles.RecommendtionListDiv2InnerDiv}>
        <div className={styles.RecommendtionListDiv2InnerDiv2}>
          <div className={styles.RecommendtionListDiv2InnerDiv3}>
            <div className={styles.RecommendtionListDiv2Image}>
              <div className={styles.RecommendtionListDiv2ImageDiv}>
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
                        href={`${user?.id}`}
                        role="link"
                        tabIndex={0}
                        style={{
                          height: "44px",
                          width: "44px",
                        }}
                        className={styles.ImageLink2}
                      >
                        <Image
                          alt={`${user?.nickname}님의 프로필 사진`}
                          crossOrigin="anonymous"
                          draggable="false"
                          src={`${user?.image}`}
                          width={44}
                          height={44}
                          className={styles.ImageLink2Image}
                        ></Image>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.RecommendationListDiv2Info}>
              <div className={styles.RecommendationListDiv2InfoInner}>
                <div className={styles.RecommendationListDiv2InfoInner2}>
                  <div className={styles.IdSection}>
                    <div className={styles.IdSectionDiv}>
                      <div>
                        <Link
                          href={`/profile/${user?.id}`}
                          role="link"
                          tabIndex={0}
                          className={styles.IdSectionLink}
                        >
                          <div className={styles.IdSectionLinkInner}>
                            <div className={styles.IdSectionLinkInner2}>
                              <span className={styles.IdSectionSpan} dir="auto">
                                {`${user?.nickname}`}
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
                    <span className={styles.SpanSectionInner}>
                      {"회원님을 위한 추천"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.RecommendationListDiv2FBtn}>
              <div className={styles.FBtnInner}>
                <button
                  className={cx(
                    styles.FBtn,
                    followed ? styles.DarkColor : styles.PrimaryColor
                  )}
                  onClick={onFollow}
                >
                  <div className={styles.FBtnDiv} style={{ height: "100%" }}>
                    <div className={styles.FBtnDivInner}>
                      {followed ? "팔로잉" : "팔로우"}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
