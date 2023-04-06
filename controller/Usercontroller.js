const User = require("../model/UserModel")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require("../config/config")
const nodemailer = require("nodemailer");
const tokenModel = require('../model/TokenModel')
const crypto = require('crypto')
const Category = require("../model/categoryModel")

exports.home = (req, res) => {
    Category.find({
        status: true
    }).then(categoryDetails=>{
                res.render("home", {
                    title: "home page",
                    data: req.user,
                    categoryData: categoryDetails
                }) 
            })
}

exports.about = (req, res) => {
    res.render("about", {
        title: "about page"
    })
}

exports.contact = (req, res) => {
    res.render("contact", {
        title: "contact page"
    })
}

exports.joblist = (req, res) => {
    Category.find({
        status: true
    }).then(categoryDetails=>{
        res.render("job", {
            title: "job page",
            categoryData: categoryDetails
        })
    })
}

exports.jobdetails = (req, res) => {
    res.render("jobdetails", {
        title: "jobdetails page"
    })
}

    exports.post_job = (req, res) => {
    res.render("post_job", {
         title: "job_post_page",

     })
 }
/*exports.post_job = (req, res) => {
    res.send("<h1> You Can not Access this page you are a user </h1>")
}*/

exports.register = (req, res) => {
    res.render("register", {
        title: "register page",
        data: req.user,
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
.catch(err =>{
 console.log("error while finding user",err);
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
        data: loginData
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
                        data: req.user,
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


