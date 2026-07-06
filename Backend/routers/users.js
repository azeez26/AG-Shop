const express = require("express");
const router = express.Router();
const {JWTProtection, restrictToAdmin} = require("../middleware/jwt")
let {getAllUsers, signup, login, getUserCount, deleteUser} = require('../controllers/user.js')

router.post("/signup", signup);

router.post("/login", login);

router.get("/", JWTProtection, restrictToAdmin ,getAllUsers);

router.get("/get/count", JWTProtection, restrictToAdmin ,getUserCount);

router.delete("/:id", JWTProtection, restrictToAdmin ,deleteUser);

module.exports = router;
