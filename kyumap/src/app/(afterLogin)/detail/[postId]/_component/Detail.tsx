// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { getPost } from "@/app/(afterLogin)/_lib/getPost";
// import styles from "../detail.module.css";
// import UserPosts from "../../../profile/[userName]/_component/UserPosts";
// import { IPost } from "../../../../../model/Post";
// import DetailPage from "../../../@modal/(.)detail/[postId]/_component/DetailPage";

// type Props = {
//   post: IPost;
// };

// export default function Detail({ post }: Props) {
//   //   const { data: post } = useQuery<IPost, Object, IPost, [string, string]>({
//   //     queryKey: ["posts", postId],
//   //     queryFn: getPost,
//   //     staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
//   //     gcTime: 300 * 1000,
//   //   });

//   // if (isLoading) {
//   //   return <div>Loading...</div>;
//   // }
//   if (!post) return null;

//   return (
//     <>
//       <div className={styles.mainDiv} style={{ maxWidth: "673px" }}>
//         <div className={styles.mainDiv2}>
//           <div className={styles.mainImageTap}>
//             <div className={styles.mainImageTap2}>
//               <div>
//                 <div
//                   role="button"
//                   aria-hidden="true"
//                   className={styles.mainImageTap3}
//                 >
//                   <div>
//                     <div className={styles.mainImageTap4}>
//                       <div
//                         className={styles.mainImageTap5}
//                         style={{ paddingBottom: "177.778%" }}
//                       >
//                         <div className={styles.mainImageTap6}>
//                           <div className={styles.mainImageTap7}>
//                             <div className={styles.mainImageTap8}>
//                               <div className={styles.mainImageTap9}>
//                                 <div className={styles.mainImageTap10}>
//                                   <video
//                                     style={{ display: "block" }}
//                                     playsInline
//                                     src={}
//                                     className={styles.mainVideo}
//                                   ></video>
//                                   <div></div>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className={styles.gap}>
//         <hr className={styles.gapHr} />
//       </div>
//       <UserPosts userEmail={post.User.email} />
//     </>
//   );
// }
