import dotenv from "dotenv"
dotenv.config({
    path:`./.env`
})
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log("ENV at startup:", {
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Present" : "Missing",
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Present" : "Missing",
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Present" : "Missing",
// }); -> Debugging , the problem I had was cloudinary was apparently taking values before env was defining
// fix: so what I did was picked up the cloudinary part and assigned it after I define the dotenv in the main server file
import express from "express"
import cors from "cors"
import {connectDB} from "./src/config/db.js"
import cookieParser from "cookie-parser"

//EXPRESS ---------->

const app = express()
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173" || "*",
        methods: ["GET", "POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"],
        credentials: true
    })
)
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//DATABASE CONNECTION ------->
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`MongoDB Server is running at port:.${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("MongoDB connection Failed!!!",err);
})



//routes import

import userRouter from "./src/routes/auth.routes.js"
import pollRouter from "./src/routes/poll.routes.js"
import imageRouter from "./src/routes/image.routes.js"
app.use("/api/v1/users",userRouter);
app.use("/api/v1/poll",pollRouter);
app.use("/api/v1/image-upload",imageRouter);
export {app,cloudinary}