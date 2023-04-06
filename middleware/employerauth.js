const jwt = require("jsonwebtoken")
const config = require("../config/config")

exports.employerauth = (req, res, next) => {
  if (req.cookies && req.cookies.empToken) {
    jwt.verify(req.cookies.empToken, config.security_key, (err, data) => {
      if (!err) {
        req.employer = data
        next()
      } else {
        console.log(err)
        next()
      }
    })
  } else {
    next()
  }
}