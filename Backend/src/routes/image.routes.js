import express from "express"

import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.post("/upload",upload.single("file"),asyncHandler(async(req,res)=>{
    const localPath = req.file.path;
    const cloudinaryResponse = await uploadOnCloudinary(localPath);

    if(!cloudinaryResponse){
        throw new ApiError(500,"Upload failed , cloudinary failed");
    }
    return res.status(200).json(new ApiResponse(200,"Uploaded successfully",{url: cloudinaryResponse.url}));
}))


export default router;