import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import RQProvider from "./_component/RQProvider";
import Nav from "./_component/Nav";
import { auth } from "@/auth";
import BeforeLoginNav from "./_component/BeforeLoginNav";
import ResponsiveNav from "./_component/ResponsiveNav";

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
                    <>
                      {/* 로그인 된 사용자 인경우 Nav를 비로그인은 BeforeLoginNav를 보여줌 */}
                      {session ? <Nav session={session} /> : <BeforeLoginNav />}
                      <div className={styles.rightSectionWrapper}>
                        <section className={styles.rootSection}>
                          <main
                            className={styles.rootMain}
                            style={{
                              height: "90vh",
                              overflowY: "auto",
                              paddingTop: !session
                                ? "var(--desktop-nav-height)"
                                : "0",
                            }}
                            role="main"
                          >
                            <ResponsiveNav />
                            {children}
                          </main>
                        </section>
                      </div>
                    </>
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
