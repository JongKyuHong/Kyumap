"use client";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

// children에서 인증세션을 사용할 수 있게 합니다.
export default function AuthSession({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}
