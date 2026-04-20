const express = require('express')
const router = express.Router()
const Users = require('../models/user')


router.get('/', async(req,res)=>{
    const usersList = await Users.find()

    if(!usersList){
        res.status(500).json({success:false})
    }

    res.send(usersList)
})
