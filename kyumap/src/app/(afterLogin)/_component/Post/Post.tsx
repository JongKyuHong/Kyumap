"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import styles from "./post.module.css";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { IPost } from "@/model/Post";
import ActionButtons from "./ActionButtons";
import { useRouter } from "next/navigation";
import MoreInfoOverlay from "./MoreInfoOverlay";
import { useQuery } from "@tanstack/react-query";
import { IUser } from "@/model/User";
import { getUser } from "../../_lib/getUser";
import LoadingComponent from "@/app/_component/LoadingComponent";
import PostMedia from "./PostMedia";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface Props {
  post: IPost;
}

function Post({ post }: Props) {
  const [isMenu, setIsMenu] = useState(false);
  const router = useRouter();

  const { data: user, isLoading } = useQuery<
    IUser,
    Object,
    IUser,
    [string, string]
  >({
    queryKey: ["users", post?.userEmail as string],
    queryFn: getUser,
    enabled: !!post,
  });

  const closeMenu = () => {
    setIsMenu(false);
  };

  const onOpenDetail = useCallback(() => {
    setIsMenu(false);
    router.push(`/detailInfo/${post.postId}`);
  }, [router, post.postId]);

  if (!post || !user) return;

  return (
    <>
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
                      <Link
                        href={`/profile/${post?.userNickname}`}
                        style={{ height: "32px", width: "32px" }}
                        className={styles.articleUserSpan}
                      >
                        <Image
                          alt="프로필 사진"
                          src={`${user!.image}`}
                          width={32}
                          height={32}
                          className={styles.articleUserProfileImage}
                        />
                      </Link>
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
                                  href={`/profile/${post?.userNickname}`}
                                  className={styles.nameLink}
                                >
                                  <div className={styles.linkInnerDiv}>
                                    <div className={styles.linkInnerDiv2}>
                                      <span className={styles.linkInnerSpan}>
                                        {post.userNickname}
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
                    <div className={styles.articleDay}>
                      <span className={styles.articleDaySpan}>
                        <span className={styles.articleDayInnerSpan} dir="auto">
                          {"•"}
                        </span>
                      </span>
                      <div className={styles.articleDayDiv}>
                        <Link href="#" className={styles.articleDayLink}>
                          <span className={styles.articleDayLinkSpan}>
                            <time className={styles.articleDayTime}>
                              {dayjs(post.createdAt).fromNow(true)}
                            </time>
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.articleMoreInfo}>
                <div className={styles.articleMoreInfo2}>
                  <div
                    className={styles.articleMoreInfo3}
                    onClick={() => setIsMenu(!isMenu)}
                  >
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
              <PostMedia post={post} />
            </div>
            <div className={styles.articleBodyFooter}></div>
          </div>
          <ActionButtons post={post} />
        </div>
      </article>
      {isMenu && (
        <MoreInfoOverlay
          postId={Number(post.postId)}
          onClose={closeMenu}
          onOpenDetail={onOpenDetail}
        />
      )}
    </>
  );
}

export default React.memo(Post, (prevProps, nextProps) => {
  return prevProps.post.postId === nextProps.post.postId;
});
