"use client";

import styles from "./searchtab.module.css";
import Link from "next/link";
import Image from "next/image";
import { IUser } from "@/model/User";

type Props = {
  userData: IUser;
  onClick: (user: IUser) => void;
  onClickMounted: () => void;
};

// 검색 결과 정보를 보여줌
export default function SearchCard({
  userData,
  onClick,
  onClickMounted,
}: Props) {
  const handleClick = () => {
    onClick(userData);
    onClickMounted();
  };

  return (
    <Link
      href={`/profile/${userData.nickname}`}
      className={styles.recentLink}
      role="link"
      tabIndex={0}
      onClick={handleClick}
    >
      <div className={styles.linkInnerDiv}>
        <div className={styles.linkInnerDiv3}>
          <div className={styles.linkInnerDiv4}>
            <div className={styles.profileImage}>
              <div className={styles.profileImage2}>
                <div className={styles.profileImage3}>
                  <object type="nested/pressable">
                    <Link
                      href={`/profile/${userData.nickname}`}
                      role="link"
                      style={{
                        height: "44px",
                        width: "44px",
                      }}
                      className={styles.profileLink}
                    >
                      <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        // src={userData.image}
                        src={`${userData.image}`}
                        alt="profile이미지"
                        draggable="false"
                        crossOrigin="anonymous"
                        className={styles.profileLinkImage}
                      />
                    </Link>
                  </object>
                </div>
              </div>
            </div>
            <div className={styles.profileBody}>
              <div className={styles.profileBody2}>
                <div className={styles.profileBody3}>
                  <div className={styles.profileBody4}>
                    <span
                      style={{ lineHeight: "18px" }}
                      className={styles.profileId}
                    >
                      {userData.nickname}
                    </span>
                  </div>
                  <span
                    style={{ lineHeight: "18px" }}
                    className={styles.profileBodySpan}
                  >
                    <span className={styles.profileBodySpan2}>
                      {userData.Info.intro}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.linkInnerDiv2}
        role="none"
        style={{ inset: "0px" }}
      ></div>
    </Link>
  );
}
