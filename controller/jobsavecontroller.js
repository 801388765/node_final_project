const jobmodel = require('../model/JobModel')
const Category = require("../model/categoryModel")

exports.register = (req, res) => {
    const jobpost = new jobmodel({
        category: req.body.category,
        title: req.body.title,
        cmp: req.body.cmp,
        cmplogo: req.file.path,
        nature: req.body.nature,
        short: req.body.short,
        full: req.body.full,
        salary: req.body.salary,
    })
    jobpost.save()
        .then(pdata => {
            if (pdata) {
                console.log(`job data posted`)
                res.redirect('/emp/post_job')
            }
            else {
                console.log(`error while posting`);
            }
        })

}

exports.lookupForJobPost = async (req, res) => {

    try {
        const result = await Category.aggregate([
            {
                $lookup: {
                    from: "job_posts",
                    localField: "_id",
                    foreignField: "category",
                    as: "jobpost_docs"
                }
            },
            {
                $match: { "jobpost_docs": { $ne: [] } }
            }
        ])
        res.json({ status: true, msg: "data fetched successfully", data: result })

    } catch (error) {
        res.json({ status: false, msg: "data is not fetched", error_msg: error })
    }
}
