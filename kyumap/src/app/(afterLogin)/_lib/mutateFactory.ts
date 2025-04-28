import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IComment } from "@/model/Comment";
import { useSession } from "next-auth/react";
import { IUser } from "@/model/User";

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
