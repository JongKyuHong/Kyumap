import { ReactNode } from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import NavMenu from "./_component/NavMenu";
import MoreMenu from "./_component/MoreMenu";

type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  return (
    <body className={styles.rootBody}>
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
                                <Link className={styles.logoDetail} href="/">
                                  <Image
                                    src={Logo}
                                    alt="logo"
                                    width={40}
                                    height={40}
                                  />
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className={styles.nav}>
                            <NavMenu />
                          </div>
                          <div className={styles.bottomNav}>
                            <MoreMenu />
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
                {modal}
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
