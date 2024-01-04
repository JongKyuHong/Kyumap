import { ReactNode } from "react";
import styles from "./layout.module.css";
type Props = { children: ReactNode; modal: ReactNode };

export default function RootLayout({ children, modal }: Props) {
  return <div className={styles.container}></div>;
}
