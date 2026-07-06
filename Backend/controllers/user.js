const Users = require("../models/user");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

let getAllUsers = catchAsync(async (req, res, next) => {
  const usersList = await Users.find().select("-password");

  res.status(200).json({
    success: true,
    count: usersList.length,
    data: usersList,
  });
});

let signup = catchAsync(async (req, res, next) => {
  const newUser = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });

  if (!newUser) {
    return next(new appError("User can not be created", 400));
  }

  //using rest params to take the rest of the response whithout the password
  const { password, ...restResponse } = newUser.toObject();
  res.status(201).json({
    success: true,
    data: restResponse,
  });
});

let login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  const userInDB = await Users.findOne({ email });
  if (!userInDB || !bcrypt.compareSync(password, userInDB.password)) {
    return next(new appError("Invalid email or password", 401));
  }

  const token = generateToken(userInDB);

  res.status(200).json({
    success: true,
    data: {
      user: userInDB.email,
      token: token,
    },
  });
});

let getUserCount = catchAsync(async (req, res, next) => {
  const count = await Users.countDocuments();

  res.status(200).json({
    success: true,
    count: usersCount,
  });
});

let deleteUser = catchAsync(async (req, res, next) => {
  const user = await Users.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new appError("This user can not be found", 404));
  }

  return res.status(200).json({
    success: true,
    message: "The user has been deleted",
  });
});

module.exports = { getAllUsers, signup, login, getUserCount, deleteUser };
