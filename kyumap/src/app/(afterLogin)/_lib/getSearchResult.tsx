type Props = {
  queryKey: [string, string];
};

// 검색결과를 불러옴
export async function getSearchResult({ queryKey }: Props) {
  const [_1, searchParams] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${searchParams}`,
    {
      next: {
        tags: ["search", searchParams],
      },
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
