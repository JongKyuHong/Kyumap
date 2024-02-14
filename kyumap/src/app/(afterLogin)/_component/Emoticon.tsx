"use client";

import { useEffect, useState } from "react";
import styles from "./emoticon.module.css";

interface propsType {
  top: number;
  left: number;
}

export default function Emoticon({ top, left }: propsType) {
  const [modalPosition, setModalPosition] = useState({ width: 0, height: 0 });
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
    setModalPosition({
      width: left,
      height: top,
    });
  }, []);

  const translateValue = `${modalPosition.width}px, ${modalPosition.height}px`;
  console.log(translateValue, "tra");
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
