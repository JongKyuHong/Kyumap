import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { IComment } from "@/model/Comment";
import { useSession } from "next-auth/react";
import { IUser } from "@/model/User";
import { IPost } from "@/model/Post";

// Like a comment
export function useCommentHeart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/heart`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });

      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        const updatedComments = previousComments.map((comment) =>
          comment._id === commentData.commentId
            ? {
                ...comment,
                _count: {
                  ...comment._count,
                  Hearts: comment._count.Hearts + 1,
                },
                Hearts: [
                  ...(comment.Hearts || []),
                  commentData.userSession.email,
                ],
              }
            : comment
        );

        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
    },
  });
}

// Unlike a comment
export function useCommentUnheart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/heart`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });

      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        const updatedComments = previousComments.map((comment) => {
          if (comment._id === commentData.commentId) {
            return {
              ...comment,
              Hearts: comment.Hearts.filter(
                (heart) => heart.email !== commentData.userSession.email
              ),
              _count: {
                ...comment._count,
                Hearts: comment._count.Hearts - 1,
              },
            };
          }
          return comment;
        });

        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
    },
  });
}

export function useFollow() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (userEmail: string) => {
      return fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/follow`, //
        {
          credentials: "include",
          method: "post",
          body: JSON.stringify(session?.user?.email),
        }
      );
    },
    onMutate(userEmail: string) {
      // 추천 팔로우 목록 상태 업데이트
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
      // 해당 유저 상태 업데이트
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
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["users", "followRecommends"],
      });
    },
  });
}

export function useUnFollow() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
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
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["users", "followRecommends"],
      });
    },
  });
}

export function useCommentReplyHeart(
  setCommentLiked: (value: boolean) => void
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/reply/heart`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      // 이전 댓글 데이터를 가져옵니다.
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        // 좋아요를 누른 댓글의 좋아요 수를 업데이트합니다.
        const updatedComments = previousComments.map((comment) =>
          comment._id === commentData.commentId
            ? {
                ...comment,
                _count: {
                  ...comment._count,
                  Hearts: comment._count.Hearts + 1,
                },
                Hearts: [
                  ...(comment.Hearts || []),
                  commentData.userSession.email,
                ],
              }
            : comment
        );

        // 업데이트된 댓글 데이터를 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      // 성공 시, 최신 데이터를 가져오기 위해 캐시를 무효화합니다.
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      setCommentLiked(true);
    },
  });
}

