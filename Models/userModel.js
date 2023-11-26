import mongoose from "mongoose";
import dotenv from "dotenv"

const users=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tasks:{
        type:Array,
       
    }
})
export const userSchema = mongoose.model("users",users)