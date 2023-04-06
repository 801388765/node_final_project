const express = require('express')
const route = express.Router()
const jobcontroller = require('../controller/jobsavecontroller')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/upload/")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + 'details' + path.extname(file.originalname));
    }
})
const maxSize = 2 * 1024 * 1024; // for 1MB

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
        }
    },
    limits: {
        fileSize: maxSize
    }
});



route.post('/save',upload.single('image'),jobcontroller.register)

route.get('/lookupForJobPost', jobcontroller.lookupForJobPost)



module.exports = route 