export function useCommentReplyUnHeart(
  setCommentLiked: (value: boolean) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      postId: string;
      commentId: string;
      userSession: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.commentId}/reply/heart`,
        {
          credentials: "include",
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userSession: commentData.userSession }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async (commentData) => {
      await queryClient.cancelQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });

      // 이전 댓글 데이터를 가져옵니다.
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);

      if (previousComments) {
        // 좋아요를 취소한 댓글의 좋아요 수를 업데이트하고 이메일 정보를 삭제합니다.
        const updatedComments = previousComments.map((comment) => {
          if (comment._id === commentData.commentId) {
            return {
              ...comment,
              Hearts: comment.Hearts.filter(
                (heart) => heart.email !== commentData.userSession.email
              ),
              _count: {
                ...comment._count,
                Hearts: comment._count.Hearts - 1,
              },
            };
          }
          return comment;
        });

        // 업데이트된 댓글 데이터를 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId, "comments"],
          updatedComments
        );
      }

      return { previousComments };
    },
    onError: (error, commentData, context) => {
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        context?.previousComments
      );
    },
    onSuccess: (data, commentData) => {
      // 성공 시, 최신 데이터를 가져오기 위해 캐시를 무효화합니다.
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      setCommentLiked(false);
    },
  });
}

export function useHeart({ setIsLiking, isLiking }: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      session,
    }: {
      postId: number;
      session: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async ({ postId, session }: { postId: number; session: any }) => {
      // 요청이 이미 진행 중이면 아무것도 하지 않음
      if (isLiking) return;
      setIsLiking(true); // 요청 시작 시 상태 업데이트

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      // 쿼리 키가 "posts"로 시작하는지 확인
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: IPost | InfiniteData<IPost[]> | undefined =
            queryClient.getQueryData(queryKey);

          if (value && "pages" in value) {
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );

              // 얕은 복사 준비
              const shallow: any = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];

              // 포스트 데이터 업데이트
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: [{ email: session?.user?.email as string }],
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
                },
              };

              // 캐시 업데이트
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 단일 포스트면
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: [{ email: session?.user?.email as string }],
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts + 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onError: (error, { postId, session }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onSettled: () => {
      setIsLiking(false); // 중복 방지를 위한 상태 변경
    },
  });
}

export function useUnheart({ setIsLiking, isLiking }: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      postId,
      session,
    }: {
      postId: number;
      session: any;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
        {
          method: "DELETE",
          credentials: "include",
          body: JSON.stringify(session),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async ({ postId, session }: { postId: number; session: any }) => {
      // 요청이 이미 진행 중이면 아무것도 하지 않음
      if (isLiking) return;
      setIsLiking(true); // 요청 시작 시 상태 업데이트

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);

      // 쿼리 키가 "posts"로 시작하는지 확인
      queryKeys.forEach((queryKey) => {
        if (queryKey[0] === "posts") {
          const value: IPost | InfiniteData<IPost[]> | undefined =
            queryClient.getQueryData(queryKey);

          if (value && "pages" in value) {
            const obj = value.pages.flat().find((v) => v.postId === postId);
            if (obj) {
              const pageIndex = value.pages.findIndex((page) =>
                page.includes(obj)
              );
              const index = value.pages[pageIndex].findIndex(
                (v) => v.postId === postId
              );

              // 얕은 복사 준비
              const shallow: any = { ...value };
              value.pages = [...value.pages];
              value.pages[pageIndex] = [...value.pages[pageIndex]];

              // 포스트 데이터 업데이트
              shallow.pages[pageIndex][index] = {
                ...shallow.pages[pageIndex][index],
                Hearts: shallow.pages[pageIndex][index].Hearts.filter(
                  (v: any) => v.email !== session?.user?.email
                ),
                _count: {
                  ...shallow.pages[pageIndex][index]._count,
                  Hearts: shallow.pages[pageIndex][index]._count.Hearts - 1,
                },
              };

              // 캐시 업데이트
              queryClient.setQueryData(queryKey, shallow);
            }
          } else if (value) {
            // 단일 포스트면
            if (value.postId === postId) {
              const shallow = {
                ...value,
                Hearts: value.Hearts.filter(
                  (heart) => heart.email !== session?.user?.email
                ),
                _count: {
                  ...value._count,
                  Hearts: value._count.Hearts - 1,
                },
              };
              queryClient.setQueryData(queryKey, shallow);
            }
          }
        }
      });
    },
    onError: (error, { postId, session }) => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onSettled: () => {
      setIsLiking(false); // 중복 방지를 위한 상태 변경
    },
  });
}

export function useSave({ setSaved }: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      session,
    }: {
      postId: number;
      session: any;
    }) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/save`,
        {
          method: "POST", // 저장은 POST 메서드를 사용
          credentials: "include",
          body: JSON.stringify(session),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async ({ postId, session }: { postId: number; session: any }) => {
      // 사용자 정보를 가져옴
      const previousUserData = queryClient.getQueryData([
        "user",
        session!.user!.email,
      ]);

      // 낙관적으로 업데이트함 Saved에 postId 추가
      queryClient.setQueryData(
        ["users", session!.user!.email],
        (oldData: any) => {
          if (!oldData) {
            return {
              email: session!.user!.email,
              nickname: session!.user!.name, // 기본 닉네임 (필요에 따라 수정)
              image: session!.user!.image, // 기본 이미지 (필요에 따라 수정)
              Saved: [postId.toString()], // 저장 목록에 postId 추가
              Followers: [],
              Followings: [],
              Info: {
                intro: "",
                website: "",
                gender: "",
              },
              _count: {
                Followers: 0,
                Followings: 0,
              },
            };
          }

          // 이전 데이터가 있다면 Saved 배열에 postId를 추가
          return {
            ...oldData,
            Saved: oldData.Saved
              ? [...oldData.Saved, postId.toString()] // postId 추가
              : [postId.toString()],
          };
        }
      );

      return { previousUserData, session };
    },
    onError: (err, variables, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context && context.previousUserData) {
        queryClient.setQueryData(
          ["user", context.session!.user!.email],
          context.previousUserData
        );
      }
    },
    onSuccess: () => {
      setSaved(true); // 저장 성공 시 상태를 true로 설정
    },
    onSettled: (error, variables, context) => {
      // 요청 완료 후 쿼리 무효화해서 최신 데이터를 가져옴
      queryClient.invalidateQueries({
        queryKey: ["user", context.session!.user!.email],
      });
    },
  });
}

