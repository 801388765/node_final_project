const employer = require('../model/EmployerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('../config/config')
const nodemailer = require("nodemailer");
const etokenModel = require('../model/eTokenModel')
const crypto = require('crypto')
const jobmodel = require('../model/JobModel')
const Category = require("../model/categoryModel")



exports.register = (req, res) => {
    res.render('./Employer/empregister',)
}

exports.post_job = (req, res) => {
    Category.find({
        status: true
    }).then(categoryDetails => {
        res.render("./Employer/post_job", {
            title: "job_post_page",
            categoryData: categoryDetails
        })

    })

}


exports.login = (req, res) => {
    loginData = {}
    loginData.email = req.cookies.email ? req.cookies.email : undefined
    loginData.password = req.cookies.password ? req.cookies.password : undefined

    res.render("./Employer/emplogin", {
        title: "loginpage",
        message: req.flash("message"),
        error: req.flash("error"),
        data: loginData
    })
}



exports.register_create = (req, res) => {
    const Employer = new employer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
        cpassword: req.body.cpassword,
        company: req.body.company,
        image: req.file.path,
    })
    Employer.save()
        .then(emp => {

            const etoken_model = new etokenModel({
                _empId: emp._id,
                etoken: crypto.randomBytes(16).toString('hex')
            })



            etoken_model.save()


                .then(etoken => {

                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "souvikchandra9@gmail.com",
                            pass: "cmgfpgycmjppsjaa"
                        }
                        
                    })


                    var mailOptions = {
                        from: 'no-reply@raju.com',
                        to: emp.email,
                        subject: 'Account Verification',
                        text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/emp/econfirmation\/' + emp.email + '\/' + etoken.etoken + '\n\nThank You!\n'
                    }

                    transporter.sendMail(mailOptions, function (err) {
                        if (err) {
                            console.log("Techniclal Issue...");
                        } else {
                            req.flash("message", "A Verfication Email Sent To Your Mail ID....");
                            res.redirect("/emp/log");
                        }
                    })
                })
                .catch(err => {
                    console.log("error while finding token", err)
                })
        })
        .catch(err => {
            console.log("error while finding employer", err);
        })
}




exports.econfirmation = (req, res) => {
    etokenModel.findOne({ etoken: req.params.etoken }, (err, etoken) => {
        console.log(etoken)
        if (!etoken) {
            console.log("Verification Link May Be Expired :(");
        } else {
            employer.findOne({ _id: etoken._empId, email: req.params.email }, (err, emp) => {
                if (!emp) {
                    req.flash("message", "Employer Not Found");
                    res.redirect("/");
                } else if (emp.isVerified) {
                    req.flash("message", "Employer Already Verified");
                    res.redirect("/");
                } else {
                    emp.isVerified = true;
                    emp.save().then(result => {
                        req.flash("message", "Your Account Verified Successfully");
                        res.redirect("/emp/log");
                    }).catch(err => {
                        console.log("Something Went Wrong...", err);
                    })
                }
            })
        }
    })
}

exports.login_create = (req, res) => {
    employer.findOne({
        email: req.body.email
    })
        .then(edata => {
            if (edata) {
                console.log(edata)
                const hashpassword = edata.password
                if (bcrypt.compareSync(req.body.password, hashpassword)) {
                    const tokendata = jwt.sign({ id: edata._id }, config.security_key, { expiresIn: "5h" })
                    res.cookie("empToken", tokendata)

                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email)
                        res.cookie('password', req.body.password)
                    }

                    res.redirect('/emp/post_job')

                }
                else {
                    console.log('password not match')
                    res.redirect('/emp/log')
                }



            }
            else {
                console.log(' data not found')
                res.redirect('/emp/log')
            }



        })
        .catch(err => {
            console.log("an error in login", err)
        })

}


exports.logout = (req, res) => {
    res.clearCookie("empToken")
    res.redirect('/')
}


/*exports.register = (req, res) => {
    const jobpost = new jobmodel({
       category : req.body.category,
        title: req.body.title,
        cmp: req.body.cmp,
        cmplogo:req.file.filename,
        nature:req.body.nature,
        short:req.body.short,
        full:req.body.full,
        salary:req.body.salary,
    })
    jobpost.save().exec((err,data)=>{
        if(!err){
            console.log(`job data posted`)
            res.render('/')
        }
        else{
            console.log(`error while posting`);
        }
    })
}*/





