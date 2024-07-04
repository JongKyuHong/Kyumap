import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });
// className={inter.className}
import styles from "./layout.module.css";
import AuthSession from "./_component/AuthSession";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body className={styles.MainBody}>
        <AuthSession>{children}</AuthSession>
      </body>
      <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />
      <script
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_API_KEY}&libraries=services&autoload=false`}
      />
    </html>
  );
}
