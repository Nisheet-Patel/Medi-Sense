const express = require('express')
const dovenv = require('dotenv')
const cors = require('cors')
const userRouter = require('./routes/userRouter')
const connectMongo = require('./connection')
const cookieParser = require('cookie-parser');
const staticRouter = require('./routes/staticRouter')

dovenv.config()
const PORT = process.env.PORT || 3000
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173', // Allow frontend URL
    credentials: true // Allow cookies to be sent
}));
app.use(cookieParser());

connectMongo('mongodb://localhost:27017/Hackathon')

app.use('/',staticRouter)

app.use('/api/',userRouter)

app.listen(PORT , (e)=>{
    if (e) console.log(e);
    console.log(`server started http://localhost:${PORT}`);
})