import type { Metadata } from "next";
import "./globals.css";
import styles from "./layout.module.css";
import AuthSession from "./_component/AuthSession";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko">
      <body className={styles.MainBody}>
        <AuthSession>{children}</AuthSession>
      </body>
      <script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        async
      />
      <script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAO_JS_API_KEY}&libraries=services&autoload=false`}
        async
      />
    </html>
  );
}
