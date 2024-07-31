import { IPost } from "@/model/Post";
import styles from "./postmenu.module.css";
import { useSession } from "next-auth/react";

type Props = {
  post: IPost;
  onClickMenu: Function;
};

export default function PostMenu({ post, onClickMenu }: Props) {
  const { data: session } = useSession();
  return (
    <div className={styles.rootMenu}>
      <div className={styles.menuDiv}>
        <div role="dialog" className={styles.menuDiv2}>
          <div className={styles.menuDiv3}>
            <div></div>
            <div className={styles.menuDiv4}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  maxWidth: "100%",
                }}
              >
                <div className={styles.menuDiv5}>
                  <div className={styles.menuDiv6}>
                    {post.userEmail === session?.user!.email ? (
                      <>
                        <button className={styles.menuBtn}>삭제</button>
                        <button className={styles.menuBtn2}>수정</button>
                        <button className={styles.menuBtn2}>
                          다른 사람에게 좋아요 수 숨기기 취소
                        </button>
                        <button className={styles.menuBtn2}>
                          댓글 기능 설정
                        </button>
                        <button className={styles.menuBtn2}>
                          게시물로 이동
                        </button>
                        <button
                          className={styles.menuBtn2}
                          onClick={() => onClickMenu}
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button className={styles.menuBtn}>신고</button>
                        <button className={styles.menuBtn2}>관심 없음</button>
                        <button className={styles.menuBtn2}>
                          게시물로 이동
                        </button>
                        <button className={styles.menuBtn2}>
                          공유 대상...
                        </button>
                        <button className={styles.menuBtn2}>링크 복사</button>
                        <button
                          className={styles.menuBtn2}
                          onClick={() => onClickMenu}
                        >
                          취소
                        </button>
                      </>
                    )}
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
