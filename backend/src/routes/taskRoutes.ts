import {Router} from 'express'
import { addTask, changeStatus, deleteTask, fetchTask } from '../controller/taskController'
import { verifyToken } from '../middleware/authMiddleware'

const taskRoutes=Router()

taskRoutes.post('/add-task',verifyToken,addTask)
taskRoutes.post('/delete-task',verifyToken,deleteTask)
taskRoutes.get('/fetch-task',verifyToken,fetchTask)
taskRoutes.get('/change-status',verifyToken,changeStatus)

export default taskRoutes