

const express=require('express')
const cors=require('cors')
const cookieParser=require('cookie-parser');
const userRoutes=require('./route/user.route')
const errorMiddleware=require('../server/middlewares/error.middleware');
const courseRoute=require('./route/courseRoute')
const morgan = require('morgan');


const app=express();
app.use(morgan('dev'))


app.use(express.json());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
        Credentials:true
}))
app.use(cookieParser()) 
app.use('/ping',(req,res)=>{
    res.send('Pong');
})
app.use('/api/v1/courses',courseRoute)

app.use('/api/v1/user',userRoutes);
app.all('*',(req,res)=>{
    res.status(404).send('OOPS!! 4040 PAGE NOT FOUND');
})
app.use(errorMiddleware);

module.exports=app;

