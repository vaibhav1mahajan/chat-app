import express, { type Request, type Response } from 'express'
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';


const PORT = process.env.BACKEND_SERVER_PORT 


const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/v1/auth',authRouter)





app.listen(PORT, ()=>{
        console.log("server is listening on port " + PORT)
})