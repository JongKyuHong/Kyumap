type Props = {
  queryKey: [string, string];
};
// 유저정보 가져오기
export async function getUser({ queryKey }: Props) {
  const [_1, userEmail] = queryKey;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}`,
    {
      next: {
        tags: ["users", userEmail],
      },
      credentials: "include",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  return data;
}
