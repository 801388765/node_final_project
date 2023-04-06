const mongoose=require("mongoose")
const Schema =mongoose.Schema
const UseSchema =new Schema ({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },
    cpassword:{
        type:String,
        require:true
    },
    role:{
        type:Number,
        default:0,
        
     }
})

const UserModel = new mongoose.model("User",UseSchema)
module.exports=UserModel