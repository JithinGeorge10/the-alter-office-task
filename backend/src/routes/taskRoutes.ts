import {Router} from 'express'
import { addTask, fetchTask } from '../controller/taskController'
import { verifyToken } from '../middleware/authMiddleware'

const taskRoutes=Router()

taskRoutes.post('/add-task',verifyToken,addTask)
taskRoutes.get('/fetch-task',verifyToken,fetchTask)

export default taskRoutes