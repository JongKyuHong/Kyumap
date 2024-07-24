"use client";

import styles from "./menudetail.module.css";

type Props = {
  darkMode: boolean;
  onClickDark: () => void;
};

export default function DarkMode({ darkMode, onClickDark }: Props) {
  return (
    <div className={styles.darkDiv}>
      <div
        className={styles.navLink}
        onClick={onClickDark}
        style={{
          colorScheme: darkMode ? "dark" : "light",
        }}
      >
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
                  <div
                    className={
                      darkMode ? styles.innerIconDiv2Dark : styles.innerIconDiv2
                    }
                  >
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
                      aria-checked={darkMode ? "true" : "false"}
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
        <div
          className={darkMode ? styles.linkDivOuter2 : styles.linkDivOuter}
        ></div>
      </div>
    </div>
  );
}
