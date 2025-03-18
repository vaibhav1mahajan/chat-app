import express, { type Request, type Response } from 'express'
import authRouter from './routes/auth';
import cookieParser from 'cookie-parser';
import messageRouter from './routes/message';


const PORT = process.env.BACKEND_SERVER_PORT 


const app = express();


app.use(express.json({ limit: "10mb" })); // Increase limit as needed
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser())
app.use('/v1/auth',authRouter)
app.use('/v1/message',messageRouter )


app.listen(PORT, ()=>{
        console.log("server is listening on port " + PORT)
})