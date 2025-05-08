import React from "react";
import styles from "./UserSearchModal.module.css";
import Image from "next/image";
import mongoose from "mongoose";

type Props = {
  isSearchingUsers: boolean;
  searchTerm: string;
  searchResults:
    | {
        _id: mongoose.Types.ObjectId | null;
        email: string;
        nickname: string;
        image: string;
      }[]
    | undefined;
  handleSelectUser: (user: {
    _id: mongoose.Types.ObjectId | null;
    nickname: string;
    email: string;
    image: string;
  }) => void;
  isSearching: boolean;
  position: { top: number; left: number };
  onClose: () => void;
};

export default function UserSearchModal({
  isSearchingUsers,
  searchTerm,
  searchResults,
  handleSelectUser,
  isSearching,
  position,
  onClose,
}: Props) {
  if (!isSearchingUsers) {
    return null;
  }

  const hasResults = searchResults && searchResults.length > 0;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          transform: "translateY(-100%)",
          zIndex: 1000,
        }}
      >
        {isSearching && (
          <div className={styles.statusMessage}>사용자 검색 중...</div>
        )}

        {!isSearching && hasResults && (
          <ul className={styles.resultsList}>
            {searchResults.map((user) => (
              <li
                key={user._id?.toString() ?? `${user.email}-${user.nickname}`}
                className={styles.resultItem}
                onClick={() => handleSelectUser(user)}
              >
                <Image
                  src={user.image}
                  alt={`${user.nickname} 프로필 이미지`}
                  width={28}
                  height={28}
                  className={styles.profileImage}
                />
                {`@ ${user.nickname}`}
              </li>
            ))}
          </ul>
        )}

        {!isSearching &&
          !hasResults &&
          searchTerm &&
          searchTerm.length >= 1 && (
            <div className={styles.statusMessage}>검색 결과 없음</div>
          )}
      </div>
    </div>
  );
}
