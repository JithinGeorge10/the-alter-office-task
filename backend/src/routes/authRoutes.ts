import {Router} from 'express'
import { login, verfiyJwt } from '../controller/authController'

const authRoutes=Router()

authRoutes.post('/user-login',login)
authRoutes.post('/verify-jwt',verfiyJwt)




export default authRoutes