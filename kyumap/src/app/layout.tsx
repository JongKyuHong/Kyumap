import { ReactNode } from "react";
import styles from "./layout.module.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/logo.png";
import NavMenu from "./_component/NavMenu";
import LogoutButton from "./_component/LogoutButton";

type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  return (
    <div className={styles.container}>
      <header className={styles.leftSectionWrapper}>
        <section className={styles.leftSection}>
          <div className={styles.leftSectionFixed}>
            <Link className={styles.logo} href="/">
              <div className={styles.logoPill}>
                <Image src={Logo} alt="logo" width={40} height={40} />
              </div>
            </Link>
            <nav>
              <ul>
                <NavMenu />
              </ul>
              <Link href="/" className={styles.postButton}>
                <span>새 글쓰기</span>
              </Link>
            </nav>
            <LogoutButton />
          </div>
        </section>
      </header>
      <div className={styles.rightSectionWrapper}>
        <div className={styles.rightSectionInner}>
          <main>{children}</main>
        </div>
      </div>
      {modal}
    </div>
  );
}
