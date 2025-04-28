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
  jwt: {
    maxAge: 60 * 60 * 24,
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

        return {
          email: user.email,
          name: user.nickname,
          image: user.image,
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, user }) {
      return session;
    },
  },
});
