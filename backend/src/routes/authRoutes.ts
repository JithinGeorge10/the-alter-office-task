import {Router} from 'express'
import { login } from '../controller/authController'

const authRoutes=Router()

authRoutes.post('/user-login',login)



export default authRoutes