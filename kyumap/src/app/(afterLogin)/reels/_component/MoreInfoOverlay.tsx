"use client";

import { useSession } from "next-auth/react";
import styles from "./moreInfoOverlay.module.css";
import { useRouter } from "next/navigation";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";
import { useEffect, useState } from "react";
import { IPost } from "@/model/Post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingComponent from "@/app/_component/LoadingComponent";

type Props = {
  postId: number;
  onClose: () => void;
  onOpenDetail: () => void;
};

export default function MoreInfoOverlay({
  postId,
  onClose,
  onOpenDetail,
}: Props) {
  const [post, setPost] = useState<IPost | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: postData } = useQuery<IPost, Object, IPost, [string, string]>({
    queryKey: ["posts", postId.toString()],
    queryFn: getPost,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  useEffect(() => {
    if (postData) {
      setPost(postData);
    }
  }, [postId, postData]);

  // 클립보드에 복사
  const handleCopy = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${postId}`;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("텍스트가 클립보드에 복사되었습니다!");
      })
      .catch((err) => {
        console.error("텍스트 복사 실패:", err);
      });

    // router.back();
  };

  // 게시글 삭제
  const deletePost = useMutation({
    mutationFn: () => {
      return fetch(`/api/posts/${postId}`, {
        method: "delete",
        body: JSON.stringify(session?.user!.email),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["posts", "recommends"],
      });
      const previousUserData = queryClient.getQueryData([
        "users",
        session!.user!.email,
      ]);

      queryClient.setQueryData(["users", session!.user!.email], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          _count: {
            ...old._count,
            posts: old._count.posts - 1,
          },
        };
      });

      return { previousUserData };
    },
    onError: (error, variable, context) => {
      if (context && context.previousUserData) {
        queryClient.setQueryData(
          ["users", session?.user?.email],
          context.previousUserData
        );
      }
      console.error("게시글 삭제 중 오류 발생:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", "recommends"],
      });
    },
    onSettled: () => {},
  });

  const onClickArticleDelete = async () => {
    deletePost.mutate();
    router.back();
  };

  if (!post) {
    return <LoadingComponent />;
  }

  return (
    <div className={styles.rootMenu1} onClick={onClose}>
      <div className={styles.rootMenu2}>
        <div className={styles.rootMenu3} onClick={(e) => e.stopPropagation()}>
          <div className={styles.rootMenu4}></div>
          <div className={styles.rootMenu5}>
            <div className={styles.rootMenu}>
              <div className={styles.menuDiv}>
                <div role="dialog" className={styles.menuDiv2}>
                  <div className={styles.menuDiv3}>
                    <div></div>
                    <div className={styles.menuDiv4}>
                      <div className={styles.menuDiv5}>
                        <div className={styles.menuDiv6}>
                          {post.userEmail === session?.user!.email ? (
                            <>
                              <button
                                className={styles.menuBtn}
                                onClick={onClickArticleDelete}
                              >
                                삭제
                              </button>
                              <button className={styles.menuBtn2}>수정</button>
                              <button className={styles.menuBtn2}>
                                다른 사람에게 좋아요 수 숨기기 취소
                              </button>
                              <button className={styles.menuBtn2}>
                                댓글 기능 설정
                              </button>
                              <button
                                className={styles.menuBtn2}
                                onClick={onOpenDetail}
                              >
                                게시물로 이동
                              </button>
                              <button
                                className={styles.menuBtn2}
                                onClick={onClose}
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button className={styles.menuBtn}>신고</button>
                              <button className={styles.menuBtn2}>
                                관심 없음
                              </button>
                              <button
                                className={styles.menuBtn2}
                                onClick={onOpenDetail}
                              >
                                게시물로 이동
                              </button>
                              <button className={styles.menuBtn2}>
                                공유 대상...
                              </button>
                              <button
                                className={styles.menuBtn2}
                                onClick={handleCopy}
                              >
                                링크 복사
                              </button>
                              <button
                                className={styles.menuBtn2}
                                onClick={onClose}
                              >
                                취소
                              </button>
                            </>
                          )}
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
  );
}
