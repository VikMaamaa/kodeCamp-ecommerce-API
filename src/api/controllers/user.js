const User  =  require('../models/User')
const bcrypt = require("bcrypt")
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