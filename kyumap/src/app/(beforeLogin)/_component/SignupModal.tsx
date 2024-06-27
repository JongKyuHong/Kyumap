"use client";

import styles from "./signup.module.css";
import BackButton from "./BackButton";
import { useFormState, useFormStatus } from "react-dom";
import onSubmit from "../_lib/signup";

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
  const [state, formAction] = useFormState(onSubmit, { message: null });
  const { pending } = useFormStatus();

  return (
    <>
      <div className={styles.modalBackground}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <BackButton />
            <div>계정을 생성하세요.</div>
          </div>
          <form action={formAction}>
            <div className={styles.modalBody}>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="id">
                  아이디
                </label>
                <input
                  id="id"
                  name="id"
                  className={styles.input}
                  type="text"
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
              <div className={styles.error}>{showMessage(state?.message)}</div>
            </div>
            <div>
              <div className={styles.submitBtn}>
                <button className={styles.submitBtn2} disabled type="submit">
                  가입
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
