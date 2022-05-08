const express = require('express')

const router = express.Router()

const {create, list, update, remove, read, categorySearch, nameSearch} = require('../controllers/product')

router.post('/create', create)
router.get('/products', list)
router.patch('/update',update)
router.delete('/delete/:id', remove)
router.get('/product/:id',read)

//for seacrhing
router.get('/products/category/:categoryName', categorySearch)
router.get('/products/name/:productName', nameSearch)

module.exports = router