const jobmodel = require('../model/JobModel')
const Category = require("../model/categoryModel")

exports.register = (req, res) => {
    const jobpost = new jobmodel({
        category: req.body.category,
        title: req.body.title,
        cmp: req.body.cmp,
        cmp_address: req.body.cmp_address,
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
                    "jobpost_docs": { $ne: [] }, 
                    "jobpost_docs.status": {$ne: false} 
                }
            },
           
                
            
           
        ])
        res.json({ status: true, msg: "data fetched successfully", data: result })

    } catch (error) {
        console.log(error);
        res.json({ status: false, msg: "data is not fetched", error_msg: error })
    }
}


exports.lookupForJobCount = async (req, res) => {

    try {
        const result = await Category.aggregate([
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
        res.json({ status: true, msg: "data fetched successfully", data: result })

    } catch (error) {
        console.log(error);
        res.json({ status: false, msg: "data is not fetched", error_msg: error })
    }
}

// exports.lookupForfeaturedJob = async (req, res) => {

//     try {
//         const result = await jobmodel.aggregate([
//             {   $match: {status: {$ne: false}}},
//             {
//                 $lookup: {
//                     from: "categories",
//                     localField: "category",
//                     foreignField: "_id",
//                     as: "category_docs"
//                 }
//             }, 
//             {
//                 $match: { 
                   
                    
//                 }
//             },
            
           
//         ])
//         res.json({ status: true, msg: "data fetched successfully", data: result })

//     } catch (error) {
//         console.log(error);
//         res.json({ status: false, msg: "data is not fetched", error_msg: error })
//     }
// }