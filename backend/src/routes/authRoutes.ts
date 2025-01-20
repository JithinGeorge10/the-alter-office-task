import {Router} from 'express'
import { login, verifyjwt } from '../controller/authController'
import {verifyToken} from '../middleware/authMiddleware'
const authRoutes=Router()

authRoutes.post('/user-login',login)



export default authRoutes