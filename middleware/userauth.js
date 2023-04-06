const jwt = require("jsonwebtoken")
const config = require("../config/config")

exports.userauth = (req, res, next) => {
  if (req.cookies && req.cookies.usertoken) {
    jwt.verify(req.cookies.usertoken, config.security_key, (err, data) => {
      if (!err) {
        req.user = data
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