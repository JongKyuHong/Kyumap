import React, { ReactNode } from "react";
import styles from "./layout.module.css";
import Image from "next/image";
import Link from "next/link";
import NavMenu from "./_component/NavMenu";
import BottomNav from "./_component/BottomNav";
import smallLogo from "../../../public/smallLogo.png";
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
                            <BottomNav />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.rightSectionWrapper}>{children}</div>
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
