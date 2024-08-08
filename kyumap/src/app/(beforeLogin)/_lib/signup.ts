"use server";

import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";

const signup = async (prevState: any, formData: FormData) => {
  if (!formData.get("id") || !(formData.get("id") as string)?.trim()) {
    return { message: "no_id" };
  }
  if (!formData.get("name") || !(formData.get("name") as string)?.trim()) {
    return { message: "no_name" };
  }
  if (
    !formData.get("password") ||
    !(formData.get("password") as string)?.trim()
  ) {
    return { message: "no_password" };
  }
  if (!formData.get("image")) {
    return { message: "no_image" };
  }

  formData.set("nickname", formData.get("name") as string);
  let shouldRedirect = false;
  try {
    const checkDuplicate = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/duplicate`,
      {
        method: "post",
        body: JSON.stringify({
          email: formData.get("id"),
          nickname: formData.get("name"),
        }),
      }
    );
    const checkDuplicateResult = await checkDuplicate.json();
    if (checkDuplicateResult.status === 400) {
      return { message: checkDuplicateResult.message };
    }

    let file = formData.get("image") as any;
    let filename = encodeURIComponent(file.name);
    const imageType = "image";
    let result_url: any = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/upload?file=${filename}&type=${imageType}`
    );

    result_url = await result_url.json();

    const ImageFormData = new FormData();
    Object.entries({
      ...result_url.fields,
      file,
    }).forEach(([key, value]) => {
      ImageFormData.append(key, value as string);
    });

    let uploadResult = await fetch(result_url.url, {
      method: "POST",
      body: ImageFormData,
    });

    if (uploadResult.ok) {
      formData.set("imageUrl", uploadResult.url + "/image/" + filename);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        {
          method: "post",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        return { message: "signup_success" };
      } else {
        return { message: "signup_failed" };
      }
    } else {
      return { message: "img_upload_error" };
    }
  } catch (err) {
    console.error(err);
    return { message: null };
  }
};

export default signup;
