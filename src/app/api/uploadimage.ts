import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { paramsToSign } = req.body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    );
    res.status(200).json({
      signature,
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    });
  }
}