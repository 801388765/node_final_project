const mongoose = require("mongoose")
const Schema = mongoose.Schema
const PostSchema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
    },
    title: {
        type: String,
        require: true,
    },
    cmp: {
        type: String,
        require: true,
    },
    cmplogo: {
        type: String,
        require: true
    },
    short: {
        type: String,
        require: true,

    },
    full: {
        type: String,
        require: true
    },
    nature: {
        type: String,
        require: true
    },
    salary: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: true
    }

})

const JobModel = new mongoose.model("job_post", PostSchema)
module.exports = JobModel