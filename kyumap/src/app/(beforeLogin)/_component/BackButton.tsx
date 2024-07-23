"use client";

import styles from "./signup.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BackButton() {
  const router = useRouter();
  const onClickClose = () => {
    // 현재 경로를 얻기 위해 useEffect를 사용
    useEffect(() => {
      const currentPath = window.location.pathname;

      // 뒤로가기 실행
      router.back();

      // 일정 시간 뒤에 현재 경로를 확인하고 /home이 아니면 /home으로 이동
      setTimeout(() => {
        const newPath = window.location.pathname;
        if (newPath === currentPath) {
          router.push("/home");
        }
      }, 100); // 100ms 정도의 딜레이를 주어 뒤로가기가 완료되었는지 확인
    }, []);
  };

  return (
    <button className={styles.closeButton} onClick={onClickClose}>
      <svg
        width={24}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="r-18jsvk2 r-4qtqp9 r-yyyyoo r-z80fyv r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-19wmn03"
      >
        <g>
          <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path>
        </g>
      </svg>
    </button>
  );
}
