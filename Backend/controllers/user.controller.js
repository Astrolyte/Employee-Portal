import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.models.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessandRefreshTokens = async(UserId) => {
    try {
        const User = await user.findById(UserId);
        const accessToken = await User.generateAccessToken();
        const refreshToken = await User.generateRefreshToken();

        User.refreshToken = refreshToken;
        await User.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating a refresh and access token"
        );
    }
}

const registerUser = asyncHandler(async(req,res)=>{
    const {name,profilePhoto,DOB,Email,Password,ConfirmPassword} = req.body;
    
    if(
        [name,Email,Password]
    )

})