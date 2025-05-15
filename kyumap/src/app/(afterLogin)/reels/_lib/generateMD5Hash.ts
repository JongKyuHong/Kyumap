import md5 from "crypto-js/md5";
// 해시 함수
export default function generateMD5Hash(data: string) {
  return md5(data).toString();
}
