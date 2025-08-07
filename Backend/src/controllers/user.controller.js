import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Poll } from "../models/poll.model.js";

const generateAccessandRefreshTokens = async (UserId) => {
  try {
    const user = await User.findById(UserId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating a refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { Name, DOB, email, password } = req.body;

  if (!Name || !email || !password || !DOB) {
    throw new ApiError(400, "All fields are required");
  }
  const parsedDOB = new Date(DOB);
  if (isNaN(parsedDOB)) {
    throw new ApiError(400, "Invalid date format for DOB. Use YYYY-MM-DD.");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "email is already in use.");
  }
  const avatarLocalPath = req.files?.avatar[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is there");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "didnt get the avatar");
  }
  const user = await User.create({
    Name,
    avatar: avatar.url,
    DOB: parsedDOB,
    email,
    password,
  });
  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully", createduser));
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "email and password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User Doesnt Exist , Retry");
  }
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(400, "Invalid email or password");
  }
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );


  const totalPollsCreated = await Poll.countDocuments({creator: loggedInUser._id});

  const totalPollsVotes = await Poll.countDocuments({voters: user._id})

  //TO-DO -> Create total ideas created and voted
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user:{
            ...loggedInUser.toObject(),
            totalPollsCreated,
            totalPollsVotes,
            totalIdeasCreated: 0,
            totalIdeasVotes: 0,
          }
        },
        "User logged in successfully"
      )
    );
});
const getUserInfo = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }
    const totalPollsCreated = await Poll.countDocuments({creator: user._id});

  const totalPollsVotes = await Poll.countDocuments({voters: user._id})

  //TO-DO -> Create total ideas created and voted
  const userInfo = {
    ...user.toObject(),
    totalPollsCreated,
    totalPollsVotes,
    totalIdeasCreated: 0,
    totalIdeasVoted: 0,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, "User fetched successfully", userInfo));
});
export { registerUser, loginUser, getUserInfo };
