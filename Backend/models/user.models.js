import mongoose,{schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const userSchema = new schema(
    {
        Name:{
            type:String,
            required:true,
            trim: true,
            index:true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase:true,
            trim:true,
        },
        avatar:{
            type:String,//cloudinary URL
            required:true
        },
        DOB:{
            type:Date,
            required:true
        },
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }
    },{
        timestamps: true,
    }
)
//hashing password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

//compare passwords
userSchema.methods.isPasswordCorect = async function(password){
    return await bcrypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
    },process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User = mongoose.model("User",userSchema);