import mongoose from "mongoose";
import { taskSchema } from "../Models/taskModel.js";
import { userSchema } from "../Models/userModel.js";
import generateToken from '../Services/generateToken.js'
import { io } from "../index.js";


const signup=async(req,res)=>{
    const { username, email, password } = req.body
    console.log(req.body);
    try{

        const user = await userSchema.findOne({ email: email })
        console.log(user);

        if(!user){
            const createdUser = await userSchema.create({username,email,password});
        if (createdUser) {
            console.log("varsahaaaaa");
            res.status(201).json({ message: "successful", data: createdUser });

        } else {
            res.status(403).json({ message: "unauthorized request" })
        }
        }else {
            res.status(201).json({ message: "successful", data: user });

        }
     
       

    }catch(err){
        console.log("this is my errorr .................", err);


        res.status(503).json({ message: "internal server error" })
    }
}

const loginUser = async (req,res) => {
    const { email, password } = req.body
    const user = await userSchema.findOne({ email })
    if (user) {
        if (password === user.password) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        }
    } else {
        res.json({ err: "Invalid Username or Password" })
    }
}

const addTask = async (req, res) => {
    try {
        const { task,description,date,userid} = req.body;
        console.log("ji", req.body);
        const result = await taskSchema.create({
           task,
           description,
           date,
           userid
        });
       io.emit('taskAdded', { task: result })
        console.log("resulteeeey",result);
        res.status(200).json({ message: "success", data: result });
    } catch (error) {
        console.log(error);
    }
}

const getTask= async(req,res)=>{
    try{
        const result=await taskSchema.aggregate([
            {
              $lookup: {
                from: "users",
                localField: "userid",
                foreignField: "_id",
                as: "userDetails"
              }
            },
            {
              $unwind: "$userDetails"
            },
            {
              $project: {
                taskDetails: "$$ROOT",
                username: "$userDetails.username"
              }
            }
          ])
          console.log(result);
          res.status(200).json({ message: "success", data: result });
    }catch(err){
        console.log(err);
    }
   
}  

const getUser=async(req,res)=>{
    try{
        const id=req.params.userid
        const user = await userSchema.findOne({ _id:id })
        console.log(user,"bbbbbbbbbbbbbbbb");
        res.status(200).json({ message: "success" ,data:user});
    
    }catch(err){
        console.log(err);
    }
}

const editTask = async (req, res) => {
    try {
        console.log('req.body=',req.body);
        const {id, userid, task, description, date } = req.body;
        const result = await taskSchema.updateOne(
            { _id: id }, // Assuming id is the MongoDB ObjectId
            { 
              $set: {
                task: task,
                description: description,
                date:date
              }
            }
          );
          io.emit('taskEdited', { id, task, description, date });
        res.status(200).json({ message: "success" ,data:result});
    } catch (err) {
        console.log(err);
    }
}

const getSingle = async (req, res) => {
    try {
        const id = req.params.taskId
       console.log(id,"jjjjjjjjjjjjjjjjjj");
        const result = await taskSchema.findOne({ _id: id })
        res.status(200).json({ message: "success", data: result });
    } catch (err) {
        console.log(err);
    }
}

const deleteTask = async (req, res) => {
    try {
        console.log(req.body);
        const { id } = req.body
        const result = await taskSchema.deleteOne({ _id: id }); 

        res.status(200).json({ message: "success" ,data:result});
    } catch (err) {
        console.log(err);
    }
}

const editStatus = async (req, res) => {
    try {
        console.log(req.body);
        const {id, userid } = req.body;
        const result = await userSchema.updateOne({_id:userid},{$push:{tasks:id}})
        console.log(result);
        res.status(200).json({ message: "success" ,data:result});
    } catch (err) {
        console.log(err);
    }
}

const uncheck=async(req,res)=>{
    try {
        console.log('req.bodyz',req.body);
        const {id, userid } = req.body;
        const result = await userSchema.updateOne({_id:userid},{$pull:{tasks:new mongoose.Types.ObjectId(id)}})
        console.log(result);
        res.status(200).json({ message: "success" ,data:result});
    } catch (err) {
        console.log(err);
    }
}
const tasknum=async(req,res)=>{
    try{
        const userid=req.params.userid
        const completed=await userSchema.aggregate([
            {
              $match: {
                _id:new mongoose.Types.ObjectId(userid) // Replace with the actual ObjectId of the user
              }
            },
            {
              $project: {
                numberOfTasks: {
                  $cond: {
                    if: { $isArray: '$tasks' }, // Check if 'tasks' is an array
                    then: { $size: '$tasks' },   // If it's an array, return its size
                    else: 0                      // If it's not an array (or doesn't exist), return 0
                  }
                }
              }
            }
          ]);
        console.log(completed,"kkkkkkkkkkkkk");
        const comtask=completed.length
        const result=await taskSchema.find()
        const total=result.length
        console.log(total);
        res.status(200).json({ message: "success" ,data:total, numberOfTasks: completed[0]?.numberOfTasks || 0});
    }catch(err){
        console.log(err);
    }
}
export default {
    signup,
   loginUser,
   addTask,
   getTask,
   getSingle,
   editTask,
   deleteTask,
   editStatus,
   uncheck,
   tasknum,
   getUser
};