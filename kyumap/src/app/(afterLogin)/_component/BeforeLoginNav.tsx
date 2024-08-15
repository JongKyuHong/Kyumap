"use client";

import styles from "./beforeLoginNav.module.css";
import Image from "next/image";
import smallLogo from "../../../../public/smallLogo.png";
import smallLogodark from "../../../../public/smallLogodark.png";
import React, { useEffect, useState } from "react";

// 비 로그인시 상단에 나타나는 Nav입니다.
export default function BeforeLoginNav() {
  // 다크모드 여부를 결정하는 state
  const [isDark, setDark] = useState<boolean>(false);

  // 컴포넌트가 처음으로 렌더링 될때 로컬스토리지에 있는 다크모드 여부를 확인하여 state를 적용합니다.
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setDark(isDark);
      document.documentElement.setAttribute(
        "color-theme",
        isDark ? "dark" : "light"
      );
    }
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.root2}>
        <div className={styles.logo}>
          <div className={styles.logo2}>
            <a href="/home" className={styles.logo3} role="link" tabIndex={0}>
              <div className={styles.logo4}>
                <div className={styles.logo5}>
                  {isDark ? (
                    <Image
                      alt="logo"
                      src={smallLogodark}
                      aria-label="Kyumap"
                      width={103}
                      height={29}
                      className={styles.image}
                      priority={true}
                    />
                  ) : (
                    <Image
                      alt="logo"
                      src={smallLogo}
                      aria-label="Kyumap"
                      width={103}
                      height={29}
                      className={styles.image}
                      priority={true}
                    />
                  )}
                </div>
              </div>
            </a>
          </div>
        </div>
        <div className={styles.buttonDiv}>
          <div className={styles.buttonDiv2}>
            <div>
              <div className={styles.buttonDiv3}>
                <div className={styles.buttonDiv4}>
                  <a
                    href="/i/flow/login"
                    className={styles.loginBtn}
                    role="link"
                    tabIndex={0}
                  >
                    로그인
                  </a>
                </div>
                <div className={styles.buttonDiv5}>
                  <a
                    href="/i/flow/signup"
                    className={styles.signup}
                    role="link"
                    tabIndex={0}
                  >
                    가입하기
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
