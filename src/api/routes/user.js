const express = require('express')


const router = express.Router()



//import controllers
const {createUser, list, read, updateInfo, updatePassword, deleteUser, login, tokenRefresh} = require('../controllers/user')

//specifying routes
router.post('/register', createUser)
router.post('/login', login)
router.put('/updateInfo/:id', updateInfo)
router.put('/updatePassword/:id', updatePassword)
router.get('/users', list)
router.get('/user/:id', read)
router.delete('/userDelete/:id', deleteUser)
//refresh token
router.get('/refresh', tokenRefresh)

module.exports = router;