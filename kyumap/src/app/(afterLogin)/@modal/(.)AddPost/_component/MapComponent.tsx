import React, { useEffect, useRef } from "react";
import styles from "./newpost.module.css";

type Props = {
  location: string;
  setLocation: (location: string) => void;
};

declare global {
  interface Window {
    sample5_execDaumPostcode: any;
    daum: any;
    kakao: any;
  }
}

export default function MapComponent({ location, setLocation }: Props) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const postcodeRef = useRef<any>(null); // 다중 Postcode 객체 참조 추가

  useEffect(() => {
    const loadKakaoMapScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (typeof window.kakao !== "undefined" && window.kakao.maps) {
          // 이미 스크립트가 로드된 경우 초기화 함수 호출
          resolve();
        } else {
          const script = document.createElement("script");
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
          script.async = true;
          script.onload = () => {
            if (window.kakao && window.kakao.maps) {
              window.kakao.maps.load(() => resolve());
            } else {
              reject(new Error("Kakao maps failed to load."));
            }
          };
          script.onerror = () => reject(new Error("Kakao maps script error."));
          document.head.appendChild(script);
        }
      });
    };

    const initMap = () => {
      if (!mapContainer.current) return;

      const mapOption = {
        center: new window.kakao.maps.LatLng(37.537187, 127.005476),
        level: 5,
      };
      const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
      const geocoder = new window.kakao.maps.services.Geocoder();
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(37.537187, 127.005476),
        map: map,
      });

      window.sample5_execDaumPostcode = () => {
        postcodeRef.current = new window.daum.Postcode({
          oncomplete: function (data: any) {
            const addr = data.address;
            setLocation(addr);
            if (addr) {
              geocoder.addressSearch(
                data.address,
                function (results: any, status: any) {
                  if (status === window.kakao.maps.services.Status.OK) {
                    const result = results[0];
                    const coords = new window.kakao.maps.LatLng(
                      result.y,
                      result.x
                    );
                    if (mapContainer.current) {
                      mapContainer.current.style.display = "block";
                    }
                    map.relayout();
                    map.setCenter(coords);
                    marker.setPosition(coords);
                    postcodeRef.current?.close(); // 주소 선택 후 창 닫기
                  }
                }
              );
            }
          },
          onclose: function () {
            postcodeRef.current = null; // 창이 닫히면 참조 해제
          },
        }).open();
      };
    };

    loadKakaoMapScript()
      .then(initMap)
      .catch((error) => {
        console.error(error);
      });

    return () => {
      window.removeEventListener("load", initMap);
    };
  }, [setLocation]);

  const handleLocationClick = () => {
    if (typeof window.sample5_execDaumPostcode === "function") {
      window.sample5_execDaumPostcode();
    } else {
      console.error("Daum Postcode script is not loaded yet.");
    }
  };

  return (
    <>
      <div className={styles.locationDiv2}>
        <label className={styles.locationDiv3} style={{ height: "auto" }}>
          <label className={styles.titleLabel}>위치 추가</label>
          <textarea
            autoComplete="off"
            spellCheck="true"
            name="creation-location-input"
            className={styles.locationInput}
            value={location}
            readOnly
          />
          <div className={styles.locationSvgDiv} onClick={handleLocationClick}>
            <svg
              aria-label="위치 추가"
              className={styles.locationSvg}
              fill="currentColor"
              height="16"
              role="img"
              viewBox="0 0 24 24"
              width="16"
            >
              <title>위치 추가</title>
              <path d="M12.053 8.105a1.604 1.604 0 1 0 1.604 1.604 1.604 1.604 0 0 0-1.604-1.604Zm0-7.105a8.684 8.684 0 0 0-8.708 8.66c0 5.699 6.14 11.495 8.108 13.123a.939.939 0 0 0 1.2 0c1.969-1.628 8.109-7.424 8.109-13.123A8.684 8.684 0 0 0 12.053 1Zm0 19.662C9.29 18.198 5.345 13.645 5.345 9.66a6.709 6.709 0 0 1 13.417 0c0 3.985-3.944 8.538-6.709 11.002Z"></path>
            </svg>
          </div>
        </label>
        <div
          id="map"
          ref={mapContainer}
          style={{
            width: "300px",
            height: "300px",
            marginTop: "10px",
            display: "none",
          }}
        ></div>
      </div>
    </>
  );
}
