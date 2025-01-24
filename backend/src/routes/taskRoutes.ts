import {Router} from 'express'
import { addTask, changeStatus, deleteBatchTask, deleteTask, editTask, fetchTask, singleUserTask } from '../controller/taskController'
import { verifyToken } from '../middleware/authMiddleware'

const taskRoutes=Router()

taskRoutes.post('/add-task',verifyToken,addTask)
taskRoutes.post('/delete-task',verifyToken,deleteTask)
taskRoutes.get('/fetch-task',verifyToken,fetchTask)
taskRoutes.get('/change-status',verifyToken,changeStatus)
taskRoutes.get('/singleUser-task',verifyToken,singleUserTask)
taskRoutes.patch('/edit-task',verifyToken,editTask)
taskRoutes.put('/deleteBatch-task',verifyToken,deleteBatchTask)

export default taskRoutes