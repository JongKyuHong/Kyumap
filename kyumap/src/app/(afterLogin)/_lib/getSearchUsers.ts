type Props = {
  queryKey: [_1: string, searchTerm: string];
};

export const getSearchUsers = async ({ queryKey }: Props) => {
  const [_1, searchTerm] = queryKey;

  // 검색어가 없거나 너무 짧으면 API 호출하지 않고 빈 배열 반환
  if (!searchTerm || searchTerm.length < 1) {
    // 검색어 최소 길이 1글자로 설정 (또는 2글자 등으로 변경 가능)
    return []; // 빈 배열 반환
  }

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/users/search?query=${encodeURIComponent(searchTerm)}`
    );

    if (!res.ok) {
      throw new Error("사용자 검색 API 호출 실패");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
