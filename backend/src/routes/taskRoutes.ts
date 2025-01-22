import {Router} from 'express'
import { addTask, fetchTask } from '../controller/taskController'

const taskRoutes=Router()

taskRoutes.post('/add-task',addTask)
taskRoutes.get('/fetch-task',fetchTask)

export default taskRoutes