"use client";

import { useEffect, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import KMapMarker from "./kMapMarker";
import LoadingComponent from "@/app/_component/LoadingComponent";
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
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [errorState, setErrorState] = useState<ErrorEvent>();

  // const [loading, error] = useKakaoLoader({
  //   appkey: process.env.NEXT_PUBLIC_API_KAKAO_KEY as string,
  //   libraries: ["clusterer", "drawing", "services"],
  // });

  // useEffect(() => {
  //   setLoadingState(loading);
  //   setErrorState(error);
  // }, [loading, error]);

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

  // console.log(loading, error, "error");
  // if (loadingState) return <LoadingComponent />;
  // if (errorState) return <div>Error loading map: {errorState.message}</div>;

  const center = userLocation || { lat: 37.5666612, lng: 126.9783785 };

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
          // center={{ lat: 37.5666612, lng: 126.9783785 }}
          center={center}
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
