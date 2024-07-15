import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import styles from "../../layout.module.css";
// import Detail from "./_component/Detail";
import DetailPage from "../../@modal/(.)detail/[postId]/_component/DetailPage";
import NavTab from "../../_component/NavTab";
import { getPost } from "@/app/(afterLogin)/_lib/getPost";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import { IPost } from "../../../../model/Post";
import Home from "../../home/page";
import { auth } from "@/auth";

type Props = {
  params: {
    postId: string;
  };
};

export default async function Page({ params }: Props) {
  const session = await auth();
  const post = await getPost({ queryKey: ["posts", params.postId] });
  return (
    <div>
      <div>
        <div className={styles.rootDiv}>
          <div className={styles.rootDivInner}>
            <div className={styles.rootDivInner2}></div>
          </div>
        </div>
        <div className={styles.rootBody} style={{ left: "0px" }}>
          <div className={styles.rootChild}>
            <div className={styles.leafParent}>
              <div className={styles.leafChild}>
                <div className={styles.container} style={{ height: "100%" }}>
                  {session?.user && (
                    <>
                      <NavTab />
                      <div className={styles.rightSectionWrapper}>
                        <section className={styles.rootSection}>
                          <main className={styles.rootMain}>
                            <div className={styles.mainrootDiv}>
                              <Home />
                            </div>
                          </main>
                        </section>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <DetailPage post={post} />
    </div>
  );
}
