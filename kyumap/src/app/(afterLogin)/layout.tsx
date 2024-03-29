"use client";

import { ReactNode, useState } from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import smallLogo from "../../../public/smallLogo.png";
import NavMenu from "./_component/NavMenu";
import MenuDetail from "./_component/MenuDetail";

type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  const [clickedMenu, setMenu] = useState(false);

  const onClickMenu = () => {
    setMenu(!clickedMenu);
  };
  return (
    <div className={styles.rootBody}>
      <div className={styles.rootParent}>
        <div className={styles.rootChild}>
          <div className={styles.leafParent}>
            <div className={styles.leafChild}>
              <div className={styles.container}>
                <div className={styles.leftSectionWrapper}>
                  <div className={styles.leftSectionOuter}>
                    <div className={styles.leftSectionInner}>
                      <div className={styles.leftSection}>
                        <div className={styles.left}>
                          <div className={styles.logoOuter}>
                            <div className={styles.logoInner}>
                              <div className={styles.logo}>
                                <Link
                                  className={styles.logoDetail}
                                  href="/home"
                                >
                                  <Image
                                    src={smallLogo}
                                    alt="logo"
                                    width={103}
                                    height={29}
                                  />
                                </Link>
                              </div>
                            </div>
                          </div>
                          <NavMenu />
                          <div
                            className={styles.bottomNav}
                            onClick={onClickMenu}
                          >
                            <span className={styles.nav}>
                              <div className={styles.navInner}>
                                <div className={styles.navLink}>
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
                                            <span
                                              className={styles.menuSpanInner}
                                            >
                                              더 보기
                                            </span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.rightSectionWrapper}>
                  <div className={styles.rightSectionInner}>
                    <main>{children}</main>
                  </div>
                </div>
              </div>
              <div>
                <div></div>
              </div>
            </div>
            {clickedMenu ? <MenuDetail /> : <div></div>}
          </div>
        </div>
      </div>
      {modal}
    </div>
  );
}
