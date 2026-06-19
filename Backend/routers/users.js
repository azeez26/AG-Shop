const express = require("express");
const router = express.Router();
// const Users = require("../models/user");
// const JWT = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
let {getAllUsers, signup, login, userCount, deleteUser} = require('../controllers/user.js')

router.get("/", getAllUsers);

router.post("/signup", signup);

router.post("/login", login);

router.get("/get/count", userCount);

router.delete("/:id", deleteUser);

module.exports = router;
