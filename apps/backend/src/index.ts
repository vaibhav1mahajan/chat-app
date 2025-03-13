import express, { type Request, type Response } from 'express'
import {config} from 'dotenv'
import { prisma } from '@repo/db/index';
import authRouter from './routes/auth';

config()

const PORT = process.env.BACKEND_SERVER_PORT 

const app = express();

app.use(express.json())

app.use('/v1/auth',authRouter)





app.listen(PORT, ()=>{
        console.log("server is listening on port " + PORT)
})