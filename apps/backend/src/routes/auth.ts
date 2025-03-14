import {  Router, type Request, type Response } from "express";
import {signupSchema , signinSchema} from '@repo/common/index'
import { prisma } from "@repo/db/index";
import { assignToken } from "../lib/token";
import bcrypt from "bcryptjs";
import { protectedRoute } from "../lib/middleware";
import cloudinary from "../lib/cloudinary";

const authRouter = Router();

authRouter.post('/signup',async (req:Request,res:Response)=>{
    const body = req.body;
    const response = signupSchema.safeParse(body);
    if(!response.success){
        res.status(411).json({
            msg:"Invalid inputs",
            error:response.error
        })
        return;
    }
    try {
        const {username , password} = response.data 
        const existingUser = await prisma.user.findFirst({
            where:{
                username
            }
        })
        console.log(existingUser)
        if(existingUser){
            res.status(400).json({
                msg:"Username already exist"
            })
            return ;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)
        const user = await prisma.user.create({
            data:{
                username,
                password:hashedPassword
            }
        })
        console.log(user);
        if(!user){
            res.status(400).json({
                msg:"singup failed"
            })
            return;
        }
        res.status(200).json({
            msg:"SignIn successfully",
            user:user.id
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:"Internal server error"
        })
    }
})

authRouter.post('/signin',async (req:Request,res:Response)=>{
    const body = req.body;
    const response = signinSchema.safeParse(body);
    if(!response.success){
        res.json({
            msg:"Invalid Inputs",
            error:response.error
        })
        return
    }
    try {
        const {username , password} = response.data;
        const user = await prisma.user.findFirst({
            where:{
                username
            }
        })
        console.log(user);
        if(!user){
            res.json({
                msg:"Invalid credentials"
            })
            return ;
        }       
      const matched = await bcrypt.compare(password, user.password )
      if(!matched.valueOf){
          res.json({
              msg:"Invalid credentials"
            })
            return ;
        }
        console.log(matched);
        const token = assignToken(user, res);
        res.status(201).json({
            msg:"Signin successfully",
            userId:user.id,
            token
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({
            msg:"Internal server error",
            error
        })
    }
})


authRouter.delete('/logout',protectedRoute,(req:Request,res:Response)=>{
    res.clearCookie('jwt');
    res.json({
        msg:"Token invalided"
    })
})


authRouter.put('/update-profile',protectedRoute,async (req:Request,res:Response)=>{
        try {
            const {profilePic} = req.body;
           const userId =  req.userId
           if(!profilePic){
            res.status(400).json({
                msg:"Profile pic is required"
            })
            return;
           }
         const uploadResponse = await cloudinary.uploader.upload(profilePic);

         if(!uploadResponse){
            res.status(411).json({
                msg:"Profile pic is not uploaded to cloud"
            })
            return ;
         }
         const updatedUser = await prisma.user.update({
            where:{
                id:userId
            },
            data:{
                profilePic:uploadResponse.secure_url
            },

         })
         if(!updatedUser){
            res.status(411).json({
                msg:"Error while updating profile",
            })
            return ;
         }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg:"Internal server error"
            })
        }
})

export default authRouter