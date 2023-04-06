const mongoose=require("mongoose")
const Schema =mongoose.Schema
const employerSchema =new Schema ({
    name:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    phone:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true
    },
    company:{
        type:String,
       require:true
        
    },
     image:{
        type:String,
       require:true
     },

     isemployer:{
        type:Boolean,
        default:true
     }
})

const employerModel = new mongoose.model("employer",employerSchema)
module.exports=employerModel