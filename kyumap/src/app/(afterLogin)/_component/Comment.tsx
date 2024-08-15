"use client";

import styles from "./comment.module.css";
import Reply from "./Reply";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState, useEffect } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { IComment } from "@/model/Comment";
import Commentli from "./Commentli";

// 한국어 시간 표시를 위한 dajs 설정
dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  comment: IComment; // 코멘트 모델을 타입으로
  postId: string;
  onClickExitBtnChild: Function; // 부모에서 전달한 삭제 창 핸들러
  parentId: string;
  ReplyInfo: Function; // 부모에서 전달한 답글 정보 핸들러, 답글 달기를 누르면 댓글창에 @답글작성자 가 뜨게되어 답글을 달 수 있음
};

// 코멘트 창을 담당하는 컴포넌트
export default function Comment({
  comment,
  postId,
  onClickExitBtnChild,
  parentId,
  ReplyInfo,
}: Props) {
  // 댓글의 답글이 존재 여부 state
  const [hasReply, setHasReply] = useState(false);
  // 답글 보기를 클릭했는지
  const [isClickedReply, setClickedReply] = useState(false);
  const { data: session } = useSession();

  // 댓글에 답글이 있는지 확인하고 상태를 업데이트
  useEffect(() => {
    const has = comment?._count?.Comments > 0 ? true : false;
    setHasReply(has);
  }, [postId, comment, session]);

  const onClickExitBtn = (id: string) => {
    onClickExitBtnChild(id, true);
  };

  const onClickReplyBtn = () => {
    setClickedReply(!isClickedReply);
  };

  if (!comment) return null;

  return (
    <div className={styles.CommentDiv}>
      <ul className={styles.CommentUl}>
        {/*  */}
        <Commentli
          comment={comment}
          ReplyInfo={ReplyInfo}
          onClickExitBtn={onClickExitBtn}
          postId={postId}
          parentId={parentId}
        />
        {/* 답글이 존재하면 */}
        {hasReply && (
          <li>
            <ul className={styles.ulReply}>
              <li className={styles.liReply}>
                <div className={styles.liReplyBtn}>
                  <button className={styles.liReplyBtn2}>
                    <div className={styles.liDiv}></div>
                    <span
                      className={styles.liReplySpan}
                      onClick={onClickReplyBtn}
                    >
                      {isClickedReply
                        ? "답글 닫기"
                        : `답글 보기 (${comment._count.Comments}개)`}
                    </span>
                  </button>
                </div>
              </li>
              {/* 답글 보기를 클릭했을때 */}
              {isClickedReply &&
                comment!.reply!.map((data, index) => (
                  <Reply
                    parentId={parentId}
                    key={index}
                    comment={data}
                    ReplyInfo={ReplyInfo}
                    onClickExitBtn={onClickExitBtn}
                    postId={postId}
                  />
                ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}
