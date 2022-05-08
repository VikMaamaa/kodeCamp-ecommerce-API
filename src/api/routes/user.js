const express = require('express')


const router = express.Router()



//import controllers
const {createUser, list, read, updateInfo, updatePassword, deleteUser} = require('../controllers/user')

//specifying routes
router.post('/register', createUser)
router.put('/updateInfo/:id', updateInfo)
router.put('/updatePassword/:id', updatePassword)
router.get('/users', list)
router.get('/user/:id', read)
router.delete('/userDelete/:id', deleteUser)

module.exports = router;