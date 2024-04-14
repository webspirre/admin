"use server";
// import cloudinary from "@/libs/cloudinary";
import { v2 as cloudinary } from "cloudinary";

import { revalidatePath } from "next/cache";

  // const { resources: sneakers } = await cloudinary.api.resources_by_tag(
  //   "nextjs-server-actions-upload-sneakers",
  //   { context: true }
  // );

export async function create(formData: FormData) {
  const file = formData.get("image") as File;
  console.log("File", file);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: ["nextjs-server-actions-upload-sneakers"],
          upload_preset: "nextjs-server-actions-upload",
        },
        function (error: any, result: any) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

//   revalidatePath("/");
}
