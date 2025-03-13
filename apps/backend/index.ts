import express, { type Request, type Response } from 'express'
import {config} from 'dotenv'
import { prisma } from '@repo/db/index';

config()

const PORT = process.env.BACKEND_SERVER_PORT 

const app = express();


app.get("/",async (req:Request,res:Response)=>{
  const user = await  prisma.user.create({
        data:{
            password:"123456",
            username:"vaibhav"
        }
    })
    res.json({
        user
    })
})

app.listen(PORT, ()=>{
        console.log("server is listening on port " + PORT)
})