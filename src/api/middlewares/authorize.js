const jwt = require('jsonwebtoken')

exports.authorize = async(req,res, next) => {
  try {
        //get token from request
    const authHeader = req.headers('authorization')

    if(!authHeader) res.status(403).json("Access Denied, Please sign in");

    //token verification
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const token = authHeader.split(' ')[1]

    //attach verified user detatils to request
    req.user = verified
    next() 
    } catch (error) {
        console.log(error)
        res.status(403).json(error)
    }
}