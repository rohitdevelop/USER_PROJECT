const express = require("express")
const userRouter = require('./src/routes/user.route')
const dotenv = require('dotenv')
const db = require('./src/config/db')
const cookieParser = require("cookie-parser");
const indexRouter = require('./src/routes/index.route')
dotenv.config()


db()
const app = express()
const path = require("path");
app.use(express.json())
app.use(cookieParser());  
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.set("views", path.join(__dirname, "src", "views"));
app.set("view engine", "ejs");

app.set("view engine" , "ejs")



app.use('/', indexRouter)
app.use('/user',userRouter)

app.listen(4000,()=>{
    console.log("server is runnig");
    
})