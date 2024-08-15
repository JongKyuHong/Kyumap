"use server";

// 주소를 통해 좌표로 변환 ( 위도, 경도 )
export async function getCoordinatesFromAddress(address: string) {
  const apiKey = `${process.env.KAKAO_REST_API_KEY}`;
  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
    address
  )}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  });

  const data = await response.json();

  if (data.documents.length > 0) {
    const { y: latitude, x: longitude } = data.documents[0].address;
    return { latitude, longitude };
  } else {
    throw new Error("Address not found");
  }
}

// 위도 경도를 받아 주소로 변환
export async function getAddressFromCoordinates(
  latitude: string,
  longitude: string
) {
  const apiKey = `${process.env.KAKAO_REST_API_KEY}`;
  const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${encodeURIComponent(
    longitude
  )}&y=${encodeURIComponent(latitude)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${apiKey}`,
    },
  });

  const data = await response.json();

  if (data.documents.length > 0) {
    const { address } = data.documents[0];
    return address;
  } else {
    throw new Error("Address not found");
  }
}
