import {Router} from 'express'
import { addTask } from '../controller/taskController'

const taskRoutes=Router()

taskRoutes.post('/add-task',addTask)

export default taskRoutes