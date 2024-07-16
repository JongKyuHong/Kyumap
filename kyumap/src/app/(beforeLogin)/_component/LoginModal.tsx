"use client";

import styles from "./login.module.css";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginModal() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const onClickClose = () => {
    router.back();
    // TODO: 뒤로가기가 /home이 아니면 /home으로 보내기
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      await signIn("credentials", {
        email: id,
        password,
        redirect: false,
      });
      setIsLoading(false);
      router.replace("/home");
    } catch (error) {
      console.error(error);
      setMessage("아이디와 비밀번호가 일치하지 않습니다.");
    }
  };

  const onChangeId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setId(e.target.value);
  };

  const onChangePassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
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
          <div>로그인하세요.</div>
        </div>
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <svg
              className={styles.loader}
              height="100%"
              viewBox="0 0 32 32"
              width={40}
            >
              <circle
                cx="16"
                cy="16"
                fill="none"
                r="14"
                strokeWidth="4"
                style={{ stroke: "rgb(29, 155, 240)", opacity: 0.2 }}
              ></circle>
              <circle
                cx="16"
                cy="16"
                fill="none"
                r="14"
                strokeWidth="4"
                style={{
                  stroke: "rgb(29, 155, 240)",
                  strokeDasharray: 80,
                  strokeDashoffset: 60,
                }}
              ></circle>
            </svg>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className={styles.modalBody}>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="id">
                  아이디
                </label>
                <input
                  id="id"
                  className={styles.input}
                  value={id}
                  type="text"
                  placeholder=""
                  onChange={onChangeId}
                />
              </div>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  className={styles.input}
                  value={password}
                  type="password"
                  placeholder=""
                  onChange={onChangePassword}
                />
              </div>
            </div>
            <div className={styles.message}>{message}</div>
            <div className={styles.modalFooter}>
              <button
                className={styles.actionButton}
                disabled={!id && !password}
              >
                로그인하기
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
