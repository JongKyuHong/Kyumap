"use client";

import React, {
  ChangeEventHandler,
  ChangeEvent,
  useRef,
  useState,
  useEffect,
  FormEvent,
  Fragment,
} from "react";
import styles from "./newpost.module.css";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useDeviceSize from "../../../_component/useDeviceSize";
import { IPost } from "@/model/Post";
import Image from "next/image";
import { useSession } from "next-auth/react";
import MapComponent from "./MapComponent";
import { getCoordinatesFromAddress } from "./action";
import LoadingComponent from "@/app/_component/LoadingComponent";

interface PreviewItem {
  dataUrl: string;
  file: File;
  type: "image" | "video";
  thumbnailUrl?: string;
}

export default function NewPost() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isActive, setActive] = useState(false);
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  // const [ratioWidth, setWidth] = useState<number>(0);
  const [isMultiImg, setMultiImg] = useState(false);
  const [currentNumber, setNumber] = useState(0);
  const [isClickedEmo, setEmo] = useState(false);
  const [isClickedExitBtn, setExitBtn] = useState(false);
  const [isAccExpand, setAccExpand] = useState(false);
  const [isSettingExpand, setSettingExpand] = useState(false);
  const [isArticleInfoHide, setArticleInfoHide] = useState<boolean>(false);
  const [isCommentHide, setCommentHide] = useState<boolean>(false);
  const [altTexts, setAltTexts] = useState(preview.map(() => "")); // 대체 텍스트
  const [darktheme, setTheme] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("");
  const [storeTitle, setTitle] = useState<string>("");
  const [isLoading, setLoading] = useState(false);
  const [isRightBody, setRightBody] = useState(false);

  useEffect(() => {
    const rootElement = document.documentElement;
    const currentTheme = rootElement.getAttribute("color-theme");
    if (currentTheme === "dark") {
      setTheme(true);
    } else {
      setTheme(false);
    }
  }, []);

  const router = useRouter();
  const imgRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  const onClickBackBtn = () => {
    router.back();
  };

  const handleFileSelect = () => {
    if (imgRef.current) {
      imgRef.current.click();
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (e: FormEvent) => {
      e.preventDefault(); // 기본 폼 제출 동작 방지
      setLoading(true); // 로딩 상태 설정
      let lastType = ""; // 마지막 파일 타입
      const urlformLst = []; // 업로드된 파일 URL 리스트
      const altTextsLst = []; // 대체 텍스트 리스트
      let thumbnailUrl = ""; // 단일 섬네일 URL

      // 모든 미리보기 파일을 순회하면서 업로드 처리
      for (let idx = 0; idx < preview.length; idx++) {
        const { dataUrl, file, type } = preview[idx];
        let filename = encodeURIComponent(file.name);

        // 파일 업로드 URL 요청
        let result_url: any = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload?file=${filename}&type=${type}`
        );

        result_url = await result_url.json();
        const ImageFormData = new FormData();
        Object.entries({ ...result_url.fields, file }).forEach(
          ([key, value]) => {
            ImageFormData.append(key, value as string);
          }
        );

        // 파일 업로드
        let uploadResult = await fetch(result_url.url, {
          method: "POST",
          body: ImageFormData,
        });
        let url = uploadResult.url + `/${type}/` + filename;
        urlformLst.push(url);
        altTextsLst.push(altTexts[idx]);

        if (type === "video" && !thumbnailUrl) {
          // 섬네일에 대한 presigned URL 생성
          const thumbnailFilename = `${filename}-thumbnail.png`;
          let thumbnailResultUrl: any = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload?file=${thumbnailFilename}&type=image`
          );
          thumbnailResultUrl = await thumbnailResultUrl.json();
          const ThumbnailFormData = new FormData();
          const blob = await fetch(dataUrl).then((res) => res.blob());
          Object.entries({ ...thumbnailResultUrl.fields, file: blob }).forEach(
            ([key, value]) => {
              ThumbnailFormData.append(key, value as string);
            }
          );
          await fetch(thumbnailResultUrl.url, {
            method: "POST",
            body: ThumbnailFormData,
          });
          thumbnailUrl = thumbnailResultUrl.url + `/image/${thumbnailFilename}`;
        }

        lastType = type;
      }

      // 포스트 데이터 준비
      const postFormData = new FormData();
      if (urlformLst.length === 1 && lastType === "video") {
        postFormData.append("reels", true.toString());
      } else {
        postFormData.append("reels", false.toString());
      }

      postFormData.append("images", JSON.stringify(urlformLst));
      postFormData.append("altTexts", JSON.stringify(altTextsLst));
      postFormData.append("thumbnail", thumbnailUrl); // 단일 섬네일 URL 추가
      postFormData.append("isHideInfo", isArticleInfoHide.toString());
      postFormData.append("isHideComments", isCommentHide.toString());

      if (location) {
        const { latitude, longitude } = await getCoordinatesFromAddress(
          location
        );
        postFormData.append("lat", latitude);
        postFormData.append("lng", longitude);
      } else {
        postFormData.append("lat", "");
        postFormData.append("lng", "");
      }

      if (session?.user?.email)
        postFormData.append("userEmail", session.user.email);
      if (session?.user?.name)
        postFormData.append("userName", session.user.name);
      if (session?.user?.image)
        postFormData.append("userImage", session.user.image);
      postFormData.append("title", storeTitle);
      postFormData.append("content", content);

      return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts`, {
        method: "post",
        credentials: "include",
        body: postFormData,
      });
    },
    async onSuccess(response, variable) {
      const newPost = await response.json();
      setContent("");
      setPreview([]);
      if (queryClient.getQueryData(["posts", "recommends"])) {
        queryClient.setQueryData(
          ["posts", "recommends"],
          (prevData: { pages: IPost[][] }) => {
            const shallow = {
              ...prevData,
              pages: [...prevData.pages],
            };
            shallow.pages[0] = [...shallow.pages[0]];
            shallow.pages[0].unshift(newPost);
            return shallow;
          }
        );
      }
      await queryClient.invalidateQueries({
        queryKey: ["user", session?.user?.email, "posts"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["user", session?.user?.email, "reels"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["posts", "reels"],
      });
    },
    onError(error) {
      console.error(error);
      alert("업로드 중 에러가 발생했습니다.");
    },
    onSettled() {
      setLoading(false);
      router.back();
    },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isPending) return;
    if (!storeTitle) {
      alert("가게 이름을 입력해 주세요");
    } else if (!location) {
      alert("주소를 입력해 주세요");
    } else {
      mutate(e);
    }
  };

  const onNextSubmit = () => {
    setRightBody(true);
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video"); // 비디오 엘리먼트 생성
      const canvas = document.createElement("canvas"); // 캔버스 엘리먼트 생성
      const context = canvas.getContext("2d"); // 캔버스 컨텍스트 가져오기
      const reader = new FileReader(); // 파일 리더 생성

      // 파일 리더가 파일을 성공적으로 읽었을 때 호출되는 함수
      reader.onload = (event) => {
        video.src = event.target?.result as string; // 비디오 소스 설정
        // 비디오 데이터가 로드되었을 때 호출되는 함수
        video.onloadeddata = () => {
          canvas.width = video.videoWidth; // 캔버스 너비 설정
          canvas.height = video.videoHeight; // 캔버스 높이 설정
          video.currentTime = 1; // 첫 번째 초의 프레임을 사용
        };

        video.onseeked = () => {
          if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height); // 비디오 프레임을 캔버스에 그림
            const thumbnailUrl = canvas.toDataURL("image/png"); // 캔버스를 데이터 URL로 변환
            resolve(thumbnailUrl); // 썸네일 URL 반환
          } else {
            reject("캔버스 컨텍스트를 가져올 수 없습니다.");
          }
        };

        video.onerror = (error: any) => {
          reject("비디오 로드 중 오류 발생: " + error.message);
        };
      };

      reader.onerror = (error: any) => {
        reject("파일 읽기 중 오류 발생: " + error.message);
      };

      reader.readAsDataURL(file); // 파일을 데이터 URL로 읽음
    });
  };

  const onUpload: ChangeEventHandler<HTMLInputElement> = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      let newPreviews: PreviewItem[] = [...preview]; // 기존 미리보기 배열 복사

      // 파일 배열을 순회하며 처리
      const filePromises = Array.from(e.target.files).map(async (file) => {
        if (file.type.startsWith("video")) {
          // 파일이 비디오인지 확인
          try {
            const thumbnailUrl = await generateVideoThumbnail(file); // 비디오 썸네일 생성
            newPreviews = [
              ...newPreviews,
              { dataUrl: thumbnailUrl, file, type: "video" }, // 비디오 파일과 썸네일 추가
            ];
          } catch (error) {
            console.error("동영상 섬네일 생성 중 오류 발생:", error);
          }
        } else {
          const reader = new FileReader(); // 파일 리더 생성
          const fileLoadPromise = new Promise<void>((resolve) => {
            reader.onloadend = () => {
              newPreviews = [
                ...newPreviews,
                { dataUrl: reader.result as string, file, type: "image" }, // 이미지 파일과 데이터 URL 추가
              ];
              resolve();
            };
          });
          reader.readAsDataURL(file); // 파일을 데이터 URL로 읽음
          await fileLoadPromise; // 파일 로드 완료 대기
        }
      });

      await Promise.all(filePromises); // 모든 파일 처리 완료 대기
      setPreview(newPreviews); // 미리보기 상태 업데이트
    }
  };

  const calculateSize = () => {
    if (isMobile) {
      return {
        maxHeight: "420px",
        maxWidth: "378px",
        minHeight: "292px",
        minWidth: "250px",
        width: "378px",
      };
    } else if (isTablet) {
      return {
        maxHeight: "600px",
        maxWidth: "558px",
        minHeight: "420px",
        minWidth: "378px",
        width: "558px",
      };
    } else if (isDesktop) {
      return {
        maxHeight: "897px",
        maxWidth: "855px",
        minHeight: "600px",
        minWidth: "558px",
        width: "855px",
      };
    }
  };

  const calculateImgSize = () => {
    if (isMobile) {
      return {
        maxHeight: "300px",
        maxWidth: "330px",
        minHeight: "300px",
        minWidth: "330px",
        width: "330px",
      };
    } else if (isTablet) {
      return {
        maxHeight: "500px",
        maxWidth: "700px",
        minHeight: "500px",
        minWidth: "700px",
        width: "700px",
      };
    } else if (isDesktop) {
      return {
        maxHeight: "700px",
        maxWidth: "1000px",
        minHeight: "700px",
        minWidth: "1000px",
        width: "1000px",
      };
    }
  };

  const onRemovePreview = () => {
    setPreview([]);
    router.back();
  };

  const stopPropa = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setAltTexts(preview.map(() => ""));
  }, [preview]);

  useEffect(() => {
    if (preview.length > 1) {
      setMultiImg(true);
    } else {
      setMultiImg(false);
    }
  }, [isMultiImg, preview]);

  const onClickNextBtn = () => {
    setNumber(currentNumber + 1);
  };

  const onClickPrevBtn = () => {
    setNumber(currentNumber - 1);
  };

  const onTextChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const newText = e.currentTarget.value || ""; // 입력된 텍스트 가져오기
    setContent(newText); // 텍스트 상태 업데이트
  };

  const onClickEmoticon = () => {
    setEmo(!isClickedEmo);
  };

  const onClickExitBtn = () => {
    if (isRightBody) {
      setRightBody(false);
    } else {
      setExitBtn(!isClickedExitBtn);
    }
  };

  const addEmoticon = (e: React.MouseEvent<HTMLDivElement>) => {
    const innerText = e.currentTarget.innerText || "";
    setContent((prevText) => prevText + innerText);
  };

  const onClickAccExpand = () => {
    setAccExpand(!isAccExpand);
  };

  const onClickSettingExpand = () => {
    setSettingExpand(!isSettingExpand);
  };

  const onClickArticleInfoHide = () => {
    setArticleInfoHide(!isArticleInfoHide);
  };

  const onClickCommentHide = () => {
    setCommentHide(!isCommentHide);
  };

  const onRemoveImage = (index: number) => () => {
    setPreview((prevPreview) => {
      // 필터를 사용하여 특정 인덱스를 제외한 모든 항목을 반환
      return prevPreview.filter((_, i) => i !== index);
    });
  };

  const onClickAltTextChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newAltTexts = [...altTexts];
    newAltTexts[index] = e.target.value;
    setAltTexts(newAltTexts);
  };

  if (!session) return null;

  return (
    <div className={styles.ModalMainDiv}>
      <div
        className={
          isClickedExitBtn ? styles.ModalInnerDivExitBtn : styles.ModalInnerDiv
        }
      >
        <div className={styles.ModalInnerDiv2}>
          <div className={styles.ModalInnerDiv3} onClick={onClickBackBtn}></div>
          <div className={styles.ModalXbox} onClick={onClickBackBtn}>
            <div className={styles.ModalXboxInner} role="button" tabIndex={0}>
              <div className={styles.ModalXboxDiv}>
                <svg
                  aria-label="닫기"
                  className={styles.XboxSvg}
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
          <div className={styles.ModalInnerDiv4} tabIndex={-1}>
            <div className={styles.ModalInnerDiv5}>
              <div className={styles.ModalInnerDiv6}>
                <div
                  className={styles.ModalInnerDiv7}
                  aria-label="새 게시물 만들기"
                  role="dialog"
                  onClick={stopPropa}
                >
                  <div className={styles.ModalInnerDiv8}>
                    <div className={styles.ModalInnerDiv9} role="dialog">
                      <div
                        style={{
                          // ...calculateSize(),
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        <div
                          className={styles.ModalInnerDiv10}
                          onDragOver={(e) => e.preventDefault()}
                        >
                          <div className={styles.ModalInnerDiv11}>
                            <div
                              className={styles.ModalHeader}
                              style={{ width: "100%" }}
                            >
                              <div className={styles.ModalHeader2}>
                                <div className={styles.ModalHeader3}>
                                  <div
                                    className={styles.ModalHeader4}
                                    style={{ width: "100%", height: "100%" }}
                                    dir="auto"
                                    tabIndex={-1}
                                  >
                                    <h1
                                      className={styles.HeaderH1}
                                      dir="auto"
                                      tabIndex={-1}
                                      style={{
                                        width: preview.length
                                          ? "calc(100% - 120px)"
                                          : "calc(100% + 0px)",
                                      }}
                                    >
                                      <div className={styles.HeaderDiv}>
                                        {"새 게시물 만들기"}
                                      </div>
                                    </h1>
                                  </div>
                                  <div className={styles.Underleft}>
                                    {preview && (
                                      <div
                                        className={styles.backarrowbtn}
                                        // onClick={onRemovePreview}
                                        onClick={onClickExitBtn}
                                      >
                                        <div
                                          className={styles.backarrowbtn2}
                                          role="button"
                                          tabIndex={0}
                                        >
                                          <div className={styles.backarrowbtn3}>
                                            <span
                                              className={styles.backarrowbtn4}
                                              style={{
                                                display: "inline-block",
                                                transform: "rotate(0deg)",
                                              }}
                                            >
                                              <svg
                                                aria-label="돌아가기"
                                                className={
                                                  styles.backarrowbtnSvg
                                                }
                                                fill="currentColor"
                                                height="24"
                                                role="img"
                                                viewBox="0 0 24 24"
                                                width="24"
                                              >
                                                <title>돌아가기</title>
                                                <line
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  x1="2.909"
                                                  x2="22.001"
                                                  y1="12.004"
                                                  y2="12.004"
                                                ></line>
                                                <polyline
                                                  fill="none"
                                                  points="9.276 4.726 2.001 12.004 9.276 19.274"
                                                  stroke="currentColor"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth="2"
                                                ></polyline>
                                              </svg>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className={styles.Underright}>
                                    {preview.length > 0 &&
                                      (isRightBody ? (
                                        <div className={styles.NextBtn}>
                                          <div
                                            className={styles.NextBtn2}
                                            onClick={onSubmit}
                                          >
                                            공유하기
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={styles.NextBtn}>
                                          <div
                                            className={styles.NextBtn2}
                                            onClick={onNextSubmit}
                                          >
                                            다음
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {isLoading ? (
                            <div
                              className={styles.ModalBody}
                              style={{
                                width: isDesktop
                                  ? "1000px"
                                  : isTablet
                                  ? "700px"
                                  : "330px",
                                height: isDesktop
                                  ? "700px"
                                  : isTablet
                                  ? "500px"
                                  : "300px",
                                justifyContent: "center" /* 수평 중앙 정렬 */,
                                alignItems: "center" /* 수직 중앙 정렬 */,
                              }}
                            >
                              <div className="loading">
                                <LoadingComponent />
                              </div>
                            </div>
                          ) : (
                            <div
                              className={styles.ModalBody}
                              style={{
                                width: isDesktop
                                  ? "1000px"
                                  : isTablet
                                  ? "700px"
                                  : "330px",
                                height: isDesktop
                                  ? "700px"
                                  : isTablet
                                  ? "500px"
                                  : "300px",
                              }}
                            >
                              {isRightBody ? (
                                <div
                                  className={styles.rightBody}
                                  style={{ opacity: "1" }}
                                >
                                  <div className={styles.rightBody2}>
                                    <div className={styles.rightBody3}>
                                      <div>
                                        <div className={styles.bodyInnerText}>
                                          <div className={styles.profileArea}>
                                            <div
                                              className={styles.profileArea2}
                                            >
                                              <div
                                                className={styles.profileArea3}
                                              >
                                                <div
                                                  className={
                                                    styles.profileArea4
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.profileArea5
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.profileArea6
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.profileImgArea
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.profileImgArea2
                                                          }
                                                        >
                                                          <span
                                                            className={
                                                              styles.profileImgArea3
                                                            }
                                                            style={{
                                                              height: "28px",
                                                              width: "28px",
                                                            }}
                                                            role="link"
                                                            tabIndex={-1}
                                                          >
                                                            <Image
                                                              className={
                                                                styles.profileImgArea4
                                                              }
                                                              alt={`${session?.user?.name}님의 프로필사진`}
                                                              src={`${session?.user?.image}`}
                                                              width={0}
                                                              height={0}
                                                              sizes="100vw"
                                                              crossOrigin="anonymous"
                                                              draggable="false"
                                                              priority={true}
                                                            />
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={
                                                          styles.profileIdArea
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.profileIdArea2
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              styles.profileIdArea3
                                                            }
                                                          >
                                                            <span
                                                              dir="auto"
                                                              style={{
                                                                lineHeight:
                                                                  "18px",
                                                              }}
                                                              className={
                                                                styles.profileIdArea4
                                                              }
                                                            >
                                                              <span
                                                                className={
                                                                  styles.profileIdArea5
                                                                }
                                                              >
                                                                {`${session?.user?.name}`}
                                                              </span>
                                                            </span>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <div
                                              className={styles.InnerTextArea}
                                            >
                                              <div
                                                className={styles.textHeader}
                                              >
                                                <textarea
                                                  aria-label="문구를 입력하세요..."
                                                  className={styles.textHeader2}
                                                  tabIndex={0}
                                                  onInput={onTextChange}
                                                  value={content}
                                                  placeholder="문구를 입력하세요..."
                                                  maxLength={2200}
                                                />
                                              </div>
                                              <div className={styles.textBody}>
                                                <div className={styles.textEmo}>
                                                  <button
                                                    className={styles.EmoBtn}
                                                    onClick={onClickEmoticon}
                                                    type="button"
                                                  >
                                                    <div
                                                      className={styles.EmoBtn2}
                                                    >
                                                      <svg
                                                        aria-label="이모티콘"
                                                        className={
                                                          styles.Emoticon
                                                        }
                                                        fill="currentColor"
                                                        height="20"
                                                        role="img"
                                                        viewBox="0 0 24 24"
                                                        width="20"
                                                      >
                                                        <title>이모티콘</title>
                                                        <path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path>
                                                      </svg>
                                                    </div>
                                                  </button>
                                                  <div
                                                    style={{
                                                      top: "5px",
                                                      right: "0px",
                                                    }}
                                                  >
                                                    {isClickedEmo && (
                                                      <div
                                                        aria-hidden="false"
                                                        className={
                                                          styles.EmoDiv
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.EmoDiv1
                                                          }
                                                          style={{
                                                            left: "10px",
                                                          }}
                                                        ></div>
                                                        <div
                                                          className={
                                                            styles.EmoDiv2
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              styles.EmoDiv3
                                                            }
                                                            style={{
                                                              width: "265px",
                                                              height: "140px",
                                                            }}
                                                          >
                                                            <div
                                                              className={
                                                                styles.EmoDiv4
                                                              }
                                                            >
                                                              <div
                                                                className={
                                                                  styles.EmoDiv5
                                                                }
                                                                style={{
                                                                  width: "100%",
                                                                }}
                                                              >
                                                                <span
                                                                  className={
                                                                    styles.EmoDiv6
                                                                  }
                                                                  style={{
                                                                    lineHeight:
                                                                      "18px",
                                                                  }}
                                                                >
                                                                  {
                                                                    "최고 인기 이모티콘"
                                                                  }
                                                                </span>
                                                              </div>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😂
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😮
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😍
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😢
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  👏
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  🔥
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  🎉
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  💯
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  ❤️
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  🤣
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  🥰
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😘
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😭
                                                                </div>
                                                              </button>
                                                              <button
                                                                className={
                                                                  styles.EmoButton
                                                                }
                                                              >
                                                                <div
                                                                  className={
                                                                    styles.EmoButton2
                                                                  }
                                                                  style={{
                                                                    fontSize:
                                                                      "18px",
                                                                    height:
                                                                      "18px",
                                                                    margin:
                                                                      "8px",
                                                                    width:
                                                                      "25px",
                                                                  }}
                                                                  onClick={
                                                                    addEmoticon
                                                                  }
                                                                >
                                                                  😊
                                                                </div>
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                        <div
                                                          className={
                                                            styles.EmoDiv7
                                                          }
                                                        ></div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                                <div
                                                  className={styles.textEnter}
                                                >
                                                  <span
                                                    className={
                                                      styles.textEnterSpan
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.textEnter2
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "16px",
                                                        }}
                                                        dir="auto"
                                                        className={
                                                          styles.textEnterSpan2
                                                        }
                                                      >
                                                        <span
                                                          className={
                                                            styles.textEnterSpan3
                                                          }
                                                        >
                                                          {content.length}
                                                        </span>
                                                        /
                                                        <span
                                                          className={
                                                            styles.textEnterSpan3
                                                          }
                                                        >
                                                          2200
                                                        </span>
                                                      </span>
                                                    </div>
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className={styles.locationDiv}>
                                            <div
                                              className={styles.locationDiv2}
                                            >
                                              <div
                                                className={styles.locationDiv2}
                                              >
                                                <label
                                                  className={
                                                    styles.locationDiv3
                                                  }
                                                  style={{ height: "auto" }}
                                                >
                                                  <label
                                                    className={
                                                      styles.titleLabel
                                                    }
                                                  >
                                                    가게 이름
                                                  </label>
                                                  <textarea
                                                    autoComplete="off"
                                                    spellCheck="true"
                                                    name="creation-title-input"
                                                    className={
                                                      styles.locationInput
                                                    }
                                                    value={storeTitle}
                                                    onChange={(e) =>
                                                      setTitle(e.target.value)
                                                    }
                                                  />
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                          <div className={styles.locationDiv}>
                                            <div
                                              className={styles.locationDiv2}
                                            >
                                              <MapComponent
                                                location={location}
                                                setLocation={setLocation}
                                              />
                                            </div>
                                          </div>
                                          <div
                                            className={styles.AccessibilityDiv}
                                          >
                                            <div
                                              className={
                                                styles.AccessibilityDiv2
                                              }
                                              tabIndex={0}
                                              aria-disabled="false"
                                              role="button"
                                              style={{ cursor: "pointer" }}
                                              onClick={onClickAccExpand}
                                            >
                                              <span
                                                className={
                                                  styles.AccessibilitySpan
                                                }
                                                style={{
                                                  lineHeight: "20px",
                                                }}
                                              >
                                                {"접근성"}
                                              </span>
                                              <span
                                                style={{
                                                  display: "inline",
                                                  transform: isAccExpand
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                                }}
                                              >
                                                <svg
                                                  aria-label={
                                                    isAccExpand
                                                      ? "위쪽 V자형 아이콘"
                                                      : "아래쪽 V자형 아이콘"
                                                  }
                                                  className={
                                                    styles.AccessibilitySvg
                                                  }
                                                  fill="currentColor"
                                                  height="16"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="16"
                                                >
                                                  <title>
                                                    {isAccExpand
                                                      ? "위쪽 V자형 아이콘"
                                                      : "아래쪽 V자형 아이콘"}
                                                  </title>
                                                  <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path>
                                                </svg>
                                              </span>
                                            </div>
                                            {isAccExpand && (
                                              <div
                                                className={styles.AccExpandDiv}
                                              >
                                                <span
                                                  className={
                                                    styles.AccExpandSpan
                                                  }
                                                  style={{ lineHeight: "16px" }}
                                                >
                                                  {
                                                    "대체 텍스트는 시각적으로 사진을 보기 어려운 사람들에게 사진 내용을 설명하는 텍스트입니다. 대체 텍스트는 회원님의 사진에 대해 자동으로 생성되며, 직접 입력할 수도 있습니다."
                                                  }
                                                </span>
                                                <div
                                                  className={
                                                    styles.AccExpandDiv2
                                                  }
                                                >
                                                  {preview.map(
                                                    (pdata, index) => (
                                                      <Fragment key={index}>
                                                        <div
                                                          className={
                                                            styles.AccExpandDiv3
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              styles.AccExpandDiv4
                                                            }
                                                            style={{
                                                              width: "44px",
                                                              height: "44px",
                                                            }}
                                                          >
                                                            <div
                                                              className={
                                                                styles.AccExpandDiv5
                                                              }
                                                              style={{
                                                                width: "100%",
                                                                height: "100%",
                                                              }}
                                                            >
                                                              <Image
                                                                height={44}
                                                                width={67}
                                                                src={`${preview[index]?.dataUrl}`}
                                                                priority={true}
                                                                alt={
                                                                  "postImage"
                                                                }
                                                                className={
                                                                  styles.AccExpandImg
                                                                }
                                                                style={{
                                                                  transform:
                                                                    "translateX(0px) translateY(0px) scale(1)",
                                                                  transition:
                                                                    "none 0s ease 0s",
                                                                }}
                                                              />
                                                            </div>
                                                          </div>
                                                          <div
                                                            className={
                                                              styles.AccExpandDiv6
                                                            }
                                                          >
                                                            <input
                                                              className={
                                                                styles.AccExpandInput
                                                              }
                                                              placeholder="대체 텍스트 입력..."
                                                              type="text"
                                                              spellCheck="true"
                                                              name="alt-text"
                                                              value={
                                                                altTexts[index]
                                                              }
                                                              onChange={(e) =>
                                                                onClickAltTextChange(
                                                                  e,
                                                                  index
                                                                )
                                                              }
                                                            ></input>
                                                          </div>
                                                        </div>
                                                      </Fragment>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          <div
                                            className={styles.AccessibilityDiv}
                                          >
                                            <div
                                              className={
                                                styles.AccessibilityDiv2
                                              }
                                              aria-disabled="false"
                                              role="button"
                                              tabIndex={0}
                                              style={{ cursor: "pointer" }}
                                              onClick={onClickSettingExpand}
                                            >
                                              <span
                                                className={
                                                  styles.AccessibilitySpan
                                                }
                                                style={{
                                                  lineHeight: "20px",
                                                }}
                                              >
                                                {"고급 설정"}
                                              </span>
                                              <span
                                                style={{
                                                  display: "inline",
                                                  transform: isSettingExpand
                                                    ? "rotate(0deg)"
                                                    : "rotate(180deg)",
                                                }}
                                              >
                                                <svg
                                                  aria-label={
                                                    isSettingExpand
                                                      ? "위쪽 V자형 아이콘"
                                                      : "아래쪽 V자형 아이콘"
                                                  }
                                                  className={
                                                    styles.AccessibilitySvg
                                                  }
                                                  fill="currentColor"
                                                  height="16"
                                                  role="img"
                                                  viewBox="0 0 24 24"
                                                  width="16"
                                                >
                                                  <title>
                                                    {isSettingExpand
                                                      ? "위쪽 V자형 아이콘"
                                                      : "아래쪽 V자형 아이콘"}
                                                  </title>
                                                  <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path>
                                                </svg>
                                              </span>
                                            </div>
                                            {isSettingExpand && (
                                              <div
                                                className={
                                                  styles.ExpandSettingDiv
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.ExpandSettingDiv2
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.ExpandSettingDiv3
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.ExpandSettingDiv5
                                                      }
                                                      style={{ width: "100%" }}
                                                    >
                                                      <div
                                                        className={
                                                          styles.ExpandSettingDiv6
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.ExpandSettingDiv7
                                                          }
                                                        >
                                                          <span
                                                            className={
                                                              styles.ExpandSettingSpan
                                                            }
                                                            style={{
                                                              lineHeight:
                                                                "20px",
                                                            }}
                                                          >
                                                            {
                                                              "이 게시물의 좋아요 수 및 조회수 숨기기"
                                                            }
                                                          </span>
                                                        </div>
                                                        <div
                                                          className={
                                                            styles.ExpandSettingDivBtn
                                                          }
                                                        >
                                                          <div
                                                            className={
                                                              styles.ExpandSettingDivBtn2
                                                            }
                                                            onClick={
                                                              onClickArticleInfoHide
                                                            }
                                                          >
                                                            {isArticleInfoHide ? (
                                                              <>
                                                                <div
                                                                  className={
                                                                    styles.ExpandSettingDivBtn6
                                                                  }
                                                                ></div>
                                                                <div
                                                                  className={
                                                                    styles.ExpandSettingDivBtn7
                                                                  }
                                                                ></div>
                                                                <input
                                                                  dir="ltr"
                                                                  aria-checked="false"
                                                                  role="switch"
                                                                  type="checkbox"
                                                                  className={
                                                                    styles.ExpandSettingDivBtn5
                                                                  }
                                                                ></input>
                                                              </>
                                                            ) : (
                                                              <>
                                                                <div
                                                                  className={
                                                                    styles.ExpandSettingDivBtn3
                                                                  }
                                                                ></div>
                                                                <div
                                                                  className={
                                                                    styles.ExpandSettingDivBtn4
                                                                  }
                                                                ></div>
                                                                <input
                                                                  dir="ltr"
                                                                  aria-checked="false"
                                                                  role="switch"
                                                                  type="checkbox"
                                                                  className={
                                                                    styles.ExpandSettingDivBtn5
                                                                  }
                                                                ></input>
                                                              </>
                                                            )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                      <div
                                                        className={
                                                          styles.ExpandSettingDiv9
                                                        }
                                                      >
                                                        <span
                                                          className={
                                                            styles.ExpandSettingDiv10
                                                          }
                                                          style={{
                                                            lineHeight: "16px",
                                                          }}
                                                        >
                                                          {
                                                            "이 게시물의 총 좋아요 및 조회수는 회원님만 볼 수 있습니다. 나중에 게시물 상단에 있는 ··· 메뉴에서 이 설정을 변경할 수 있습니다. 다른 사람의 게시물에서 좋아요 수를 숨기려면 계정 설정으로 이동하세요."
                                                          }
                                                        </span>
                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div
                                                    className={
                                                      styles.ExpandCommentDiv
                                                    }
                                                    style={{ width: "100%" }}
                                                  >
                                                    <div
                                                      className={
                                                        styles.ExpandCommentDiv2
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.ExpandCommentText
                                                        }
                                                      >
                                                        <span
                                                          style={{
                                                            lineHeight: "20px",
                                                          }}
                                                          className={
                                                            styles.ExpandCommentText2
                                                          }
                                                        >
                                                          {"댓글 기능 해제"}
                                                        </span>
                                                      </div>
                                                      <div
                                                        className={
                                                          styles.ExpandCommentSwitch
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.ExpandCommentSwitch2
                                                          }
                                                          onClick={
                                                            onClickCommentHide
                                                          }
                                                        >
                                                          {isCommentHide ? (
                                                            <>
                                                              <div
                                                                className={
                                                                  styles.ExpandCommentSwitch6
                                                                }
                                                              ></div>
                                                              <div
                                                                className={
                                                                  styles.ExpandCommentSwitch7
                                                                }
                                                              ></div>
                                                              <input
                                                                dir="ltr"
                                                                aria-checked="false"
                                                                role="switch"
                                                                type="checkbox"
                                                                className={
                                                                  styles.ExpandSettingDivBtn5
                                                                }
                                                              ></input>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <div
                                                                className={
                                                                  styles.ExpandCommentSwitch3
                                                                }
                                                              ></div>
                                                              <div
                                                                className={
                                                                  styles.ExpandCommentSwitch4
                                                                }
                                                              ></div>
                                                              <input
                                                                dir="ltr"
                                                                aria-checked="false"
                                                                role="switch"
                                                                type="checkbox"
                                                                className={
                                                                  styles.ExpandCommentSwitch5
                                                                }
                                                              ></input>
                                                            </>
                                                          )}
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.ExpandCommentDiv3
                                                      }
                                                    >
                                                      <span
                                                        style={{
                                                          lineHeight: "16px",
                                                        }}
                                                        className={
                                                          styles.ExpandCommentDiv4
                                                        }
                                                      >
                                                        {
                                                          "나중에 게시물 상단의 메뉴(···)에서 이 설정을 변경할 수 있습니다."
                                                        }
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                          {!isSettingExpand && (
                                            <hr className={styles.UnderHr}></hr>
                                          )}
                                        </div>
                                        <div className={styles.bodyUnder}>
                                          <span
                                            className={styles.bodyUnder2}
                                          ></span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className={styles.ModalBodyDiv}
                                  style={{ opacity: "1" }}
                                >
                                  {preview.length ? (
                                    <div className={styles.ImageUploadDiv}>
                                      <div className={styles.ImageUploadDiv2}>
                                        <div className={styles.ImageUploadDiv3}>
                                          {isMultiImg ? (
                                            <>
                                              <span
                                                className={styles.OtherSpan}
                                              >
                                                <div
                                                  className={styles.prevBtn}
                                                  onClick={onClickPrevBtn}
                                                  style={{
                                                    visibility:
                                                      currentNumber === 0
                                                        ? "hidden"
                                                        : "visible",
                                                  }}
                                                >
                                                  <div
                                                    className={styles.prevBtn2}
                                                    role="button"
                                                  >
                                                    <button
                                                      className={
                                                        styles.prevBtn3
                                                      }
                                                      type="button"
                                                    >
                                                      <div
                                                        className={
                                                          styles.prevBtn4
                                                        }
                                                        role="button"
                                                      >
                                                        <svg
                                                          aria-label="왼쪽 방향 아이콘"
                                                          className={
                                                            styles.prevBtn5
                                                          }
                                                          fill="currentColor"
                                                          height="16"
                                                          role="img"
                                                          viewBox="0 0 24 24"
                                                          width="16"
                                                        >
                                                          <title>
                                                            왼쪽 방향 아이콘
                                                          </title>
                                                          <polyline
                                                            fill="none"
                                                            points="16.502 3 7.498 12 16.502 21"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                          ></polyline>
                                                        </svg>
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div
                                                  className={styles.nextBtn}
                                                  onClick={onClickNextBtn}
                                                  style={{
                                                    visibility:
                                                      currentNumber ===
                                                      preview.length - 1
                                                        ? "hidden"
                                                        : "visible",
                                                  }}
                                                >
                                                  <div
                                                    className={styles.nextBtn2}
                                                  >
                                                    <button
                                                      className={
                                                        styles.nextBtn3
                                                      }
                                                      type="button"
                                                    >
                                                      <div
                                                        className={
                                                          styles.nextBtn4
                                                        }
                                                      >
                                                        <svg
                                                          aria-label="오른쪽 방향 아이콘"
                                                          className={
                                                            styles.nextBtn5
                                                          }
                                                          fill="currentColor"
                                                          height="16"
                                                          role="img"
                                                          viewBox="0 0 24 24"
                                                          width="16"
                                                        >
                                                          <title>
                                                            오른쪽 방향 아이콘
                                                          </title>
                                                          <polyline
                                                            fill="none"
                                                            points="8 3 17.004 12 8 21"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                          ></polyline>
                                                        </svg>
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                                <div className={styles.slider}>
                                                  <div
                                                    className={styles.slider2}
                                                  >
                                                    {preview.map(
                                                      (pimg, index) => (
                                                        <div
                                                          key={index}
                                                          className={
                                                            styles.sliderDiv
                                                          }
                                                          style={{
                                                            background:
                                                              currentNumber ===
                                                              index
                                                                ? "rgb(0, 149, 246)"
                                                                : "rgb(168, 168, 168)",
                                                          }}
                                                        ></div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              </span>
                                              <div className={styles.ImgTab}>
                                                <Image
                                                  src={`${preview[currentNumber]?.dataUrl}`}
                                                  className={styles.ImgTab2}
                                                  style={{
                                                    ...calculateImgSize(),
                                                  }}
                                                  width={0}
                                                  height={0}
                                                  alt={"postImage"}
                                                  sizes="100vw"
                                                  priority={true}
                                                />
                                                <div
                                                  className={styles.imgTab3}
                                                ></div>
                                              </div>
                                              <div
                                                className={styles.MultiImage}
                                                style={{ width: "100%" }}
                                              >
                                                <div
                                                  className={styles.MultiImage2}
                                                >
                                                  <div
                                                    className={
                                                      styles.MultiImage3
                                                    }
                                                    style={{ maxWidth: "100%" }}
                                                  ></div>
                                                  <div
                                                    className={
                                                      styles.ImageRatio4
                                                    }
                                                    role="button"
                                                  >
                                                    <button
                                                      className={
                                                        styles.ImageRatioBtn
                                                      }
                                                      type="button"
                                                      onClick={handleFileSelect}
                                                    >
                                                      <div
                                                        className={
                                                          styles.ImageRatio5
                                                        }
                                                      >
                                                        <svg
                                                          aria-label="미디어 갤러리 열기"
                                                          className={
                                                            styles.ImageRatioSvg
                                                          }
                                                          fill="currentColor"
                                                          height="16"
                                                          role="img"
                                                          viewBox="0 0 24 24"
                                                          width="16"
                                                        >
                                                          <title>
                                                            미디어 갤러리 열기
                                                          </title>
                                                          <path
                                                            d="M19 15V5a4.004 4.004 0 0 0-4-4H5a4.004 4.004 0 0 0-4 4v10a4.004 4.004 0 0 0 4 4h10a4.004 4.004 0 0 0 4-4ZM3 15V5a2.002 2.002 0 0 1 2-2h10a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2H5a2.002 2.002 0 0 1-2-2Zm18.862-8.773A.501.501 0 0 0 21 6.57v8.431a6 6 0 0 1-6 6H6.58a.504.504 0 0 0-.35.863A3.944 3.944 0 0 0 9 23h6a8 8 0 0 0 8-8V9a3.95 3.95 0 0 0-1.138-2.773Z"
                                                            fillRule="evenodd"
                                                          ></path>
                                                        </svg>
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <>
                                              <div
                                                className={styles.MultiImage}
                                                style={{ width: "100%" }}
                                              >
                                                <div
                                                  className={styles.MultiImage2}
                                                >
                                                  <div
                                                    className={
                                                      styles.MultiImage3
                                                    }
                                                    style={{ maxWidth: "100%" }}
                                                  ></div>
                                                  <div
                                                    className={
                                                      styles.ImageRatio4
                                                    }
                                                    role="button"
                                                  >
                                                    <button
                                                      className={
                                                        styles.ImageRatioBtn
                                                      }
                                                      type="button"
                                                      onClick={handleFileSelect}
                                                    >
                                                      <div
                                                        className={
                                                          styles.ImageRatio5
                                                        }
                                                      >
                                                        <svg
                                                          aria-label="미디어 갤러리 열기"
                                                          className={
                                                            styles.ImageRatioSvg
                                                          }
                                                          fill="currentColor"
                                                          height="16"
                                                          role="img"
                                                          viewBox="0 0 24 24"
                                                          width="16"
                                                        >
                                                          <title>
                                                            미디어 갤러리 열기
                                                          </title>
                                                          <path
                                                            d="M19 15V5a4.004 4.004 0 0 0-4-4H5a4.004 4.004 0 0 0-4 4v10a4.004 4.004 0 0 0 4 4h10a4.004 4.004 0 0 0 4-4ZM3 15V5a2.002 2.002 0 0 1 2-2h10a2.002 2.002 0 0 1 2 2v10a2.002 2.002 0 0 1-2 2H5a2.002 2.002 0 0 1-2-2Zm18.862-8.773A.501.501 0 0 0 21 6.57v8.431a6 6 0 0 1-6 6H6.58a.504.504 0 0 0-.35.863A3.944 3.944 0 0 0 9 23h6a8 8 0 0 0 8-8V9a3.95 3.95 0 0 0-1.138-2.773Z"
                                                            fillRule="evenodd"
                                                          ></path>
                                                        </svg>
                                                      </div>
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                              <div role="presentation">
                                                <div
                                                  style={{
                                                    ...calculateImgSize(),
                                                    alignItems: "center",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    overflow: "hidden",
                                                  }}
                                                >
                                                  <Image
                                                    className={styles.ImageDiv}
                                                    src={`${preview[0]?.dataUrl}`}
                                                    style={{
                                                      ...calculateImgSize(),
                                                    }}
                                                    alt={"postImage"}
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    priority={true}
                                                  />
                                                </div>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className={styles.ModalBodyInnerDiv}>
                                        <div
                                          className={styles.ModalBodyInnerDiv2}
                                        >
                                          {darktheme ? (
                                            <svg
                                              aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                                              className={styles.ModalBodySvg}
                                              fill="currentColor"
                                              height="77"
                                              role="img"
                                              viewBox="0 0 97.6 77.3"
                                              width="96"
                                            >
                                              <title>
                                                이미지나 동영상과 같은 미디어를
                                                나타내는 아이콘
                                              </title>
                                              <path
                                                d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                                fill="currentColor"
                                              ></path>
                                              <path
                                                d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                                fill="currentColor"
                                              ></path>
                                              <path
                                                d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                                fill="currentColor"
                                              ></path>
                                            </svg>
                                          ) : (
                                            <svg
                                              aria-label="이미지나 동영상과 같은 미디어를 나타내는 아이콘"
                                              className={styles.ModalBodySvg}
                                              fill={
                                                isActive
                                                  ? "rgb(0, 149, 246)"
                                                  : "black"
                                              }
                                              height={77}
                                              role="img"
                                              viewBox="0 0 97.6 77.3"
                                              width={96}
                                            >
                                              <title>
                                                이미지나 동영상과 같은 미디어를
                                                나타내는 아이콘
                                              </title>
                                              <path
                                                d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                                                fill={
                                                  isActive
                                                    ? "rgb(0, 149, 246)"
                                                    : "black"
                                                }
                                              ></path>
                                              <path
                                                d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                                                fill={
                                                  isActive
                                                    ? "rgb(0, 149, 246)"
                                                    : "black"
                                                }
                                              ></path>
                                              <path
                                                d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                                                fill={
                                                  isActive
                                                    ? "rgb(0, 149, 246)"
                                                    : "black"
                                                }
                                              ></path>
                                            </svg>
                                          )}

                                          <div
                                            className={
                                              styles.ModalBodyInnerDiv3
                                            }
                                          >
                                            <span
                                              className={
                                                styles.ModalBodyInnerSpan
                                              }
                                            >
                                              {"사진, 동영상을 여기에 놓으세요"}
                                            </span>
                                          </div>
                                          <div
                                            className={
                                              styles.ModalBodyInnerDiv4
                                            }
                                          >
                                            <div
                                              className={
                                                styles.ModalBodyInnerDiv5
                                              }
                                            >
                                              <button
                                                className={
                                                  styles.ModalBodyInnerBtn
                                                }
                                                onClick={handleFileSelect}
                                              >
                                                {"컴퓨터에서 선택"}
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <form
                                    id="PostForm"
                                    className={styles.ModalBodyForm}
                                    method="POST"
                                    role="presentation"
                                    encType="multipart/form-data"
                                  >
                                    <input
                                      className={styles.FormInput}
                                      accept="image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime"
                                      multiple
                                      type="file"
                                      ref={imgRef}
                                      onChange={onUpload}
                                      name="fileUpload"
                                    ></input>
                                  </form>
                                </div>
                              )}
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
      {isClickedExitBtn && (
        <div>
          <div>
            <div className={styles.ExitBtn}>
              <div className={styles.ExitBtn2}>
                <div className={styles.ExitBtn3}>
                  <div className={styles.ExitBtn4}></div>
                  <div className={styles.ExitBtn5} tabIndex={-1}>
                    <div className={styles.ExitBtn6}>
                      <div className={styles.ExitBtn7}>
                        <div className={styles.ExitBtn8} role="dialog">
                          <div className={styles.ExitBtn9}>
                            <div className={styles.ExitBtnModal} role="dialog">
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  height: "100%",
                                  maxWidth: "100%",
                                }}
                              >
                                <div className={styles.ExitBtnModal2}>
                                  <div className={styles.ExitBtnModalHeader}>
                                    <span
                                      className={styles.ExitBtnModalHeader2}
                                      dir="auto"
                                      style={{ lineHeight: "25px" }}
                                    >
                                      {"게시물을 삭제하시겠어요?"}
                                    </span>
                                    <span
                                      className={styles.ExitBtnModalHeader3}
                                      dir="auto"
                                      style={{ lineHeight: "25px" }}
                                    >
                                      {
                                        "지금 나가면 수정 내용이 저장되지 않습니다."
                                      }
                                    </span>
                                  </div>
                                  <div
                                    className={styles.ExitBtnModalBody}
                                    style={{ lineHeight: "18px" }}
                                  >
                                    <button
                                      className={styles.ExitBtnBtn}
                                      onClick={onRemovePreview}
                                    >
                                      삭제
                                    </button>
                                    <button
                                      className={styles.ExitBtnBtn2}
                                      onClick={onClickExitBtn}
                                    >
                                      취소
                                    </button>
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
      )}
    </div>
  );
}
