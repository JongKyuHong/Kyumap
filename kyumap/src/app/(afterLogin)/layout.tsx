"use client";

import { ReactEventHandler, ReactNode, useState, useRef } from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import smallLogo from "../../../public/smallLogo.png";
import NavMenu from "./_component/NavMenu";
import MenuDetail from "./_component/MenuDetail";
import RightSection from "./_component/RightSection";
import MainSection from "./_component/MainSection";
import Emoticon from "./_component/Emoticon";

type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  const [clickedMenu, setMenu] = useState(false);
  const [clickedEmotionMenu, setEmotionMenu] = useState(false);

  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSvgClick = () => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const modalTop = svgRect.top + window.scrollY;
      const modalLeft = svgRect.right + window.scrollX;
      setModalPosition({ top: modalTop, left: modalLeft });
      setEmotionMenu(!clickedEmotionMenu);
      setMenu(false);
    }
  };

  const onClickMenu = () => {
    setMenu(!clickedMenu);
    setEmotionMenu(false);
  };

  return (
    <div>
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
                  <div className={styles.container}>
                    <div className={styles.leftSectionWrapper}>
                      <div className={styles.leftSectionOuter}>
                        <div className={styles.leftSectionInner}>
                          <div className={styles.leftSection}>
                            <div className={styles.left}>
                              <div className={styles.logoOuter}>
                                <div className={styles.logoInner}>
                                  <div style={{ opacity: 1 }}>
                                    <Link
                                      className={styles.logoDetail}
                                      href="/home"
                                    >
                                      <div className={styles.logoImageOuter}>
                                        <div className={styles.logoImageInner}>
                                          <picture>
                                            <source
                                              srcSet="/smallLogo2.png"
                                              width="24px"
                                              height="24px"
                                              media="(max-width: 1263px)"
                                            />
                                            <Image
                                              className={styles.logo}
                                              src={smallLogo}
                                              alt="logo"
                                              width={103}
                                              height={29}
                                            />
                                          </picture>
                                        </div>
                                      </div>
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
                                            <div
                                              className={styles.menuBtnInner}
                                            >
                                              <svg
                                                aria-label="설정"
                                                className={
                                                  styles.menuBtnsetting
                                                }
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
                                            <div
                                              className={styles.menuTitleInner}
                                            >
                                              <span className={styles.menuSpan}>
                                                <span
                                                  className={
                                                    styles.menuSpanInner
                                                  }
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
                  </div>
                </div>
                <div className={styles.rightSectionWrapper}>
                  <section className={styles.rootSection}>
                    <main className={styles.rootMain}>
                      <div className={styles.mainrootDiv}>
                        <MainSection onClick={handleSvgClick} ref={svgRef} />
                        <RightSection />
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
                </div>
              </div>
              <div>
                <div></div>
              </div>
            </div>
            {clickedMenu ? <MenuDetail /> : <div></div>}
            {clickedEmotionMenu ? (
              <Emoticon top={modalPosition.top} left={modalPosition.left} />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
      {modal}
    </div>
  );
}
