"use client";
import { useEffect } from "react";
import styles from "../_component/navtab.module.css";

export default function Page() {
  useEffect(() => {
    history.replaceState(null, "", "/babo");
  }, []);
  return (
    <div>
      <svg
        aria-label="검색"
        className={styles.MSvg}
        fill="currentColor"
        height="24"
        role="img"
        viewBox="0 0 24 24"
        width="24"
      >
        <title>검색</title>
        <path
          d="M18.5 10.5a8 8 0 1 1-8-8 8 8 0 0 1 8 8Z"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
        ></path>
        <line
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          x1="16.511"
          x2="21.643"
          y1="16.511"
          y2="21.643"
        ></line>
      </svg>
    </div>
  );
}
