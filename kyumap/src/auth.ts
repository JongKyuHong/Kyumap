import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
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
      // console.log("auth.ts jwt", token);
      return token;
    },
    session({ session, newSession, user }) {
      // console.log("auth.ts session", session, newSession, user);
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // console.log(credentials, "credentials");
        const authResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              nickname: credentials.nickname,
              password: credentials.password,
            }),
          }
        );

        let setCookie = authResponse.headers.get("Set-Cookie");
        // console.log("set-cookie", setCookie);
        if (setCookie) {
          const parsed = cookie.parse(setCookie);
          cookies().set("connect.sid", parsed["connect.sid"], parsed); // 브라우저에 쿠키를 심어주는 것
        }

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
        // console.log(user, "userloginData");
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
