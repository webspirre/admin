// pages/api/upload.ts

import cloudinary from "@/libs/cloudinary";
import { supabase } from "@/libs/supabase";
import { NextApiRequest, NextApiResponse } from "next";
// import { v2 as cloudinary } from "cloudinary";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const file = req.body.file; // Assuming the client sends the file in the request body
    const result = await cloudinary.uploader.upload(file); // Upload the file to Cloudinary
    const imageUrl = result.secure_url; // Get the Cloudinary URL
    // Store the image URL in Supabase
    // code to store the image URL in
    const { data, error } = await supabase
      .from("images")
      .insert([{ url: imageUrl }]);
    if (error) {
      throw error;
    }
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
}
