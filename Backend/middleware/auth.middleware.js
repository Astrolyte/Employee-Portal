import { User } from "../models/user.models";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req,_,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401,"Unauthorized Access");
        }
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        const user = await User.findById(decoded?._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401,"Unauthorized Access");
        }
        req.user = user;
        next();
    } catch (error) {
            throw new ApiError(401,error?.message || "Invalid Access Token");
    }
})