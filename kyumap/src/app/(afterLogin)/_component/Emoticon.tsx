"use client";

import { useEffect, useState } from "react";
import styles from "./emoticon.module.css";

interface propsType {
  top: number;
  left: number;
}

export default function Emoticon({ top, left }: propsType) {
  // const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [modalPosition, setModalPosition] = useState({ width: 0, height: 0 });
  const [isModalVisible, setIsModalVisible] = useState(true);
  // const debounce = (func: (...args: any[]) => void, delay: number) => {
  //   let timerId: NodeJS.Timeout;

  //   return function (...args: any[]) {
  //     if (timerId) {
  //       clearTimeout(timerId);
  //     }

  //     timerId = setTimeout(() => {
  //       func(...args);
  //       timerId = null!;
  //     }, delay);
  //   };
  // };

  // const handleResize = debounce(() => {
  //   // setViewportSize({
  //   //   width: window.innerWidth || document.documentElement.clientWidth,
  //   //   height: window.innerHeight || document.documentElement.clientHeight,
  //   // });

  //   setModalPosition({
  //     // width: window.innerWidth || document.documentElement.clientWidth,
  //     // height: window.innerHeight || document.documentElement.clientHeight,
  //     width: left,
  //     height: top,
  //   });
  // }, 3); // 300ms 딜레이

  // useEffect(() => {
  //   // 화면 크기가 변경될 때마다 실행되는 이벤트 핸들러 등록
  //   window.addEventListener("resize", handleResize);
  //   handleResize();
  //   // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // const translateValue = `${viewportSize.width - 623}px, ${
  //   viewportSize.height - 69
  // }px`;

  // return (
  //   <div
  //     className={styles.rootDiv}
  //     style={{
  //       transform: `translate(${translateValue}) translate(0px, -100%)`,
  //       display: isModalVisible ? "block" : "none",
  //     }}
  //   >
  // useEffect(() => {
  //   setModalPosition({
  //     width: left,
  //     height: top,
  //   });
  // }, [left, top]);

  // const translateValue = `${modalPosition.width}px, ${modalPosition.height}px`;

  // return (
  //   <div
  //     className={styles.rootDiv}
  //     style={{
  //       transform: `translate(${translateValue}) translate(0px, -100%)`,
  //       display: isModalVisible ? "block" : "none",
  //     }}
  //   >

  useEffect(() => {
    setModalPosition({
      width: left,
      height: top,
    });
  }, []);

  const translateValue = `${modalPosition.width}px, ${modalPosition.height}px`;
  return (
    <div
      className={styles.rootDiv}
      style={{
        transform: `translate(${translateValue}) translate(0px, -100%)`,
        display: isModalVisible ? "block" : "none",
      }}
    >
      <div className={styles.EmoticonModal}>
        <div>
          <div className={styles.EmoticonModalDiv} role="dialog">
            <div className={styles.EmoticonModalDiv2}>
              <div className={styles.EmoticonModalDiv3}>
                <div
                  className={styles.EmoticonModalDiv4}
                  style={{ height: "325px", width: "333px" }}
                >
                  <div
                    className={styles.EmoticonModalDiv5}
                    style={{ height: "309px", width: "309px" }}
                  >
                    <div className={styles.EmoticonModalDiv6}>
                      <div
                        className={styles.EmoticonModalDiv7}
                        style={{ width: "100%" }}
                      >
                        <span className={styles.EmoticonSpan} dir="auto">
                          "최고 인기 이모티콘"
                        </span>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😂</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😮</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😍</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😢</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>👏</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>🔥</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>🎉</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>💯</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>❤️</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>🤣</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>🥰</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😘</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😭</div>
                        </div>
                      </div>
                      <div>
                        <div
                          className={styles.EmoticonListDiv}
                          role="button"
                          tabIndex={0}
                        >
                          <div className={styles.EmoticonListInnerDiv}>😊</div>
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