export function useUnsave({ setSaved }: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      session,
    }: {
      postId: number;
      session: any;
    }) => {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${postId.toString()}/save`,
        {
          method: "DELETE", // 저장 취소는 DELETE 메서드를 사용
          credentials: "include",
          body: JSON.stringify(session),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onMutate: async ({ postId, session }: { postId: number; session: any }) => {
      // 사용자 정보를 가져옴
      const previousUserData = queryClient.getQueryData([
        "user",
        session!.user!.email,
      ]);

      // 낙관적으로 업데이트함 Saved에서 postId 제거
      queryClient.setQueryData(
        ["users", session!.user!.email],
        (oldData: any) => {
          if (!oldData) {
            return oldData; // 이전 데이터가 없으면 업데이트 하지 않음
          }

          // 이전 데이터에서 Saved 배열에서 해당 postId를 제거
          return {
            ...oldData,
            Saved: oldData.Saved
              ? oldData.Saved.filter((id: string) => id !== postId.toString()) // 해당 postId 제거
              : [],
          };
        }
      );

      return { previousUserData, session };
    },
    onError: (err, variables, context) => {
      // 오류 발생 시 이전 데이터로 롤백
      if (context && context.previousUserData) {
        queryClient.setQueryData(
          ["user", context.session!.user!.email],
          context.previousUserData
        );
      }
    },
    onSuccess: () => {
      setSaved(false); // 저장 취소 성공 시 상태를 false로 설정
    },
    onSettled: (error, variables, context) => {
      // 요청 완료 후 쿼리 무효화해서 최신 데이터를 가져옴 (안정성을 위해서 해주는게 좋음)
      queryClient.invalidateQueries({
        queryKey: ["user", context.session!.user!.email],
      });
    },
  });
}

export function useComment({
  postId,
  isPosting,
  setIsPosting,
  setComment,
}: {
  postId: number;
  isPosting: boolean;
  setIsPosting: React.Dispatch<React.SetStateAction<boolean>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn 정의
    mutationFn: async (commentData: {
      postId: number;
      CommentText: string;
      userSession: any;
    }) => {
      return await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/api/posts/${commentData.postId.toString()}/comments`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentData.CommentText,
            User: commentData.userSession,
          }),
        }
      );
    },

    // onMutate: 낙관적 업데이트 및 이전 상태 저장
    onMutate: async (commentData) => {
      if (isPosting) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsPosting(true); // 요청 시작 시 상태 업데이트

      // Optimistic Update: 임시로 캐시 업데이트
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId.toString(),
        "comments",
      ]);
      queryClient.setQueryData(
        ["posts", commentData.postId.toString(), "comments"],
        (old: any) => {
          if (!old) return old;

          return [
            ...old,
            {
              postId: Number(commentData.postId),
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date(),
            },
          ];
        }
      );

      const previousPost = queryClient.getQueryData<IPost>([
        "posts",
        commentData.postId.toString(),
      ]);
      queryClient.setQueryData(
        ["posts", commentData.postId.toString()],
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            _count: {
              ...old._count,
              Comments: old._count.Comments + 1,
            },
          };
        }
      );

      return { previousComments, previousPost };
    },

    // onError: 오류 발생 시 이전 상태로 롤백
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["posts", postId.toString(), "comments"],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["posts", postId.toString()],
          context.previousPost
        );
      }
    },

    // onSuccess: 성공 시 캐시 업데이트 및 쿼리 무효화
    onSuccess: (data, commentData) => {
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId.toString(),
        "comments",
      ]);

      const post = queryClient.getQueryData<IPost>([
        "posts",
        commentData.postId.toString(),
      ]);

      if (previousComments && post) {
        // 댓글 배열을 업데이트합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId.toString(), "comments"],
          [
            ...previousComments,
            {
              postId: Number(commentData.postId),
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date(),
            },
          ]
        );

        // 게시물의 댓글 수를 1 증가시킵니다.
        const updatedPost = {
          ...post,
          _count: {
            ...post._count,
            Comments: post._count.Comments + 1,
          },
        };

        // 업데이트된 게시물 정보를 캐시에 저장합니다.
        queryClient.setQueryData(
          ["posts", commentData.postId.toString()],
          updatedPost
        );
      }

      // 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId.toString(), "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId.toString()],
      });
    },

    // onSettled: 요청 완료 후 상태 업데이트
    onSettled: () => {
      setIsPosting(false); // 요청 완료 후 상태 업데이트
      setComment(""); // 댓글 텍스트 초기화
    },
  });
}

