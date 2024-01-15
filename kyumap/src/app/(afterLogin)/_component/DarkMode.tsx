"use client";

import styles from "./menudetail.module.css";
import { useState, useCallback } from "react";

export default function DarkMode() {
  const [darkMode, setDark] = useState(false);

  const onClickDark = useCallback(() => {
    setClicked((darkMode) => !darkMode);
    console.log(darkMode, "clicked dark");
  }, [darkMode]);

  return (
    <div className={styles.darkDiv}>
      <div className={styles.navLink} onClick={onClickDark}>
        <div className={styles.linkDiv}>
          <div className={styles.linkInnerDiv}>
            <div className={styles.linkInnerDiv2}>
              <div className={styles.iconTitle}>
                <div className={styles.titleInner}>
                  <div className={styles.spanOuter}>
                    <span className={styles.Span}>
                      <span className={styles.innerSpan}>다크 모드</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.navIcon}>
                <div className={styles.innerIcon}>
                  <div className={styles.innerIconDiv2}>
                    <div
                      className={darkMode ? styles.iconDivDark : styles.iconDiv}
                    ></div>
                    <div
                      className={
                        darkMode ? styles.iconDiv2Dark : styles.iconDiv2
                      }
                    ></div>
                    <input
                      dir="ltr"
                      aria-checked="false"
                      role="switch"
                      className={
                        darkMode ? styles.iconInputDark : styles.iconInput
                      }
                      type="checkbox"
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.linkDivOuter}></div>
      </div>
    </div>
  );
}
