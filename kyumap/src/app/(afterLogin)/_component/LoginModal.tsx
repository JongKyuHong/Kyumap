"use client";

import React, {
  useState,
  useEffect,
  FormEventHandler,
  ChangeEventHandler,
} from "react";
import styles from "./loginmodal.module.css";
import smallLogo from "../../../../public/smallLogo.png";
import smallLogodark from "../../../../public/smallLogodark.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export default function LoginModal() {
  const [viewPassword, setViewPassword] = useState(false);
  const router = useRouter();
  const [isDark, setDark] = useState<boolean>(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 다크모드 설정
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setDark(isDark);
      document.documentElement.setAttribute(
        "color-theme",
        isDark ? "dark" : "light"
      );
    }
  }, []);

  // 비밀번호 표시 버튼 클릭 시 상태 변경
  const onClickPBtn = () => {
    setViewPassword(!viewPassword);
  };

  // 모달 닫기
  const onClickXbox = () => {
    router.back();
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const signInResponse = await signIn("credentials", {
        email: id,
        password,
        redirect: false,
      });
      if (signInResponse?.error) {
        alert("로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.");
        throw new Error(signInResponse.error);
      }
      if (signInResponse!.ok) {
        router.replace("/home");
        router.refresh();
      }

      // router.refresh();
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
    <div className={styles.LoginMain}>
      <div className={styles.LoginMain2}>
        <div className={styles.LoginMain3}>
          <div className={styles.LoginMain4}></div>
          <div className={styles.LoginMain5} tabIndex={-1}>
            <div className={styles.LoginMain6}>
              <div className={styles.ModalContainer}>
                <div className={styles.ModalContainer2}>
                  <div className={styles.ModalContainer3}>
                    <div></div>
                    <div className={styles.ModalContainer4} role="dialog">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          maxWidth: "100%",
                        }}
                      >
                        <div
                          className={styles.ModalContainer5}
                          style={{ height: "100%" }}
                        >
                          <div className={styles.ModalHeader}>
                            <div
                              className={styles.ModalXbox}
                              onClick={onClickXbox}
                            >
                              <div className={styles.ModalXbox2}>
                                <svg
                                  aria-label="닫기"
                                  className={styles.ModalXboxSvg}
                                  fill="currentColor"
                                  height="18"
                                  role="img"
                                  viewBox="0 0 24 24"
                                  width="18"
                                >
                                  <title>닫기</title>
                                  <polyline
                                    fill="none"
                                    points="20.643 3.357 12 12 3.353 20.647"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                  ></polyline>
                                  <line
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="3"
                                    x1="20.649"
                                    x2="3.354"
                                    y1="20.649"
                                    y2="3.354"
                                  ></line>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div
                            className={styles.ModalBody}
                            style={{ maxHeight: "800px" }}
                          >
                            <div className={styles.ModalBody2}>
                              <div className={styles.ModalBody3}>
                                <div className={styles.ModalBodyLogo}>
                                  <div
                                    aria-disabled="false"
                                    role="button"
                                    tabIndex={0}
                                    style={{ cursor: "pointer" }}
                                  >
                                    {isDark ? (
                                      <Image
                                        src={smallLogodark}
                                        alt="logo"
                                        style={{
                                          backgroundPosition: "0px -52px",
                                          backgroundSize: "auto",
                                          width: "175px",
                                          height: "51px",
                                          backgroundRepeat: "no-repeat",
                                          display: "inline-block",
                                        }}
                                        priority={true}
                                      ></Image>
                                    ) : (
                                      <Image
                                        src={smallLogo}
                                        alt="logo"
                                        style={{
                                          backgroundPosition: "0px -52px",
                                          backgroundSize: "auto",
                                          width: "175px",
                                          height: "51px",
                                          backgroundRepeat: "no-repeat",
                                          display: "inline-block",
                                        }}
                                        priority={true}
                                      ></Image>
                                    )}
                                  </div>
                                </div>
                                <div className={styles.ModalBodyMain}>
                                  <form
                                    onSubmit={onSubmit}
                                    className={styles.LoginForm}
                                    id="loginForm"
                                    method="post"
                                  >
                                    <div className={styles.LoginFormDiv}>
                                      <div className={styles.Emailform}>
                                        <div className={styles.Emailform2}>
                                          <label className={styles.EmailLabel}>
                                            <span className={styles.EmailSpan}>
                                              {
                                                "전화번호, 사용자 이름 또는 이메일"
                                              }
                                            </span>
                                            <input
                                              className={styles.EmailInput}
                                              aria-label="전화번호, 사용자 이름 또는 이메일"
                                              aria-required="true"
                                              autoCapitalize="off"
                                              autoCorrect="off"
                                              maxLength={75}
                                              type="text"
                                              value={id}
                                              onChange={onChangeId}
                                              name="email"
                                            ></input>
                                          </label>
                                          <div
                                            className={styles.EmailDiv}
                                          ></div>
                                        </div>
                                      </div>
                                      <div className={styles.Passwordform}>
                                        <div className={styles.Emailform2}>
                                          <label className={styles.EmailLabel}>
                                            <span
                                              className={styles.PasswordSpan}
                                            >
                                              {"비밀번호"}
                                            </span>
                                            <input
                                              className={styles.PasswordInput}
                                              aria-label="비밀번호"
                                              aria-required="true"
                                              autoCapitalize="off"
                                              autoCorrect="off"
                                              type={
                                                viewPassword
                                                  ? "text"
                                                  : "password"
                                              }
                                              value={password}
                                              name="password"
                                              onChange={onChangePassword}
                                            ></input>
                                          </label>
                                          <div className={styles.ViewPassword}>
                                            <div
                                              className={styles.ViewPassword2}
                                            >
                                              <button
                                                className={styles.PBtn}
                                                type="button"
                                                onClick={onClickPBtn}
                                              >
                                                {viewPassword
                                                  ? "비밀번호 숨기기"
                                                  : "비밀번호 표시"}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className={styles.LoginInfoCheckbox}>
                                        <div className={styles.InfoInnerDiv}>
                                          <label className={styles.InfoLabel}>
                                            <div className={styles.CheckBoxDiv}>
                                              <div
                                                className={
                                                  styles.CheckBoxInnerDiv
                                                }
                                              ></div>
                                              <input
                                                dir="ltr"
                                                aria-label="속이빈 체크 표시 아이콘"
                                                aria-checked="false"
                                                className={styles.CheckBox}
                                                type="checkbox"
                                                name="LoginCheckbox"
                                              ></input>
                                            </div>
                                            <div
                                              className={styles.CheckBoxMent}
                                              role="button"
                                              tabIndex={0}
                                            >
                                              <span
                                                className={styles.CheckBoxSpan}
                                                dir="auto"
                                              >
                                                {"로그인 정보 저장하기"}
                                              </span>
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                      <div className={styles.LoginBtn}>
                                        <button
                                          className={styles.LoginBtn2}
                                          type="submit"
                                        >
                                          <div className={styles.LoginBtnDiv}>
                                            {"로그인"}
                                          </div>
                                        </button>
                                      </div>
                                    </div>
                                    <Link
                                      href="#"
                                      className={styles.FindPassword}
                                      role="link"
                                      tabIndex={0}
                                    >
                                      <span
                                        className={styles.FindPasswordSpan}
                                        dir="auto"
                                      >
                                        {"비밀번호를 잊으셨나요?"}
                                      </span>
                                    </Link>
                                    <div className={styles.Blank}></div>
                                  </form>
                                  {message && (
                                    <div className={styles.ErrorMessage}>
                                      {message}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
