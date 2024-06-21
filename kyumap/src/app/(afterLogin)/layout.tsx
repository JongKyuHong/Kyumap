import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import RQProvider from "./_component/RQProvider";
import { auth } from "@/auth";
import NavTab from "./_component/NavTab";
import FollowRecommendSection from "./_component/FollowRecommendSection";
import Nav from "./_component/Nav";

type Props = { children: ReactNode; modal: ReactNode };

export default async function RootLayout({ children, modal }: Props) {
  const session = await auth();
  return (
    <div>
      <RQProvider>
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
                    {session && session.user && (
                      <>
                        {/* <NavTab me={session} /> */}
                        <Nav />
                        <div className={styles.rightSectionWrapper}>
                          <section className={styles.rootSection}>
                            <main
                              className={styles.rootMain}
                              style={{ height: "90vh", overflowY: "auto" }}
                            >
                              {children}
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
        {modal}
      </RQProvider>
    </div>
  );
}
