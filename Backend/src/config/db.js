import mongoose from "mongoose";
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{});
        console.log("Mongo DB Connected");
    }catch(err){
        console.log("Error connecting to MongoDB",err);
        process.exit(1);
    }
}

export {connectDB}