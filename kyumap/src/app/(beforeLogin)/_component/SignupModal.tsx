import styles from "./signup.module.css";
import BackButton from "./BackButton";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export default function SignupModal() {
  const submit = async (formData: FormData) => {
    "use server";

    if (!formData.get("id")) {
      return { message: "no_id" };
    }

    if (!formData.get("password")) {
      return { message: "no_password" };
    }

    if (!formData.get("name")) {
      return { message: "no_name" };
    }

    if (!formData.get("image")) {
      return { message: "no_image" };
    }

    let sholudRedirect = false;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        {
          method: "post",
          body: formData,
          credentials: "include",
        }
      );
      console.log(response.status);
      if (response.status === 403) {
        return { message: "user_exists" };
      }
      console.log(await response.json());
      sholudRedirect = true;
      await signIn("credentials", {
        username: formData.get("id"),
        password: formData.get("password"),
        redirect: false,
      });
    } catch (error) {
      console.error(error);
    }

    if (sholudRedirect) {
      redirect("/home");
    }
  };

  return (
    <>
      <div className={styles.modalBackground}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <BackButton />
            <div>계정을 생성하세요.</div>
          </div>
          <form action={submit}>
            <div className={styles.modalBody}>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="id">
                  아이디
                </label>
                <input
                  id="id"
                  name="id"
                  className={styles.input}
                  type="text"
                  placeholder=""
                  required
                />
              </div>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="name">
                  닉네임
                </label>
                <input
                  id="name"
                  name="name"
                  className={styles.input}
                  type="text"
                  placeholder=""
                  required
                />
              </div>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  name="password"
                  className={styles.input}
                  type="password"
                  placeholder=""
                  required
                />
              </div>
              <div className={styles.inputDiv}>
                <label className={styles.inputLabel} htmlFor="image">
                  프로필
                </label>
                <input
                  id="image"
                  name="image"
                  className={styles.input}
                  type="file"
                  accept="image/*"
                  required
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button type="submit" className={styles.actionButton}>
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
