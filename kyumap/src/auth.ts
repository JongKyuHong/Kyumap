import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import cookie from "cookie";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: "i/flow/login",
    newUser: "i/flow/signup",
  },
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, user }) {
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const authResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        // 로그인 실패 시 오류를 던짐
        if (!authResponse.ok) {
          const credentialsSignin = new CredentialsSignin();
          if (authResponse.status === 404) {
            credentialsSignin.code = "no_user";
          } else if (authResponse.status === 401) {
            credentialsSignin.code = "wrong_password";
          }
          throw credentialsSignin;
        }

        const user = await authResponse.json();

        // 서버가 유효한 사용자 정보를 반환하지 않으면 오류를 던짐
        if (!user || !user.email) {
          throw new Error("Invalid user data received from server.");
        }

        // 서버로부터 받은 Set-Cookie 헤더를 파싱해서 쿠키 설정
        let setCookie = authResponse.headers.get("Set-Cookie");
        if (setCookie) {
          const parsed = cookie.parse(setCookie);
          cookies().set("connect.sid", parsed["connect.sid"], parsed);
        }

        return {
          email: user.email,
          name: user.nickname,
          image: user.image,
          ...user,
        };
      },
    }),
  ],
});
