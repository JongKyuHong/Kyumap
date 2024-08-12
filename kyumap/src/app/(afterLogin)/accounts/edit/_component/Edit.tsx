"use client";

import React, { useState, ChangeEvent, useEffect, useRef } from "react";
import styles from "./edit.module.css";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getUser } from "../../../_lib/getUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useDeviceSize from "../../../_component/useDeviceSize";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필 편집",
  description: "프로필 편집 화면입니다.",
};

export default function Edit() {
  const { data: session, status, update } = useSession();
  const queryClient = useQueryClient();
  const [textAreaValue, setTextAreaValue] = useState("");
  const [gender, setGender] = useState("");
  const [introduce, setIntro] = useState("");
  const [infowebsite, setWebsite] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    data: userData,
    error: userError,
    isLoading: userLoading,
  } = useQuery<IUser, Object, IUser, [string, string]>({
    queryKey: ["users", session?.user?.email as string],
    queryFn: getUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { isMobile } = useDeviceSize();

  // 유저정보 불러오기
  useEffect(() => {
    if (userData) {
      setGender(userData.Info.gender);
      setIntro(userData.Info.intro);
      setWebsite(userData.Info.website);
      if (!previewImage) {
        setPreviewImage(userData.image); // 처음 불러올 때만 설정
      }
    }
  }, [userData, previewImage]);

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
    mutationFn: async () => {
      let profileImageUrl = "";

      if (profileImage) {
        // 프로필 이미지 업로드 처리
        const filename = encodeURIComponent(profileImage.name);
        const result_url = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload?file=${filename}&type=image`
        );
        const uploadUrlData = await result_url.json();
        const ImageFormData = new FormData();
        ImageFormData.append("file", profileImage);

        // 파일 업로드
        await fetch(uploadUrlData.url, {
          method: "POST",
          body: ImageFormData,
        });

        profileImageUrl = `${uploadUrlData.url}/image/${filename}`;
      }

      // 유저 정보 업데이트 데이터 준비
      const userInfoData = {
        email: session?.user!.email,
        intro: introduce,
        website: infowebsite,
        gender: gender,
        profileImageUrl: profileImageUrl || userData?.image, // 기존 프로필 이미지 URL 사용
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/info`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInfoData),
        }
      );

      if (!response.ok) {
        throw new Error("프로필 업데이트에 실패했습니다.");
      }

      return profileImageUrl;
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
          image: previewImage,
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
    onSuccess: (profileImageUrl) => {
      alert("프로필이 저장되었습니다.");
      queryClient.invalidateQueries({
        queryKey: ["users", session!.user!.email],
      });
      update({
        user: {
          ...session!.user,
          image: profileImageUrl || session!.user!.image,
        },
      });
    },
  });

  const submitForm = () => {
    submitInfo();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    console.log("Button clicked"); // 버튼 클릭이 호출되는지 확인
    if (fileInputRef.current) {
      console.log("Input exists"); // ref가 제대로 설정되었는지 확인
      fileInputRef.current.click();
    }
  };

  if (status === "loading" || userLoading) return <LoadingComponent />;

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
              {isMobile ? (
                <>
                  <div className={styles.rootDiv6}>
                    <div className={styles.rootDiv7}>
                      <span className={styles.rootSpan}>
                        <div className={styles.spanInnerDiv}>
                          <button
                            className={styles.profileImageEditBtn}
                            onClick={handleButtonClick}
                          >
                            <Image
                              width={56}
                              height={56}
                              alt={`${session?.user!.name}님의 프로필`}
                              src={previewImage || `${session?.user!.image}`}
                              priority={true}
                              style={{ objectFit: "cover" }}
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
                                ref={fileInputRef}
                                className={styles.formInput}
                                accept="image/jpeg, image/png"
                                type="file"
                                name="file"
                                onChange={handleImageChange}
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
                  </div>
                  <div className={styles.rootDiv9}>
                    <div
                      className={styles.rootDiv10}
                      role="button"
                      onClick={handleButtonClick}
                    >
                      {"사진 변경"}
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.rootDiv6}>
                  <div className={styles.rootDiv7}>
                    <span className={styles.rootSpan}>
                      <div className={styles.spanInnerDiv}>
                        <button
                          className={styles.profileImageEditBtn}
                          onClick={handleButtonClick}
                        >
                          <Image
                            width={56}
                            height={56}
                            alt={`${session?.user!.name}님의 프로필`}
                            src={previewImage || `${session?.user!.image}`}
                            priority={true}
                            style={{ objectFit: "cover" }}
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
                              ref={fileInputRef}
                              className={styles.formInput}
                              accept="image/jpeg, image/png"
                              type="file"
                              name="file"
                              onChange={handleImageChange}
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
                    <div
                      className={styles.rootDiv10}
                      role="button"
                      onClick={handleButtonClick}
                    >
                      {"사진 변경"}
                    </div>
                  </div>
                </div>
              )}
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
                name="website"
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
                    name="intro"
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
                    name="gender"
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
