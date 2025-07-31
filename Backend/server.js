import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import {connectDB} from "../Backend/config/db.js"
import cookieParser from "cookie-parser"
dotenv.config({
    path:'./.env'
})

//DATABASE CONNECTION ------->
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`MongoDB Server is running at port:.${process.env.PORT}`)
    })
}).catch((err)=>{
    console.log("MongoDB connection Failed!!!",err);
})

//EXPRESS ---------->

const app = express()
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST","PUT","DELETE"],
        allowedHeaders: ["Content-Type","Authorization"]
    })
)
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
})