"use client";

import React, {
  useState,
  ChangeEvent,
  MouseEventHandler,
  useEffect,
  useRef,
} from "react";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
  useQuery,
} from "@tanstack/react-query";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./post.module.css";
import { IPost } from "@/model/Post";
import { useRouter } from "next/navigation";
import { getUser } from "../../_lib/getUser";
import { IComment } from "@/model/Comment";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";
import {
  useComment,
  useHeart,
  useSave,
  useUnheart,
  useUnsave,
} from "../../_lib/mutateFactory";
import mongoose from "mongoose";
import { getSearchUsers } from "../../_lib/getSearchUsers";
import UserSearchModal from "./UserSearchModal";
import ReactDOM from "react-dom";

interface Props {
  post: IPost;
  otherText?: string | undefined;
  rootId?: mongoose.Types.ObjectId | null;
}

interface IUserSearchResult {
  _id: mongoose.Types.ObjectId | null;
  email: string;
  nickname: string;
  image: string;
}

export default function ActionButtons({ post, otherText, rootId }: Props) {
  // Post의 버튼들을 따로 다루는 컴포넌트
  const { data: session } = useSession();
  const [CommentText, setComment] = useState(otherText ?? "");
  const [isLiked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  // 좋아요 중복 방지용 state
  const [isSaved, setSaved] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [threadId, setThreadId] = useState<mongoose.Types.ObjectId | null>(
    null
  );
  const [isSearchingUsers, setIsSearchingUsers] = useState(false); // 사용자 검색 모드 상태
  const [searchTerm, setSearchTerm] = useState(""); // @ 뒤의 검색어 상태
  const [mentionTriggerIndex, setMentionTriggerIndex] = useState(-1); // @ 기호의 위치 인덱스
  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: user } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", session?.user?.email as string],
    queryFn: getUser,
    enabled: !!session?.user?.email, // session과 email이 있을 때만 쿼리 실행
  });

  const { data: searchResults, isLoading: isSearching } = useQuery<
    IUserSearchResult[],
    Object,
    IUserSearchResult[],
    [string, string]
  >({
    // 실제 데이터 타입 명시
    queryKey: ["userSearch", searchTerm],
    queryFn: getSearchUsers,
    enabled: isSearchingUsers && searchTerm.length >= 1, // 검색 모드이고 검색어 1글자 이상일 때만 실행
    staleTime: 1000 * 60 * 1,
  });

  const commentInputRef = useRef<HTMLDivElement | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // 댓글창 위치 계산
  useEffect(() => {
    if (commentInputRef.current) {
      const rect = commentInputRef.current.getBoundingClientRect();
      setModalPosition({
        top: rect.top - 20, // 댓글창 위로 100px 띄움 (원하는 만큼 조정)
        left: rect.left,
      });
    }
  }, [isSearchingUsers]);

  useEffect(() => {
    if (otherText) {
      setComment(otherText);
    }
  }, [otherText]);

  useEffect(() => {
    if (rootId) {
      setThreadId(rootId);
    }
  }, [rootId]);

  useEffect(() => {
    if (!user) return;
    const ssave = !!user?.Saved.find(
      (v: any) => v.id === post.postId.toString()
    );

    const liked = !!post?.Hearts?.find((v) => v.email === session?.user?.email);

    setLiked(liked);
    setSaved(ssave);
  }, [user, post, session?.user?.email]);

  const router = useRouter();

  const { postId } = post;

  const heart = useHeart({ setIsLiking, isLiking });

  const unheart = useUnheart({ setIsLiking, isLiking });

  const saved = useSave({ setSaved });

  const unsaved = useUnsave({ setSaved });

  const addComment = useComment({
    postId,
    isPosting,
    setIsPosting,
    setComment,
    setThreadId,
  });

  // 하트를 클릭했을때
  const onClickHeart: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isLiking) return;
    if (isLiked) {
      // 이미 좋아요를 눌렀으면
      // unheart.mutate();
      unheart.mutate({ postId, session });
    } else {
      // heart.mutate();
      heart.mutate({ postId, session });
    }
  };

  // 저장됨 클릭
  const onClickSaved: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    if (isSaved) {
      // 이미 저장함
      // unsaved.mutate();
      unsaved.mutate({ postId, session });
    } else {
      // saved.mutate();
      saved.mutate({ postId, session });
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // 이벤트 타입 명시
    const newValue = event.target.value;
    setComment(newValue);

    const atIndex = newValue.lastIndexOf("@");

    if (atIndex !== -1) {
      const textAfterAt = newValue.substring(atIndex + 1);
      if (!textAfterAt.includes(" ")) {
        // @ 뒤의 텍스트가 공백 없이 이어지고 있다면, 검색 모드로 전환합니다.
        setIsSearchingUsers(true); // 사용자 검색 모드 ON
        setSearchTerm(textAfterAt); // @ 뒤의 텍스트를 검색어로 설정
        setMentionTriggerIndex(atIndex); // @ 기호의 위치 인덱스 저장 (나중에 사용자 선택 시 삽입 위치 계산에 사용)
      } else {
        // @ 뒤에 공백이 있다면, 사용자 검색 모드를 종료합니다.
        setIsSearchingUsers(false); // 사용자 검색 모드 OFF
        setSearchTerm(""); // 검색어 초기화
        setMentionTriggerIndex(-1); // @ 위치 초기화
      }
    } else {
      // @ 기호가 없다면, 사용자 검색 모드를 종료합니다.
      setIsSearchingUsers(false); // 사용자 검색 모드 OFF
      setSearchTerm(""); // 검색어 초기화
      setMentionTriggerIndex(-1); // @ 위치 초기화
    }

    // 입력창 내용 전체가 비워지면 (모두 삭제 등), 검색 모드를 종료합니다.
    if (newValue === "") {
      setIsSearchingUsers(false);
      setSearchTerm("");
      setMentionTriggerIndex(-1);
    }
  };

  const handleSelectUser = (user: {
    _id: mongoose.Types.ObjectId | null;
    nickname: string;
    email: string;
    image: string;
  }) => {
    const mentionRegex = /@\S*$/; // 마지막 '@'로 시작하는 단어를 찾음
    const replaced = CommentText.replace(mentionRegex, `@${user.nickname}`);
    setComment(replaced + " ");
    setThreadId(user._id);
    setIsSearchingUsers(false);
  };

  // 게시를 클릭하면 디테일 페이지로 이동하게
  const onSubmitComment = () => {
    // router.push(`/detail/${postId}`);
    if (!session) {
      return router.push(`/NewLogin`);
    }
    const userSession = session.user;
    addComment.mutate({ postId, threadId, CommentText, userSession });
  };

  const searchResultsModal =
    isClient && typeof window !== "undefined"
      ? ReactDOM.createPortal(
          <UserSearchModal
            isSearchingUsers={isSearchingUsers}
            searchTerm={searchTerm}
            searchResults={searchResults}
            handleSelectUser={handleSelectUser}
            isSearching={isSearching}
            position={modalPosition}
            onClose={() => setIsSearchingUsers(false)}
          />,
          document.body
        )
      : null;

  return (
    <div className={styles.articleContent}>
      <div className={styles.articleContentDiv}>
        <div>
          <div className={styles.postIcon}>
            <div className={styles.leftSectionIcon}>
              <span className={styles.iconSpan}>
                <div
                  className={`${styles.iconDiv} ${
                    isLiked ? styles.clicked : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  onClick={onClickHeart}
                >
                  <div className={styles.iconInnerDiv}>
                    <span className={styles.iconInnerDivSpan}>
                      <svg
                        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                        className={
                          isLiked ? styles.iconSvgClicked : styles.iconSvg
                        }
                        fill="currentColor"
                        height="24"
                        role="img"
                        viewBox={isLiked ? "0 0 48 48" : "0 0 24 24"}
                        width="24"
                      >
                        <title>{isLiked ? "좋아요 취소" : "좋아요"}</title>
                        <path
                          d={
                            isLiked
                              ? "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"
                              : "M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"
                          }
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </span>
              {!post.hideComments && (
                <span>
                  <Link href={`/detail/${postId}`}>
                    <div className={styles.iconDiv} role="button" tabIndex={0}>
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
                  </Link>
                </span>
              )}
            </div>
            <div className={styles.rightSectionIcon}>
              <div>
                <div
                  aria-disabled="false"
                  role="button"
                  style={{ cursor: "pointer" }}
                  onClick={onClickSaved}
                >
                  <div
                    className={styles.iconInnerDiv2}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={styles.iconSvgOuterDiv}>
                      {isSaved ? (
                        <svg
                          aria-label="삭제"
                          className={styles.iconSvg}
                          fill="currentColor"
                          height="24"
                          role="img"
                          viewBox="0 0 24 24"
                          width="24"
                        >
                          <title>삭제</title>
                          <path d="M20 22a.999.999 0 0 1-.687-.273L12 14.815l-7.313 6.912A1 1 0 0 1 3 21V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1Z"></path>
                        </svg>
                      ) : (
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
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!post.hideLikesAndViews && (
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
                        {"좋아요 "}
                        <span className={styles.likeCountSpan}>
                          {post._count?.Hearts || 0}
                        </span>
                        {"개"}
                      </span>
                    </Link>
                  </span>
                </div>
              </div>
            </section>
          )}
          <div className={styles.postContent}>
            <div className={styles.postUserName}>
              <span className={styles.postUserNameSpan}>
                <div>
                  <Link
                    href={`/profile/${post.userNickname}`}
                    className={styles.postUserProfile}
                    role="link"
                    tabIndex={0}
                  >
                    {post.userNickname}
                  </Link>
                </div>
              </span>
            </div>
            <span className={styles.postContentSpan} dir="auto">
              <span className={styles.postContentSpan} dir="auto">
                {post.content}
                <br />
                <br />
                {/* {post.hashTag.map((hash, index) => (
                      <Link
                        href={`/explore/tags/${post.hash}`}
                        className={styles.hashTag}
                      >
                        {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                      </Link>
                    ))} */}
                {/* <Link
                  href={`/explore/tags/${post.hashTag}`}
                  className={styles.hashTag}
                >
                  {"#해시태그 내용#누르면 해시태그 검색 창으로"}
                </Link> */}
              </span>
            </span>
          </div>
          {!post.hideComments && (
            <div className={styles.postComment}>
              <Link
                href={`/detail/${post.postId}`}
                className={styles.commentLink}
                role="link"
                tabIndex={0}
              >
                <span
                  style={{ lineHeight: "18px" }}
                  className={styles.linkCommentSpan}
                  dir="auto"
                >
                  <span className={styles.linkCommentInnerSpan}>{"댓글 "}</span>
                  {`${post._count.Comments}개 모두 보기`}
                </span>
              </Link>
            </div>
          )}
          {!post.hideComments && (
            <>
              <div className={styles.commentInput} ref={commentInputRef}>
                <section className={styles.inputSection}>
                  <div className={styles.inputSecitonDiv}>
                    <form className={styles.formInput} method="POST">
                      <div className={styles.formInputDiv}>
                        <div className={styles.formInputInnerDiv}>
                          <div
                            className={styles.formInputInnerDiv2}
                            role="button"
                            tabIndex={0}
                          >
                            <div className={styles.formInputInnerDiv3}>
                              <svg
                                aria-label="이모티콘"
                                className={styles.Emoticon}
                                fill="currentColor"
                                height="13"
                                role="img"
                                viewBox="0 0 24 24"
                                width="13"
                              >
                                <title>이모티콘</title>
                                <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <textarea
                          name="comment"
                          aria-label="댓글 달기..."
                          className={styles.formInputTextArea}
                          placeholder="댓글 달기..."
                          autoComplete="off"
                          autoCorrect="off"
                          value={CommentText}
                          onChange={handleTextareaChange}
                        ></textarea>
                        {CommentText ? (
                          <div className={styles.EnterBtn}>
                            <div
                              className={styles.EnterDiv}
                              role="button"
                              tabIndex={0}
                              onClick={onSubmitComment}
                            >
                              게시
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </form>
                  </div>
                </section>
              </div>
              {searchResultsModal}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
