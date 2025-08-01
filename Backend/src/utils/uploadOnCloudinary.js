console.log("uploadOnCloudinary.js is running");
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = async (localfilepath) => {
  console.log("uploadOnCloudinary called with path:", localfilepath);
  try {
    if (!localfilepath) {
      console.log("File path not found");
      return null;
    }

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });

    console.log("File uploaded:", response.url);
    fs.unlinkSync(localfilepath);
    return response;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    fs.unlinkSync(localfilepath);
    return null;
  }
};

export { uploadOnCloudinary };
