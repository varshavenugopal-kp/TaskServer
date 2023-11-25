import mongoose from "mongoose";
import dotenv from "dotenv"

const admin=new mongoose.Schema({
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
    }
})
export const adminSchema = mongoose.model("admin",admin)