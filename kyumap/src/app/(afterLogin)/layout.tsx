import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import NavTab from "./_component/NavTab";
import RQProvider from "./_component/RQProvider";
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
        <div className={styles.rootBody} style={{ left: "0px" }}>
          <div className={styles.rootChild}>
            <div className={styles.leafParent}>
              <div className={styles.leafChild}>
                <RQProvider>
                  <div className={styles.container} style={{ height: "100%" }}>
                    <NavTab />
                    <div className={styles.rightSectionWrapper}>{children}</div>
                  </div>
                </RQProvider>
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
