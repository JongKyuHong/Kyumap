import styles from "@/app/(beforeLogin)/_component/main.module.css";
import Image from "next/image";
import mainLogo from "../../../../public/mainLogo.png";
import Link from "next/link";

export default function Main() {
  return (
    <>
      <div className={styles.left}>
        <Image src={mainLogo} alt="logo" />
      </div>
      <div className={styles.right}>
        <h1>나만의 특별한 맛집 지도</h1>
        <Link href="/i/flow/signup" className={styles.signup}>
          계정 만들기
        </Link>
        <h3>이미 가입하셨나요?</h3>
        <Link href="/login" className={styles.login}>
          로그인
        </Link>
      </div>
    </>
  );
}
