const User = require("../model/UserModel")
const Employer = require('../model/EmployerModel')
const { exec } = require('child_process');

// exports.checkduplicate = (req, res, next) => {

//     User.findOne({ email: req.body.email })
//         .then(data => {
//             if (data) {
//                 req.flash("message", "email already exist")
//                 res.redirect("/register")
//             } else {
//                 next()
//             }
//             const { password, cpassword } = req.body
//             if (password !== cpassword) {
//                 req.flash("message", "Password Incorrrect")
//                 res.redirect("/register")
//             }

//         }).catch(err => {
//             console.log(err)
//         })

// }

exports.checkduplicate=(req,res,next)=>{
    User.findOne({
        email:req.body.email
    }).exec((err,email)=>{
        if (err) {
            console.log(err);
            return 
        }

        if (email) {
            req.flash('error',"User already exist")
            return res.redirect('/register')
        }

        if(req.body.name == '' || req.body.email == '' || req.body.password == '' || req.body.cpassword == '' ) {
            req.flash('error',"please fill out")
            return res.redirect('/register')
        }

        const password=req.body.password
        const confirm=req.body.cpassword
        if (password !== confirm) {
            req.flash('error',"Password & Confirm password are not matched")
            return res.redirect('/register')
        }
        next();
    })
}

exports.checkduplicateEmployer=(req,res,next)=>{
    Employer.findOne({
        email:req.body.email
    }).exec((err,email)=>{
        if (err) {
            console.log(err);
            return 
        }
        if (email) {
            req.flash('error',"Employer already exist")
            return res.redirect('/emp/')
        }

        if(req.body.name == '' || req.body.email == '' || req.body.password == '' || req.body.cpassword == '' ) {
            req.flash('error',"please fill out")
            return res.redirect('/emp/')
        }

        const password=req.body.password
        const confirm=req.body.cpassword
        if (password !== confirm) {
            req.flash('error',"Password & Confirm password are not matched")
            return res.redirect('/emp/')
        }
        next();
    })
}

/*exports.checkduplicatemail=(req,res,next)=>{
    employer.findOne({
        email:req.body.email
    }).exec((err,email)=>{
        if (err) {
            console.log(err);
            return 
        }

        if (email) {
            req.flash('error',"User already exist")
            return res.redirect('/emp/register')
        }

        if(req.body.name == '' || req.body.email == '' || req.body.password == '' || req.body.cpassword == '' ) {
            req.flash('error',"please fill out")
            return res.redirect('/emp/register')
        }

        const password=req.body.password
        const confirm=req.body.cpassword
        if (password !== confirm) {
            req.flash('error',"Password & Confirm password are not matched")
            return res.redirect('/register')
        }
        next();
    })
}*/