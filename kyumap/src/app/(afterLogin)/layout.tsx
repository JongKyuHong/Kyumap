import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import RQProvider from "./_component/RQProvider";
import Nav from "./_component/Nav";
import { auth } from "@/auth";
import ClientComponent from "./_component/ClientComponent";
import BeforeLoginNav from "./_component/BeforeLoginNav";

type Props = { children: ReactNode; modal: ReactNode };

export default async function RootLayout({ children, modal }: Props) {
  // const session = await auth();s

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
                      {/* {session ? <Nav /> : <BeforeLoginNav />} */}
                      <Nav />
                      <div className={styles.rightSectionWrapper}>
                        <section className={styles.rootSection}>
                          <main
                            className={styles.rootMain}
                            style={{
                              height: "90vh",
                              overflowY: "auto",
                              // paddingTop: !session
                              //   ? "var(--desktop-nav-height)"
                              //   : "0",
                            }}
                            role="main"
                          >
                            <ClientComponent />
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
