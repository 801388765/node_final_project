const User = require("../model/UserModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config/config")
const nodemailer = require("nodemailer");
const tokenModel = require('../model/TokenModel')
const crypto = require('crypto')
const Category = require("../model/categoryModel")
const Employer = require("../model/EmployerModel")
const JobPost = require("../model/JobModel")
const mongoose=require('mongoose')

exports.home = (req, res) => {
    const categoryResult =  Category.aggregate([
        {   $match: {status: {$ne: false}}},
        {
            $lookup: {
                from: "job_posts",
                localField: "_id",
                foreignField: "category",
                as: "jobpost_docs"
            }
        }, 
        {
            $match: { 
               
                "jobpost_docs.status": {$ne: false} 
            }
        },
        {   
            
            $addFields: { job_size: { $size: "$jobpost_docs" } } 
        },
        {
            $sort: {job_size: -1}
        }
    ])
    categoryResult.then(categoryDetails => {
        const result = Category.aggregate([
            {
                $lookup: {
                    from: "job_posts",
                    localField: "_id",
                    foreignField: "category",
                    as: "jobpost_docs"
                }
            },
            {
                $match: {
                    jobpost_docs: { $ne: [] },
                    status: { $ne: false},
                    "jobpost_docs.status": {$ne: false}
                }
            }
        ])
        result.then(job_details_data => {
            res.render("home", {
                title: "Home page",
                job_details_data: job_details_data,
                categoryData: categoryDetails,
                sessionData: req.user || req.employer || {}
            })
            // console.log(job_details_data);
        }).catch(err => {
            console.log(err);
            res.redirect("/")
        })
    })
}

exports.about = (req, res) => {
    Employer.find()
        .then(employerdetails => {
            res.render("about", {
                title: "about page",
                loginData:req.user,
                employerdata: employerdetails,
                sessionData: req.user || req.employer || {}
            })
        })
    }

exports.contact = (req, res) => {
                res.render("contact", {
                    title: "contact page",
                    sessionData: req.user || req.employer || {}
                })
}

exports.joblist = (req, res) => {
    Category.find({
        status: true
    }).then(categoryDetails => {
        const result = Category.aggregate([
            {
                $lookup: {
                    from: "job_posts",
                    localField: "_id",
                    foreignField: "category",
                    as: "jobpost_docs"
                }
            },
            {
                $match: {
                    jobpost_docs: { $ne: [] },
                    status: { $ne: false},
                    "jobpost_docs.status": {$ne: false}
                }
            }
        ])
        result.then(job_details_data => {
            res.render("job", {
                title: "Job List page",
                job_details_data: job_details_data,
                categoryData: categoryDetails,
                sessionData: req.user || req.employer || {}
            })
            // console.log(job_details_data);
        }).catch(err => {
                console.log(err);
                res.redirect("/")
            })
    }).catch(error=>{
        console.log(error)
        res.redirect("/")
    })
    
}

exports.job_post_details = (req, res) => {
    Category.find({
        status: true
    }).then(categoryDetails => {
        const result = Category.aggregate([
        {
            $lookup: {
                from: "job_posts",
                localField: "_id",
                foreignField: "category",
                as: "jobpost_docs"
            }
        },
        {
            $match: {
                _id: mongoose.Types.ObjectId(req.query.selectpicker)
            }
        }
        ])
        result.then(job_details_data => {
        res.render("job", {
            title: "Job List page",
            job_details_data: job_details_data,
            categoryData: categoryDetails,
            sessionData: req.user || req.employer || {}
        })
        }).catch(err => {
            console.log(err);
            res.redirect("/")
        })
    }).catch(error=>{
        console.log(error)
        res.redirect("/")
    })

}


exports.jobdetails = (req, res) => {
    res.render("jobdetails", {
        title: "jobdetails page",
        sessionData: req.user || req.employer || {}
    })
}

exports.post_job = (req, res) => {
    res.render("post_job", {
        title: "job_post_page",

    })
}


