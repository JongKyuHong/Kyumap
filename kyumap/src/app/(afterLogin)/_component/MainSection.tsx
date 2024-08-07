"use client";

import React, { useEffect, useState } from "react";
import styles from "./mainsection.module.css";
import style from "./msection.module.css";
import PostRecommends from "./PostRecommends";
import ResponsiveNav from "./ResponsiveNav";
import useDeviceSize from "./useDeviceSize";
import { useSession } from "next-auth/react";
import LoadingComponent from "@/app/_component/LoadingComponent";

// { session }: any
export default function MainSection() {
  const [mobile, setMobile] = useState(false);
  const { isMobile } = useDeviceSize();
  // const { data: session, status } = useSession();
  // if (status === "loading") return <LoadingComponent />;
  // if (!session) return null;
  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);
  return (
    <>
      {mobile ? (
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
