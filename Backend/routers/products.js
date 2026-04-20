const express = require('express')
const router = express.Router()
const Product = require('../models/product')


router.post('/', async (req,res)=>{
    const enteredItem = req.body

    const prdItem = new Product(enteredItem)
    await prdItem.save()

    res.send('Succeded')

})

module.exports = router