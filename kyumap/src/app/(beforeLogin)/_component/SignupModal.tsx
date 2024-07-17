"use client";

import React, { useState } from "react";
import styles from "./signup.module.css";
import BackButton from "./BackButton";
import { useFormState, useFormStatus } from "react-dom";
import signup from "../_lib/signup";
import LoadingComponent from "@/app/_component/LoadingComponent";

function showMessage(message: string | null) {
  if (message === "no_id") {
    return "아이디를 입력하세요.";
  }
  if (message === "no_name") {
    return "닉네임을 입력하세요.";
  }
  if (message === "no_password") {
    return "비밀번호를 입력하세요.";
  }
  if (message === "no_image") {
    return "이미지를 업로드하세요.";
  }
  if (message === "already_use_nickname") {
    return "이미 사용 중인 닉네임입니다.";
  }
  if (message === "already_use_email") {
    return "이미 사용 중인 이메일입니다.";
  }
  return "";
}

export default function SignupModal() {
  // const [state, formAction] = useFormState(onSubmit, { message: null });
  const [state, setState] = useState({ message: null });
  const [isLoading, setIsLoading] = useState(false);
  const { pending } = useFormStatus();

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const result = await signup(null, formData);
    setState(result);
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles.modalBackground}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <BackButton />
            <div>계정을 생성하세요.</div>
          </div>
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                onSubmit(formData);
              }}
            >
              <div className={styles.modalBody}>
                <div className={styles.inputDiv}>
                  <label className={styles.inputLabel} htmlFor="id">
                    이메일
                  </label>
                  <input
                    id="id"
                    name="id"
                    className={styles.input}
                    type="email"
                    placeholder=""
                    required
                  />
                </div>
                <div className={styles.inputDiv}>
                  <label className={styles.inputLabel} htmlFor="name">
                    닉네임
                  </label>
                  <input
                    id="name"
                    name="name"
                    className={styles.input}
                    type="text"
                    placeholder=""
                    required
                  />
                </div>
                <div className={styles.inputDiv}>
                  <label className={styles.inputLabel} htmlFor="password">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    className={styles.input}
                    type="password"
                    placeholder=""
                    required
                  />
                </div>
                <div className={styles.inputDiv}>
                  <label className={styles.inputLabel} htmlFor="image">
                    프로필
                  </label>
                  <input
                    id="image"
                    name="image"
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    required
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <button
                  type="submit"
                  className={styles.actionButton}
                  disabled={pending} //
                >
                  가입하기
                </button>
                <div className={styles.error}>
                  {showMessage(state?.message)}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
