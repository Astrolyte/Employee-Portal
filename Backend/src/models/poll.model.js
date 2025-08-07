import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
    question:{type:String,required:true},
    type:{type:String, required:true},
    options:[
        {
            optionText:{
                type:String,required:true,
            },
            votes:{
                type:Number,default:0
            }

        },
    ],
    responses:[
        {
            voterId: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
            responseText: {type: String},
            createdAt: {type:Date,default:Date.now},
        }
    ],
    creator: {
        type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
    },
    voters:[{
        type:mongoose.Schema.Types.ObjectId,ref:"User",required:true
    }],
    closed:{
        type:Boolean,default:false
    }
},{timestamps:true})

export const Poll = mongoose.model("Poll",pollSchema);