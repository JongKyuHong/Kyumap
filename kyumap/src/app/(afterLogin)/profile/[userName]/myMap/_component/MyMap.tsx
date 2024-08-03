"use client";

import { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import KMapMarker from "./kMapMarker";
import useKakaoLoader from "./useKakaoLoader";

type Props = {
  userEmail: String;
};

export default function MyMap({ userEmail }: Props) {
  // 여기서 await로 음식점 데이터만 골라서 가져옴
  const [mapData, setMapData] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 맛집 정보 가져오기
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
  }, [userEmail]);
  useKakaoLoader();

  // 사용자 위치정보 받기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const center = userLocation || { lat: 37.5666612, lng: 126.9783785 };

  return (
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
        <Map center={center} style={{ width: "100%", height: "100%" }}>
          {mapData.map((v, index) => (
            <KMapMarker
              key={`EventMarkerContainer-${v.position.lat}-${v.position.lng}`}
              position={{
                lat: parseFloat(v.position.lat),
                lng: parseFloat(v.position.lng),
              }}
              storeTitle={v.title}
              content={v.content}
              imgsrc={v.thumbnail || v.Images[0]}
              id={index}
            ></KMapMarker>
          ))}
        </Map>
      </div>
    </div>
  );
}
