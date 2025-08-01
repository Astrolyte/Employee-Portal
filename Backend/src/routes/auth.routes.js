import express from "express"
import { registerUser } from "../controllers/user.controller.js"
import { loginUser } from "../controllers/user.controller.js"
import { Router } from "express"
import { upload } from "../middleware/multer.middleware.js";

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
export default router