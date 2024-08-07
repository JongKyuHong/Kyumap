"use server";

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
