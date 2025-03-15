import { prisma } from "@repo/db/index";
import type { NextFunction, Request, Response } from "express";
import jwt, { decode, type JwtPayload } from 'jsonwebtoken'

export function protectedRoute(req:Request,res:Response,next:NextFunction){
        try {
            const token = req.cookies.jwt;
            if(!token){
                res.status(401).json({
                    msg:"Unauthorized:No token provided"
                })
                return ;
            }
            const decoded = jwt.verify(token,process.env.JWT_SECRET as string)
            if(!decoded){
                res.status(401).json({
                    msg:"Invalid Token"
                })
                return ;
            }
            req.userId = (decoded as JwtPayload).id;
            next();
        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg:"Internal server error"
            })
        }
}

export async function assignChatId(req:Request,res:Response,next:NextFunction){
    const userId = req.userId;
    const receiverId = req.params.id;
    try {
        
            let chatId = await prisma.chat.findFirst({
                where:{
                    OR:[
                        {
                            senderId:userId,
                            receiverId:receiverId
                        },
                        {
                            senderId:receiverId,
                            receiverId:userId
                        }
                    ]
                    
                },
                
            })
           
            if(!chatId){
                 chatId = await prisma.chat.create({
                    data:{
                        senderId:userId as string,
                        receiverId:receiverId
                    },
                   
                })
                
            }             
            req.chatId = chatId.id  
            
            next();
    } catch (error) {
        console.log(error),
        res.json(error)
    }
}