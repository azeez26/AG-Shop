const Users = require("../models/user");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");


let getAllUsers = async (req, res) => {
    const usersList = await Users.find().select("-password");

    if (!usersList) {
        res.status(500).json({ success: false });
    }

    res.send(usersList);
}


let signup = async (req, res) => {
    try {
        const newUser = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        });
        //using rest params to take the rest of the response whithout the password
        const { password, ...restResponse } = newUser.toObject();
        res.status(201).send(restResponse);
    } catch (err) {
        res.status(400).json({ error: err.message, message: "You cant signup" });
    }
}

let login = async (req, res) => {
    try {
        const user = { email: req.body.email, password: req.body.password };
        const userInDB = await Users.findOne({ email: user.email });
        const secret = process.env.JWT_SECRET;
        console.log(userInDB)
        if (!userInDB) {
            return res.status(404).send("No such user");
        }

        if (userInDB && bcrypt.compareSync(user.password, userInDB.password)) {
            const token = JWT.sign(
                {
                    userId: userInDB._id,
                    isAdmin: userInDB.isAdmin,
                    username: userInDB.name,
                },
                secret,
                { expiresIn: "1d" },
            );

            return res.status(200).send({ user: user.email, token: token });
        }
        return res.status(400).send("Invalid email or password");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

let userCount = async (req, res) => {
    try {
        const usersCount = await Users.countDocuments();

        res.status(200).send({
            usersCount: usersCount,
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
}

let deleteUser = async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);

        if (user) {
            return res.status(200).json({
                success: true,
                message: "The user is deleted!",
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "user not found!",
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            error: err.message,
        });
    }
}

module.exports = { getAllUsers, signup, login, userCount, deleteUser }