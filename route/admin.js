const express = require("express")
const route=express.Router()
const admincontroller = require("../controller/admincontroller")
const utils = require("../utils/utils")
const multer = require('multer')
const path = require('path')
const app= express()

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





route.get("/", admincontroller.login)
route.post("/login_create", admincontroller.logincreate)
route.get("/dashboard", utils.adminauth, admincontroller.dashboard)
route.get("/user", admincontroller.user)
route.get("/employeer", admincontroller.employeer)
route.get("/logout", admincontroller.logout)
route.get("/category", admincontroller.category)
route.post("/category_create", upload.single('image'), admincontroller.category_create)
route.get("/deactive_category/:id", admincontroller.deactive_category)
route.get("/active_category/:id", admincontroller.active_category)
route.get("/job_post", admincontroller.job_post_category)
route.get("/job_post_view", admincontroller.job_post_details)
route.get("/deactive_job_post/:id", admincontroller.deactive_jobPost)
route.get("/active_job_post/:id", admincontroller.active_jobPost)

module.exports = route