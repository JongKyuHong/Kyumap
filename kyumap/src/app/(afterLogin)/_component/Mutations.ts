// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { IComment } from "@/model/Comment";

// export function useHeart(){
//     useMutation({
//         mutationFn: () => {
//           return fetch(
//             `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/heart`,
//             {
//               method: "post",
//               credentials: "include",
//               body: JSON.stringify(session),
//             }
//           );
//         },
//         onMutate: async () => {
//           if (isLiking) return; // 이미 요청 중이면 아무 작업도 하지 않음
//           setIsLiking(true); // 요청 시작 시 상태 업데이트

//           const queryCache = queryClient.getQueryCache();
//           const queryKeys = queryCache.getAll().map((cache) => cache.queryKey);
//           // 인피니트 쿼리로 가져오기때문에 필터링이 필요하다
//           queryKeys.forEach((queryKey) => {
//             if (queryKey[0] === "posts") {
//               // posts로 시작하는 쿼리키 인경우
//               const value: IPost | InfiniteData<IPost[]> | undefined =
//                 queryClient.getQueryData(queryKey); // 쿼리데이터를 가져오고
//               if (value && "pages" in value) {
//                 const obj = value.pages.flat().find((v) => v.postId === postId); // postId와 일치하는 포스트를 가져옴
//                 if (obj) {
//                   const pageIndex = value.pages.findIndex(
//                     (page) => page.includes(obj) // 해당 포스트를 가지고있는 페이지 인덱스를 찾음
//                   );
//                   const index = value.pages[pageIndex].findIndex(
//                     (v) => v.postId === postId // 페이지 인덱스 내에서 포스트 인덱스 찾기
//                   );

//                   // 얕은 복사 준비
//                   const shallow: any = { ...value };
//                   value.pages = [...value.pages];
//                   value.pages[pageIndex] = [...value.pages[pageIndex]];

//                   // 포스트 데이터 업데이트
//                   shallow.pages[pageIndex][index] = {
//                     ...shallow.pages[pageIndex][index],
//                     Hearts: [{ email: session?.user?.email as string }],
//                     _count: {
//                       ...shallow.pages[pageIndex][index]._count,
//                       Hearts: shallow.pages[pageIndex][index]._count.Hearts + 1,
//                     },
//                   };

//                   // 캐시 업데이트
//                   queryClient.setQueryData(queryKey, shallow);
//                 }
//               } else if (value) {
//                 // 단일 포스트면
//                 if (value.postId === postId) {
//                   const shallow = {
//                     ...value,
//                     Hearts: [{ email: session?.user?.email as string }],
//                     _count: {
//                       ...value._count,
//                       Hearts: value._count.Hearts + 1,
//                     },
//                   };
//                   queryClient.setQueryData(queryKey, shallow);
//                 }
//               }
//             }
//           });
//         },
//         onError: () => {
//           queryClient.invalidateQueries({ queryKey: ["post", postId] });
//         },
//         onSettled: () => {
//           // 중복 방지를 위한 state false로
//           setIsLiking(false);
//         },
//       });
// }
