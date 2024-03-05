"use client";

import styles from "./rightsection.module.css";
import Link from "next/link";
import Image from "next/image";

export default function RightSection() {
  return (
    <div className={styles.rightSide}>
      <div className={styles.rightSideInner}>
        <div className={styles.rightSideHeader}>
          <div className={styles.headerInner}>
            <div className={styles.headerInner2}>
              <div className={styles.headerInner3}>
                <div className={styles.headerInner4}>
                  <div className={styles.headerInner5}>
                    <div className={styles.headerfront}>
                      <div className={styles.frontInner}>
                        <div className={styles.frontInner2}>
                          <canvas
                            className={styles.innerCanvas}
                            style={{
                              height: "54px",
                              width: "54px",
                              left: "-5px",
                              position: "absolute",
                              top: "-5px",
                            }}
                          />
                          <Link
                            style={{ height: "44px", width: "44px" }}
                            className={styles.canvasLink}
                            href="#"
                          >
                            <Image
                              alt={`누구님의 프로필 사진`}
                              className={styles.linkImage}
                              height={44}
                              width={44}
                              src={"/chi.png"}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className={styles.headerMid}>
                      <div className={styles.headermidInner}>
                        <div className={styles.headermidInner2}>
                          <div className={styles.midSpanDiv}>
                            <Link
                              href="#"
                              className={styles.spandivLink}
                            ></Link>
                          </div>
                          <span
                            className={styles.midSpan}
                            style={{
                              lineHeight: "var(--base-line-clamp-line-height)",
                            }}
                          >
                            <span className={styles.midInnerspan}>
                              <div className={styles.innerSpanDiv}>
                                <span className={styles.divInnerSpan}>
                                  {"사용자 이름"}
                                </span>
                              </div>
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.headerback}>
                      <div className={styles.backInnerDiv}>
                        <div className={styles.backInnerDiv2}>전환</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
