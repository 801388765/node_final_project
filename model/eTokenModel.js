const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const etokenSchema = new Schema({
    _empId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'employer',
    },
    etoken:{
        type:String,
        required:true
    },
    expiredAt:{
        type:Date,
        default:Date.now,
        index:{
            expires:86400000
        }
    }
})

const etokenModel = new mongoose.model("etoken",etokenSchema);
module.exports =etokenModel;