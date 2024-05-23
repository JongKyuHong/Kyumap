import styles from "./searchtab.module.css";
import Link from "next/link";
import Image from "next/image";
import { User as IUser } from "@/model/User";

type Props = {
  userData: IUser;
};

export default function SearchCard({ userData }: Props) {
  return (
    <Link
      href={`/profile/${userData.id}`}
      className={styles.recentLink}
      role="link"
      tabIndex={0}
    >
      <div className={styles.linkInnerDiv}>
        <div className={styles.linkInnerDiv3}>
          <div className={styles.linkInnerDiv4}>
            <div className={styles.profileImage}>
              <div className={styles.profileImage2}>
                <div className={styles.profileImage3}>
                  <object type="nested/pressable">
                    <Link
                      href={`/profile/${userData.id}`}
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
                        src={"/chi.png"}
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
                      {userData.id}
                    </span>
                  </div>
                  <span
                    style={{ lineHeight: "18px" }}
                    className={styles.profileBodySpan}
                  >
                    <span className={styles.profileBodySpan2}>
                      {userData.nickname}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.profileXbox}>
              <div className={styles.profileXbox2}>
                <div className={styles.profileXbox3} role="button" tabIndex={0}>
                  <div className={styles.profileXbox4}>
                    <svg
                      aria-label="닫기"
                      className={styles.XboxSvg}
                      fill="currentColor"
                      height="16"
                      role="img"
                      viewBox="0 0 24 24"
                      width="16"
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
