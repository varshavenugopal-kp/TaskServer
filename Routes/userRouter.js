import { Router } from "express";
import userController from "../Controllers/userController.js";
import { userAuth } from "../Middlewares/userAuth.js";


const router= Router()

router.post('/register',userController.signup)
router.post('/login',userController.loginUser)
router.post('/add',userAuth,userController.addTask)
router.get('/alltasks',userAuth,userController.getTask)
router.post('/editData',userAuth,userController.editTask)
router.get('/single/:taskId',userAuth,userController.getSingle)
router.post('/delete', userController.deleteTask);
router.post('/tasks',userController.editStatus)
router.post('/unCheck',userController.uncheck)
router.get('/tasknum/:userid',userController.tasknum)
router.get('/getUsers/:userid',userAuth,userController.getUser)

export default router