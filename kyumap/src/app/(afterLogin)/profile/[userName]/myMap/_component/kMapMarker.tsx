"use client";

import React, { useState } from "react";
import { MapMarker } from "react-kakao-maps-sdk";
import { Card } from "react-bootstrap";
import Link from "next/link";

type Props = {
  position: {
    lat: number;
    lng: number;
  };
  nickname: string;
  content: string;
  imgsrc: string;
  id: number;
};

const KMapMarker = ({ position, nickname, content, imgsrc, id }: Props) => {
  const [isVisible, setVisible] = useState<boolean>();
  // nickname추후에 가게이름으로 변경하기를
  const linkStyle = {
    textDecoration: "none",
    color: "gray",
  };

  const onClickMarker = () => {
    setVisible((prev) => !prev);
  };
  console.log(id, "idkampmarker");

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
          <Card>
            <Card.Img
              variant="top"
              src={imgsrc}
              style={{ width: "100%", height: "100px" }}
            />
            <Card.Body>
              <Card.Title>{nickname}</Card.Title>
              <Card.Text>{content}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      )}
    </MapMarker>
  );
};

export default KMapMarker;
