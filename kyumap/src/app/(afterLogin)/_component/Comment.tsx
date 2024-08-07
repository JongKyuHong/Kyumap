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
import LoadingComponent from "@/app/_component/LoadingComponent";

dayjs.locale("ko");
dayjs.extend(relativeTime);

type Props = {
  comment: IComment;
  postId: string;
  onClickExitBtnChild: Function;
  parentId: string;
  ReplyInfo: Function;
};

export default function Comment({
  comment,
  postId,
  onClickExitBtnChild,
  parentId,
  ReplyInfo,
}: Props) {
  const [hasReply, setHasReply] = useState(false);
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
        <Commentli
          comment={comment}
          ReplyInfo={ReplyInfo}
          onClickExitBtn={onClickExitBtn}
          postId={postId}
          parentId={parentId}
        />
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
