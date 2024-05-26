"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";

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
    let file = formData.get("image") as File;
    let filename = encodeURIComponent(file.name);
    // console.log(filename, "filename");
    let result_url = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/profileUpload?file=${filename}`
    );

    result_url = await result_url.json();
    // console.log(result_url, "result_url");

    const ImageFormData = new FormData();
    Object.entries({ ...result_url.fields, file }).forEach(([key, value]) => {
      ImageFormData.append(key, value as string);
    });
    // console.log(ImageFormData, "imageFormData");
    let uploadResult = await fetch(result_url.url, {
      method: "POST",
      body: ImageFormData,
    });

    // console.log(uploadResult, "uploadResult");
    console.log(uploadResult.ok, "isitok?");

    if (uploadResult.ok) {
      formData.set("imageUrl", uploadResult.url + "/" + filename);
      console.log(formData.get("imageUrl"), "uploadUrl");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users`,
        {
          method: "post",
          body: formData,
          credentials: "include",
        }
      );
      console.log(response.status, "status");
      if (response.status === 403) {
        return { message: "user_exists" };
      }
      // console.log(await response.json(), "resjson");
      shouldRedirect = true;
      await signIn("credentials", {
        username: formData.get("id"),
        password: formData.get("password"),
        redirect: false,
      });
    } else {
      return { message: "img_upload_error" };
    }
  } catch (err) {
    console.error(err);
    return { message: null };
  }

  if (shouldRedirect) {
    redirect("/home"); // try/catch문 안에서 X
  }
  return { message: null };
};

export default signup;
