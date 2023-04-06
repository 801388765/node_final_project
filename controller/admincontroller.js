const User = require("../model/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const config = require("../config/config")
const Category = require("../model/categoryModel")
const JobPost = require("../model/JobModel")
const mongoose = require('mongoose')

exports.login = (req, res) => {
    res.render("./admin/login", {
        title: "login page",
        message: req.flash("message"),
        error: req.flash("error")
    })
}

exports.logincreate = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(data => {
            if (data) {
                if (data && data.role == 1) {
                    const hashpassword = data.password
                    if (bcrypt.compareSync(req.body.password, hashpassword)) {
                        const tokendata = jwt.sign({ id: data._id }, config.security_key, { expiresIn: "30m" })
                        res.cookie("admintoken", tokendata)
                        res.redirect("/admin/dashboard")
                    } else {
                        req.flash("error", "Password Incorrect")
                        res.redirect("/admin/")

                    }
                } else {
                    req.flash("error", "No Admin found")
                    res.redirect('/admin')
                }
            } else {
                req.flash("error", "No Admin found")
                res.redirect('/admin/')
            }
        }).catch(err => {
            console.log(err)
        })
}

exports.dashboard = (req, res) => {
    if (req.admin) {
        User.find()
            .then(userdetails => {
                if (userdetails) {
                    res.render("./admin/dashboard", {
                        data: req.admin,
                        details: userdetails
                    })
                } else {
                    console.log("no data found")
                }
            }).catch(err => {
                console.log(err)
            })
    }
}


exports.user = (req, res) => {
    res.render("./admin/user", {
        title: "user page"
    })
}

exports.employeer = (req, res) => {
    res.render("./admin/employeer", {
        title: "employeer page"
    })
}

exports.category = (req, res) => {
    Category.find()
        .then(data => {
            res.render("./admin/category", {
                title: "Category",
                message: req.flash('message'),
                error: req.flash('error'),
                categoryData: data
            })
        }).catch(err => {
            console.log(err);
        })

}

exports.category_create = (req, res) => {
    Category.findOne({
        name: req.body.name
    }).then(data => {
        if (data) {
            req.flash("error", "Category name already exists")
            res.redirect("/admin/category")
        } else {

            const category = new Category({
                name: req.body.name,
                image: req.file.path
            })
            category.save((err, data) => {
                if (!err) {
                    req.flash("message", "Category added")
                    res.redirect("/admin/category")
                } else {
                    req.flash("error", "Category not added")
                    res.redirect("/admin/category")
                }

            })
        }
    }).catch(error => {
        console.log(error);
        req.flash("error", "Category not added")
        res.redirect("/admin/category")
    })
}

exports.deactive_category = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, { status: false })
        .then(data => {
            req.flash("message", "Category deactivated")
            res.redirect("/admin/category")
        }).catch(err => {
            req.flash("error", "Category is not deactivated")
            res.redirect("/admin/category")
        })
}

exports.active_category = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, { status: true })
        .then(data => {
            req.flash("message", "Category activated")
            res.redirect("/admin/category")
        }).catch(err => {
            req.flash("error", "Category is not activated")
            res.redirect("/admin/category")
        })
}


exports.job_post_category = (req, res) => {
    Category.find()
        .then(data => {
            res.render("./admin/job_post", {
                title: "Job Post page",
                job_details_data: [],
                categoryData: data,
                message: req.flash('message'),
                error: req.flash('error')
            })
        })

}

exports.job_post_details = (req, res) => {

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
        req.flash("message", "Job details fetched")
        res.render("./admin/job_post_view", {
            title: "Job Post page",
            job_details_data: job_details_data,
            message: req.flash('message'),
            error: req.flash('error')
        })
        // res.redirect("/admin/job_post")
    }).catch(err => {
        console.log(err);
        req.flash("error", "Job details are not fetched")
        res.redirect("/admin/job_post")
    })

}

exports.deactive_jobPost = (req, res) => {
    JobPost.findByIdAndUpdate(req.params.id, { status: false })
        .then(data => {
            req.flash("message", "Job is deactivated")
            res.redirect(`/admin/job_post_view?selectpicker=${data.category}`)
        }).catch(err => {
            req.flash("error", "Job is not deactivated")
            res.redirect(`/admin/job_post_view?selectpicker=${data.category}`)
        })
}

exports.active_jobPost = (req, res) => {
    JobPost.findByIdAndUpdate(req.params.id, { status: true })
        .then(data => {
            req.flash("message", "Job is activated")
            res.redirect(`/admin/job_post_view?selectpicker=${data.category}`)
        }).catch(err => {
            req.flash("error", "Job is not activated")
            res.redirect(`/admin/job_post_view?selectpicker=${data.category}`)
        })
}



// exports.job_post_details = (req, res) =>{

//         const result = Category.aggregate([
//             {
//                 $lookup: {
//                     from: "job_posts",
//                     localField: "_id",
//                     foreignField: "category",
//                     as: "jobpost_docs"
//                 }
//             },
//             {
//                 $match: {
//                     _id: mongoose.Types.ObjectId(req.query.selectpicker)
//                 }
//             }
//         ])
//         result.then(job_details_data=>{
//             Category.find()
//                 .then(categoryData=>{
//                     res.render("./admin/job_post",{
//                         title:"Job Post page",
//                         categoryData: categoryData,
//                         job_details_data:job_details_data,
//                         message: req.flash('message'),
//                         error: req.flash('error')
//                     })
//                 })

//             req.flash("message", "Job details fetched")
//             // res.redirect("/admin/job_post")
//         }).catch(err=>{
//             console.log(err);
//             req.flash("error", "Job details are not fetched")
//             res.redirect("/admin/job_post")
//         })

// }



exports.logout = (req, res) => {
    res.clearCookie("admintoken")
    res.redirect("/admin/")
}