exports.register = (req, res) => {
                res.render("register", {
                    title: "register page",
                    sessionData: req.user || {},
                    message: req.flash("message"),
                    error: req.flash("error")
                })
            }

exports.register_create = (req, res) => {
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
                })
                user.save()
                    .then(user => {

                        const token_model = new tokenModel({
                            _userId: user._id,
                            token: crypto.randomBytes(16).toString('hex')
                        })



                        token_model.save()


                            .then(token => {

                                var transporter = nodemailer.createTransport({
                                    host: "smtp.gmail.com",
                                    port: 587,
                                    secure: false,
                                    requireTLS: true,
                                    auth: {
                                        user: "sahananaser94@gmail.com",
                                        pass: "gtavpzuvfvfnkzzc"
                                    }
                                })


                                var mailOptions = {
                                    from: 'no-reply@raju.com',
                                    to: user.email,
                                    subject: 'Account Verification',
                                    text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                                }

                                transporter.sendMail(mailOptions, function (err) {
                                    if (err) {
                                        console.log("Techniclal Issue...");
                                    } else {
                                        req.flash("message", "A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...");
                                        res.redirect("/login");
                                    }
                                })
                            })
                            .catch(err => {
                                console.log("error while finding token", err)
                            })
                    })
                    .catch(err => {
                        console.log("error while finding user", err);
                    })
            }
    /*.then(data => {
        req.flash("message", "User registered successfully")
        res.redirect("/login")
    }).catch(err => {
        req.flash('error', "Error in saving data")
        res.redirect('/register')
    })*/

    exports.confirmation = (req, res) => {
                tokenModel.findOne({ token: req.params.token }, (err, token) => {
                    if (!token) {
                        console.log("Verification Link May Be Expired :(");
                    } else {
                        User.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {
                            if (!user) {
                                req.flash("message", "User Not Found");
                                res.redirect("/");
                            } else if (user.isVerified) {
                                req.flash("message", "User Already Verified");
                                res.redirect("/");
                            } else {
                                user.isVerified = true;
                                user.save().then(result => {
                                    req.flash("message", "Your Account Verified Successfully");
                                    res.redirect("/login");
                                }).catch(err => {
                                    console.log("Something Went Wrong...", err);
                                })
                            }
                        })
                    }
                })
            }



exports.login = (req, res) => {

                loginData = {}
                loginData.email = req.cookies.email ? req.cookies.email : undefined
                loginData.password = req.cookies.password ? req.cookies.password : undefined

                res.render("login", {
                    title: "loginpage",
                    message: req.flash("message"),
                    error: req.flash("error"),
                    data: loginData,
                    sessionData:req.user || {}
                })
            }

exports.login_create = (req, res) => {
                User.findOne({ email: req.body.email })
                    .then(data => {
                        if (data && data.role == 0) {
                            const hashpassword = data.password
                            if (bcrypt.compareSync(req.body.password, hashpassword)) {
                                const tokendata = jwt.sign({ id: data._id, name: data.name }, config.security_key, { expiresIn: "30m" })
                                res.cookie("usertoken", tokendata)

                                if (req.body.rememberme) {
                                    res.cookie('email', req.body.email)
                                    res.cookie('password', req.body.password)
                                }
                                res.redirect("/dashboard")
                            } else {
                                req.flash("error", "Password Incorrect")
                                res.redirect("/login")
                            }

                        } else {
                            req.flash("error", "No data found with this email id")
                            res.redirect("/login")
                        }
                    }).catch(err => {
                        console.log("error", err)
                    })

            }

exports.dashboard = (req, res) => {
                if (req.user) {
                    User.find()
                        .then(userDetails => {
                            if (userDetails) {
                                res.render('dashboard', {
                                    sessionData: req.user,
                                    details: userDetails,
                                    //docs:User.find()            
                                })
                            } else {
                                console.log("No data found");
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            }


exports.logout = (req, res) => {
                res.clearCookie("usertoken")
                res.redirect("/")
            }


