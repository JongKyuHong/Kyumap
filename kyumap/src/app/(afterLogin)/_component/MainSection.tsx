"use client";

import React from "react";
import styles from "./mainsection.module.css";
import style from "./msection.module.css";
import PostRecommends from "./PostRecommends";
import ResponsiveNav from "./ResponsiveNav";
import useDeviceSize from "./useDeviceSize";

export default function MainSection({ session }: any) {
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  if (!session) return null;
  return (
    <>
      {isMobile ? (
        <section className={style.MSection2}>
          <main className={style.Mmain}>
            <div className={style.MDiv2}>
              <div style={{ width: "100%" }}>
                <div>
                  <div className={style.MDiv3}>
                    <div
                      className={style.MDiv4}
                      style={{ maxWidth: "100%", width: "min(470px, 100vw)" }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingBottom: "4800px",
                            paddingTop: "0px",
                            position: "relative",
                          }}
                        >
                          <PostRecommends />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <div className={style.MDiv}></div>
        </section>
      ) : (
        <div
          style={{
            maxWidth: "630px",
            width: "100%",
          }}
        >
          <div className={styles.rootDivInner}>
            <div className={styles.rootDivInner2}></div>
            <div className={styles.postDiv}>
              <div
                className={styles.postDivInner}
                style={{ maxWidth: "100%", width: "min(470px, 100vw)" }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      paddingBottom: "0px",
                      paddingTop: "0px",
                      position: "relative",
                    }}
                  >
                    <PostRecommends />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
