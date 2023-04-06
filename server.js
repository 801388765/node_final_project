const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const bcrypt = require("bcryptjs")
const session =require("express-session")
const flash=require("connect-flash")
const cookieParser =require("cookie-parser")
const userauth=require("./middleware/userauth")
const adminauth =require("./middleware/adminauth")
const employerauth =require("./middleware/employerauth")
const multer=require("multer")
const app = express()
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({extended:true}))
app.use(flash());
app.use(cookieParser());

app.use(userauth.userauth)
app.use(adminauth.adminauth)
app.use(employerauth.employerauth)


app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: "souvik230598",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine","ejs")
app.set("views","views")

const dotenv=require("dotenv")
dotenv.config()

// for image upload
app.use('/admin/public/upload',express.static(path.join(__dirname,'public/upload')));


//user route
const route = require("./route/user")
app.use(route)

// Employer route
 const employerroute =require("./route/employer")
 app.use("/emp",employerroute)

//admin route

const adminroute =require("./route/admin")
app.use("/admin",adminroute)

const jobsave =require("./route/jobsave")
app.use("/jobpost",jobsave)

const port = process.env.PORT || 5677
const dbDriver =`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.zraidlb.mongodb.net/Final_project`
// const dbDriver = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.i50grcb.mongodb.net/_project`
mongoose.connect(dbDriver,{useNewUrlParser:true,useUnifiedTopology:true})
.then(result=>{
    app.listen(port,()=>{
        console.log("db connected")
        console.log(`the server is running on http://localhost:${port}`)
    })
}).catch(err=>{
    console.log("db not connected")
    console.log(err)
})




