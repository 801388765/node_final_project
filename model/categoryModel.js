const mongoose = require("mongoose")
const Schema = mongoose.Schema
const categorySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const categoryModel = new mongoose.model("category", categorySchema)
module.exports = categoryModel