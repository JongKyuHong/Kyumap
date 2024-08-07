"use client";

import styles from "./beforeLoginNav.module.css";
import Image from "next/image";
import smallLogo from "../../../../public/smallLogo.png";
import smallLogodark from "../../../../public/smallLogodark.png";
import React, { useEffect, useState } from "react";

export default function BeforeLoginNav() {
  const [isDark, setDark] = useState<boolean>(false);

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
                      alt="Kyumap"
                      src={smallLogodark}
                      aria-label="Kyumap"
                      width={103}
                      height={29}
                      className={styles.image}
                      priority={true}
                    />
                  ) : (
                    <Image
                      alt="Kyumap"
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
