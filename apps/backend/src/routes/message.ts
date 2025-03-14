import {Router, type Request, type Response} from 'express'
import { protectedRoute } from '../lib/middleware';
import { prisma } from '@repo/db/index';

const messageRouter = Router();

messageRouter.get('/users',protectedRoute,async (req:Request,res:Response)=>{

    try {
        const users = await prisma.user.findMany({
                select:{
                    username:true
                },
                where:{
                    id:{
                        not:req.userId
                    }
                }
        })
        if(!users) {
            res.status(400).json({
                msg:"User data fetched failed"
            })
            return ;
        }
        res.status(200).json({
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Internal server error"
        })
    }
        
})




export default messageRouter