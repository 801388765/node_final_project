const express = require('express')
const route = express.Router()
const employerController = require('../controller/employercontroller')
const multer = require('multer')
const path = require('path')
const utils = require("../utils/utils")
// const verify = require('../middleware/verifyemail')



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



route.get('/',employerController.register)
route.post('/reg/create',  upload.single('image'), employerController.register_create)
route.get('/log',employerController.login)
route.post('/log/create',employerController.login_create)
route.get("/post_job",utils.employerauth,employerController.post_job)
route.get("/dashboard",utils.employerauth,employerController.dashboard)
route.get('/logout',employerController.logout)
route.get("/econfirmation/:email/:etoken",employerController.econfirmation);
//route.post('/jobpost',upload.single('image'),employerController.register)

route.get('/home',employerController.home)
route.get('/joblist',employerController.joblist)
route.get("/joblist_view",employerController.job_post_details)
// route.get('/about',employerController.register)
// route.get('/contact',employerController.register)



module.exports=route