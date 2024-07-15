"use client";

import { useEffect, useState } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import styles from "./MyMap.module.css";
import KMapMarker from "./kMapMarker";

type Props = {
  userEmail: String;
};

export default function MyMap({ userEmail }: Props) {
  // 여기서 await로 음식점 데이터만 골라서 가져옴
  const [mapData, setMapData] = useState<any[]>([]);

  const KaKaoLoader = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_API_KAKAO_KEY as string,
    libraries: ["clusterer", "drawing", "services"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/foodSpot`
        );
        const data = await response.json();
        setMapData(data.data);
      } catch (error) {
        console.error("Error fetching map data:", error);
      }
    };

    fetchData();
    KaKaoLoader;
  }, [userEmail, KaKaoLoader]);

  console.log(mapData, "mapData");
  return (
    // <div className={styles.divStyle}>
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          paddingBottom: "0px",
          paddingTop: "0px",
          position: "relative",
          width: "100%",
          height: "70vh",
        }}
      >
        <Map
          center={{ lat: 37.5666612, lng: 126.9783785 }}
          style={{ width: "100%", height: "100%" }}
        >
          {mapData.map((v, index) => (
            <KMapMarker
              key={`EventMarkerContainer-${v.position.lat}-${v.position.lng}`}
              position={{
                lat: parseFloat(v.position.lat),
                lng: parseFloat(v.position.lng),
              }}
              nickname={v.User.nickname}
              content={v.content}
              imgsrc={v.Images[0]}
              id={index}
            ></KMapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}
