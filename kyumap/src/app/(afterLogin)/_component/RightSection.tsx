import styles from "./rightsection.module.css";

export default function RightSearchZone() {
  return (
    <section className={styles.rootSection}>
      <main className={styles.rootMain}>
        <div className={styles.rootDiv}>
          <div style={{ maxWidth: "630px", width: "100%" }}>
            <div className={styles.rootDivInner}>
              <div className={styles.rootDivInner2}>
                <div>
                  <div className={styles.rootDivInner3}>
                    <div className={styles.rootDivInner4}>
                      <div className={styles.rootDivInner5}>
                        <div className={styles.rootDivInner6}>
                          <div className={styles.rootDivInner7}>
                            <ul className={styles.followUl}>
                              <li
                                style={{
                                  transform: "translateX(0px)",
                                  width: "2px",
                                }}
                              ></li>
                              <li
                                style={{
                                  transform: "translateX(400px)",
                                  width: "2px",
                                }}
                              ></li>
                              {
                                "여기서는 팔로우한 사람들의 새 게시글 translateX는 요소의 개수만큼 80씩커짐"
                              }
                              <li
                                className={styles.foolowLi}
                                tabIndex={-1}
                                style={{ transform: "translateX(2px)" }}
                              ></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <div className={styles.rightSideInner}>
              <div className={styles.rightSideHeader}>
                <div className={styles.headerInner}>
                  <div className={styles.headerInner2}>
                    <div className={styles.headerInner3}>
                      <div className={styles.headerInner4}>
                        <div className={styles.headerfront}>
                          <div className={styles.frontInner}>
                            <div className={styles.frontInner2}></div>
                          </div>
                        </div>
                        <div className={styles.headermid}></div>
                        <div className={styles.headerback}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
        <div></div>
      </main>
      <div></div>
    </section>
  );
}
