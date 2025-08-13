import express from "express"
import { getUserInfo, registerUser,logoutUser, refreshAccessToken } from "../controllers/user.controller.js"
import { loginUser } from "../controllers/user.controller.js"
import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields(
        [
            {
                name:"avatar",
                maxCount:1
            }
        ]
    ),
    registerUser
)
router.route("/login").post(loginUser);
router.route("/current-user").get(verifyJWT,getUserInfo);
router.route("/logout").post(logoutUser);
router.route("/refresh-token").post(refreshAccessToken)
export default router