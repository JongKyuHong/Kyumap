"use client";

import React, { useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import styles from "./MyMap.module.css";
import Link from "next/link";
import Image from "next/image";

type Props = {
  position: {
    lat: number;
    lng: number;
  };
  storeTitle: string;
  content: string;
  imgsrc: string;
  id: number;
};

const KMapMarker = ({ position, storeTitle, content, imgsrc, id }: Props) => {
  const [isVisible, setVisible] = useState<boolean>();

  const linkStyle = {
    textDecoration: "none",
    color: "gray",
  };

  const onClickMarker = () => {
    setVisible((prev) => !prev);
  };

  return (
    <MapMarker
      position={position} // 마커를 표시할 위치
      // @ts-ignore
      onClick={onClickMarker}
      image={{
        src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
        size: {
          width: 24,
          height: 35,
        },
      }}
    >
      {isVisible && (
        <Link
          href={{
            pathname: "/Detail",
            query: { id: id },
          }}
          as="/Detail"
          style={linkStyle}
        >
          <div className={styles.card}>
            <Image
              src={imgsrc}
              alt={storeTitle}
              width={0}
              height={0}
              sizes="100vw"
            />
            <div className={styles["card-body"]}>
              <h5 className={styles["card-title"]}>{storeTitle}</h5>
              <p className={styles["card-text"]}>{content}</p>
            </div>
          </div>
        </Link>
      )}
    </MapMarker>
  );
};

export default KMapMarker;
