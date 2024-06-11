import styles from "../profile.module.css";
import Saved from "./_component/Saved";
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

  return (
    <div className={styles.maindDiv}>
      <Saved userEmail={userEmail} />
    </div>
  );
}
