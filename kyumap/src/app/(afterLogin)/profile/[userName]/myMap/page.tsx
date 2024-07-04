import styles from "../profile.module.css";
import MyMap from "./_component/MyMap";
import { getUserEmail } from "../../../_lib/getUserEmail";
import ProfileSection from "../_component/ProfileSection";

type Props = {
  params: {
    userName: string;
  };
};

export default async function Page({ params }: Props) {
  const { userName } = params;
  const userEmail = await getUserEmail(userName);

  // 릴스처럼 음식 데이터? 인것을 따로 분류해야될거 같은데
  // 주소입력 같은거로

  return (
    // <div className={styles.maindDiv}></div>
    <MyMap userEmail={userEmail} />
  );
}
