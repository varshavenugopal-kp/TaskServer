import mongoose from "mongoose";
import dotenv from "dotenv"

const tasks=new mongoose.Schema({
    task:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
      type:Date,
      required:true
    },
    userid:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    status:{
        type:Boolean,
        default:false
    }
})
export const taskSchema = mongoose.model("tasks",tasks)