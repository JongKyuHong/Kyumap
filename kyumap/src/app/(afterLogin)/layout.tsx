import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import NavTab from "./_component/NavTab";
type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  return (
    <div>
      <div>
        <div className={styles.rootDiv}>
          <div className={styles.rootDivInner}>
            <div className={styles.rootDivInner2}></div>
          </div>
        </div>
        <div className={styles.rootBody}>
          <div className={styles.rootChild}>
            <div className={styles.leafParent}>
              <div className={styles.leafChild}>
                <div className={styles.container} style={{ height: "100%" }}>
                  <div className={styles.leftSectionWrapper}>
                    <div className={styles.leftSectionOuter} tabIndex={-1}>
                      <div className={styles.leftSectionInner}>
                        <NavTab />
                      </div>
                    </div>
                  </div>
                  <div className={styles.rightSectionWrapper}>{children}</div>
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
    </div>
  );
}
