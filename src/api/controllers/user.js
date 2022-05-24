const User  =  require('../models/User')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const  {userValidation} = require('../validations/user.validation.js');

exports.createUser = async(req,res)=>{
    try {
         // validate before creating new user using Joi validation
    const { error } = userValidation(req.body);
    if (error)
      return res.status(400).json({
        msg: error.details[0].message,
      });
      
  let  userExists = await  User.findOne({email: req.body.email}).exec()
      if(!userExists){
        //generate password
        // console.log("working",req.body)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
    
        //create new user
        const newUser = await new User({
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           password: hashedPassword,
           email: req.body.email
        }).save()
    
        //return user details upon creation
        res.status(200).json(newUser)}
        else{
            res.status(200).json({msg: "User already exists"})
        }
    } catch (error) {
        //catch error
        console.log(error)
        res.status(500).json(error)
    }
    
    }

exports.login = async(req, res) => {

    try {
        const user = await User.findOne({email: req.body.email}).select('+password')
        if(!user) res.status(400).json("user not found");

       // console.log(user)
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if(!validPassword) res.status(400).json("incorrect password");
    
        //create access token
       const accessToken = jwt.sign({user_id: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60*15})
        
       //create refresh token
       const refreshToken = jwt.sign({user_id: user._id, role: user.role}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: 60*60*24})

       //store refresh token
        user.refreshToken = refreshToken
        await user.save();
        // console.log('refresh Token', refreshToken)
        res.cookie('jwt', refreshToken, {
            sameSite: 'None',
            httpOnly: true,
            //secure: true, 
            maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            status: 'success',
            accessToken
        })
        

    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

    exports.list = async(req, res) => {
        //get all users
        try {
            const users = await User.find({}).exec()

            res.status(200).json(users)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

    exports.read = async(req, res) => {
        try {
            let id = req.params.id
            
            const user = await  User.findById(id).exec()

            res.status(200).json(user)
        } catch (error) {
            console.log(error)
            res.status(500).json(error) 
        }
    }

    exports.updateInfo = async(req, res) => {
        try {
            let id = req.params.id
            if(req.body?.email || req.body?.password){
                return res.status(404).json("you are not allowed to change update email or password with this endpoint")
            }

            const updatedUser = await  User.findByIdAndUpdate(id, {firstName: req.body.firstName, lastName: req.body.lastName}, {new:true}).exec()
       
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }


    exports.updatePassword = async(req, res) => {
        try {
            let id = req.params.id
            if(req.body?.email ){
                return res.status(404).json("you are not allowed to change update email with this endpoint")
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const updatedUser = await  User.findByIdAndUpdate(id, {password: hashedPassword}, {new:true}).exec()
       
            res.status(200).json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }  


    exports.deleteUser = async(req, res) => {
        try {
            let id = req.params?.id

            await  User.findByIdAndDelete(id).exec()

            res.status(200).json({sucess: "Successfully deleted"})
        } catch (error) {
            console.log(error)
            res.status(500).json(error)
        }
    }

//user logout
exports.logout = async(req, res) => {
    return res.clearCookie('jwt').status(200).json("logout successful")
}

//for refreshing token
exports.tokenRefresh = async(req, res) => {
    try {
        //get cookies
        const cookies = req.cookies
        console.log('refreshToken', cookies)
        if(!cookies?.jwt) {
            return res.status(401).json("Access denied, sign in")
        }

        const refreshToken = cookies.jwt
        
        //find user
        const user = await User.findOne({refreshToken})
        if(!user) return res.status(401).json("Access denied, sign in");

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded)=>{
               
                if(err || user.id !== decoded.user_id) {
                    return res.status(403).json("Forbidden")
                }

                 //create access token
       const accessToken = jwt.sign({user_id: user._id, role: user.role}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 60*15})

       return res.status(200).json({
        status: 'success',
        accessToken
    })
            })
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}