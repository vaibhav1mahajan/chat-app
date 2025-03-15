import {Router, type Request, type Response} from 'express'
import { assignChatId, protectedRoute } from '../lib/middleware';
import { prisma } from '@repo/db/index';
import cloudinary from '../lib/cloudinary';

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

messageRouter.get('/:id',protectedRoute,assignChatId,async (req:Request,res:Response)=>{
        const chatId = req.chatId;
        
        try {
            const messages = await prisma.message.findMany({
            where:{
                id:chatId as number
            },
            select:{
                text:true,
                image:true,
                chat:{
                    select:{
                        senderId:true,
                        receiverId:true
                    }
                }
            }
        })
        res.status(201).json({
            messages
        })
        } catch (error) {
            console.log("get id endpoint error" ,error)
            res.status(500).json({
                msg:"Internal server error"
            })
        }
})

messageRouter.post('/send/:id',protectedRoute,assignChatId,async(req:Request,res:Response)=>{
    const {text , image } = req.body
    const chatId  = req.chatId as number
    let imageUrl ;
    if(image){
        const uploadResponse =  await  cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url;
    }

    const message = await prisma.message.create({
        data:{
            chatId,
            text,
            image,
        },
        
    })
    res.status(201).json({
         message:message.id   
    })

    
})



export default messageRouter