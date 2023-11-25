import { Router } from "express";
import userController from "../Controllers/userController.js";


const router= Router()

router.post('/register',userController.signup)
router.post('/login',userController.loginUser)
router.post('/add',userController.addTask)
router.get('/alltasks',userController.getTask)
router.post('/editData',userController.editTask)
router.get('/single/:taskId',userController.getSingle)
router.post('/delete', userController.deleteTask);
export default router