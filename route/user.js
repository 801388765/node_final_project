const express = require("express")
const { verify } = require("jsonwebtoken")
const route=express.Router()
const controller = require("../controller/Usercontroller")
const middleware =require("../middleware/verifyemail")
const utils = require("../utils/utils")

route.get("/",controller.home)
route.get("/about",controller.about)
route.get("/contact",controller.contact)
route.get("/joblist",controller.joblist)
route.get("/jobdetails",controller.jobdetails)
route.get("/post_job",controller.post_job)

route.get("/register", controller.register)
route.post("/register_create", [middleware.checkduplicate], controller.register_create)
route.get("/login", controller.login)
route.post("/login_create", controller.login_create)
route.get("/dashboard", utils.userauth, controller.dashboard)
route.get("/logout", controller.logout)
route.get("/confirmation/:email/:token",controller.confirmation);

module.exports = route