export function useReplyComment({
  postId,
  isPosting,
  setIsPosting,
  setComment,
  ReplyTargetId,
  setReplyTargetId,
}: {
  postId: number;
  isPosting: boolean;
  setIsPosting: React.Dispatch<React.SetStateAction<boolean>>;
  setComment: React.Dispatch<React.SetStateAction<string>>;
  ReplyTargetId: string;
  setReplyTargetId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentData: {
      postId: number;
      ReplyTargetId: string;
      CommentText: string;
      userSession: any;
    }) => {
      return await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${commentData.postId}/${commentData.ReplyTargetId}/reply`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: commentData.CommentText,
            User: commentData.userSession,
          }),
        }
      );
    },

    onMutate: async (commentData) => {
      if (isPosting) return; // 이미 요청 중이면 아무 작업도 하지 않음
      setIsPosting(true); // 요청 시작 시 상태 업데이트

      // Optimistic Update: 임시로 캐시 업데이트
      const previousComments = queryClient.getQueryData<IComment[]>([
        "posts",
        commentData.postId,
        "comments",
      ]);
      queryClient.setQueryData(
        ["posts", commentData.postId, "comments"],
        (old: any) => {
          if (!old) return old;

          return [
            ...old,
            {
              postId: commentData.postId, // postId는 string
              userNickname: commentData.userSession.name,
              userEmail: commentData.userSession.email,
              content: commentData.CommentText,
              Hearts: [],
              _count: {
                Hearts: 0,
                Comments: 0,
              },
              reply: [],
              createdAt: new Date().toISOString(),
            },
          ];
        }
      );

      const previousPost = queryClient.getQueryData<IPost>([
        "posts",
        commentData.postId,
      ]);
      queryClient.setQueryData(["posts", commentData.postId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          _count: {
            ...old._count,
            Comments: old._count.Comments + 1,
          },
        };
      });

      return { previousComments, previousPost };
    },

    onError: (err, variables, context) => {
      // 에러 발생 시 이전 상태로 롤백
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["posts", variables.postId, "comments"],
          context.previousComments
        );
      }
      if (context?.previousPost) {
        queryClient.setQueryData(
          ["posts", variables.postId],
          context.previousPost
        );
      }
    },

    onSuccess: (data, commentData) => {
      // Optimistic Update에 의해 이미 업데이트된 댓글 배열을 다시 확인하고, 성공적으로 데이터를 업데이트합니다.
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId, "comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["posts", commentData.postId],
      });

      // 댓글 텍스트와 targetId 초기화
      setReplyTargetId("");
      setComment("");
    },

    onSettled: () => {
      setIsPosting(false); // 요청 완료 후 상태 업데이트
    },
  });
}
