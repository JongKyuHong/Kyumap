// 유저 이름을 통해 유저 이메일 가져오기
export async function getUserEmail(userName: string) {
  const user = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/email/${userName}`
  );
  if (!user) {
    throw new Error("User not found");
  }

  const data = await user.json();
  return data.email;
}
