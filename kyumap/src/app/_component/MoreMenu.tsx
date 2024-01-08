import Link from "next/link";
import styles from "./moremenu.module.css";

export default function MoreMenu() {
  return (
    <div className={styles.bottomNav}>
      <span className={styles.nav}>
        <div className={styles.navInner}>
          <Link className={styles.navLink} href="/">
            <div className={styles.navLinkInner}>
              <div>
                <div className={styles.menuBtn}>
                  <div className={styles.menuBtnInner}>
                    <svg
                      aria-label="설정"
                      className={styles.menuBtnsetting}
                      fill="currentColor"
                      height="24"
                      role="img"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>설정</title>
                      <path d="M3.5 6.5h17a1.5 1.5 0 0 0 0-3h-17a1.5 1.5 0 0 0 0 3Zm17 4h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Zm0 7h-17a1.5 1.5 0 0 0 0 3h17a1.5 1.5 0 0 0 0-3Z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.menuTitleOuter}>
                <div className={styles.menuTitle}>
                  <div className={styles.menuTitleInner}>
                    <span className={styles.menuSpan}>
                      <span className={styles.menuSpanInner}>더 보기</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </span>
    </div>
  );
}
