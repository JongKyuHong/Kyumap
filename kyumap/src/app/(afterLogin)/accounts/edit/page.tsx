"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import styles from "./edit.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUser } from "../../_lib/getUser";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useDeviceSize from "../../_component/useDeviceSize";
import ResponsiveNav from "../../_component/ResponsiveNav";

export default function Page() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [gender, setGender] = useState("");
  const [introduce, setIntro] = useState("");
  const [infowebsite, setWebsite] = useState("");

  const { isMobile } = useDeviceSize();

  // 유저정보 불러오기
  useEffect(() => {
    const getUserData = async () => {
      if (session && session?.user!.email) {
        const controller = new AbortController();
        const signal = controller.signal;

        const userData = await getUser({
          queryKey: ["users", session?.user!.email],
          signal: signal,
          meta: undefined,
        });

        setGender(userData.Info.gender);
        setIntro(userData.Info.intro);
        setWebsite(userData.Info.website);
      }
    };

    getUserData();
  }, [session]);

  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (value.length <= 150) {
      setIntro(value);
    }
  };

  const handleGenderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setGender(value);
  };

  const handleSiteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWebsite(value);
  };

  // 유저 정보 변경
  const { mutate: submitInfo, isPending } = useMutation({
    mutationFn: () => {
      const data = {
        website: infowebsite,
        intro: introduce,
        gender: gender,
        email: session?.user!.email,
      };

      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/info`, {
        method: "post",
        body: JSON.stringify(data),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["users", session!.user!.email],
      });

      const previousUserData = queryClient.getQueryData([
        "users",
        session!.user!.email,
      ]);

      // 캐시 변경
      queryClient.setQueryData(
        ["users", session!.user!.email],
        (oldData: any) => ({
          ...oldData,
          website: infowebsite,
          gender: gender,
          intro: introduce,
        })
      );

      return { previousUserData };
    },
    onError: (error, variables, context) => {
      // 에러 발생시 이전으로 돌리기
      if (context?.previousUserData) {
        queryClient.setQueryData(
          ["users", session!.user!.email],
          context.previousUserData
        );
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["users", session!.user!.email],
      });
      alert("프로필이 저장되었습니다.");
    },
  });

  const submitForm = () => {
    submitInfo();
  };

  if (status === "loading") {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <div className={styles.rootDiv} style={{ height: "100vh" }}>
        <div
          className={styles.rootDiv2}
          style={{
            maxWidth: "706px",
            minHeight: "calc(-135px + 100vh)",
            width: "100%",
          }}
        >
          <div className={styles.rootDiv3}>
            <div className={styles.rootDiv4}>
              <h2 className={styles.editH2} style={{ lineHeight: "25px" }}>
                {"프로필 편집"}
              </h2>
            </div>
            <div className={styles.rootDiv5}>
              <div className={styles.rootDiv6}>
                <div className={styles.rootDiv7}>
                  <span className={styles.rootSpan}>
                    <div className={styles.spanInnerDiv}>
                      <button className={styles.profileImageEditBtn}>
                        <Image
                          width={0}
                          height={0}
                          layout="fill"
                          alt={`${session?.user!.name}님의 프로필`}
                          src={`${session?.user!.image}`}
                        />
                      </button>
                      <div>
                        <form
                          className={styles.rootForm}
                          encType="multipart/form-data"
                          method="POST"
                          role="presentation"
                        >
                          <input
                            className={styles.formInput}
                            accept="image/jpeg, image/png"
                            type="file"
                          />
                        </form>
                      </div>
                    </div>
                  </span>
                  <div className={styles.rootDiv8}>
                    <span
                      className={styles.divUserEmail}
                      style={{ lineHeight: "20px" }}
                      dir="auto"
                    >
                      {session?.user!.email}
                    </span>
                    <span
                      className={styles.divUserName}
                      style={{ lineHeight: "18px" }}
                      dir="auto"
                    >
                      {session?.user!.name}
                    </span>
                  </div>
                </div>
                <div className={styles.rootDiv9}>
                  <div className={styles.rootDiv10} role="button">
                    {"사진 변경"}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.rootDiv11}>
              <div className={styles.rootDiv12}>
                <span
                  className={styles.rootDivSpan}
                  style={{ lineHeight: "20px" }}
                >
                  {"웹사이트"}
                </span>
              </div>
              <input
                className={styles.rootDivInput}
                placeholder={infowebsite || "웹사이트"}
                type="text"
                value={infowebsite}
                onChange={handleSiteChange}
              />
            </div>
            <form className={styles.rootForm} method="POST">
              {/* 소개칸 */}
              <div className={styles.formDiv}>
                <div className={styles.formDiv2}>
                  <label className={styles.formLabel}>
                    <div className={styles.formDiv3}>
                      <span
                        className={styles.formDivSpan}
                        dir="auto"
                        style={{ lineHeight: "20px" }}
                      >
                        {"소개"}
                      </span>
                    </div>
                  </label>
                  <textarea
                    className={styles.formDivTextArea}
                    placeholder={"소개"}
                    onChange={handleTextAreaChange}
                    value={introduce}
                  ></textarea>
                  <div className={styles.formDiv4}>
                    <span
                      className={styles.formDivSpan2}
                      style={{ lineHeight: "16px" }}
                    >
                      {introduce.length} / 150
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.formDiv5}>
                <div className={styles.formDiv2}>
                  <label className={styles.formLabel}>
                    <div className={styles.formDiv3}>
                      <span
                        className={styles.formDivSpan}
                        dir="auto"
                        style={{ lineHeight: "20px" }}
                      >
                        {"성별"}
                      </span>
                    </div>
                  </label>
                  <input
                    className={styles.rootDivInput}
                    placeholder={"성별"}
                    type="text"
                    onChange={handleGenderChange}
                    value={gender}
                  />
                </div>
              </div>
              <div className={styles.formDiv12}>
                <div
                  className={styles.formDiv13}
                  role="button"
                  onClick={submitForm}
                >
                  {isPending ? <div className={styles.spinner}></div> : "제출"}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
