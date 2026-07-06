// function oldJWT() {
//   // const expressJwt = require('express-jwt')
//   const { expressjwt: expressJwt } = require("express-jwt");

//   function authJwt() {
//     const secret = process.env.JWT_SECRET;
//     const api = process.env.API_URL;
//     return expressJwt({
//       secret,
//       algorithms: ["HS256"],
//       isRevoked: isRevoked,
//     }).unless({
//       path: [
//         { url: new RegExp(`${api}/products(.*)`), methods: ["GET", "OPTIONS"] },
//         {
//           url: new RegExp(`${api}/categories(.*)`),
//           methods: ["GET", "OPTIONS"],
//         },
//         { url: /\/public\/upload(.*)/, methods: ["GET", "OPTIONS"] },
//         "/api/v1/users/login",
//         "/api/v1/users/signup",
//       ],
//     });
//   }

//   async function isRevoked(req, token) {
//     if (!token.payload.isAdmin) {
//       return true;
//     }

//     return false;
//   }

//   module.exports = authJwt;
// }
const JWT = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Users = require("../models/user");

const JWTProtection = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new appError("You are not logged in! Please log in to get access.", 401),
    );
  }

  const decoded = JWT.verify(token, process.env.JWT_SECRET);

  const currentUser = await Users.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new appError("The user belonging to this token no longer exists.", 401),
    );
  }

  req.user = currentUser;
  next();
});

const restrictToAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(
      new appError("You do not have permission to perform this action", 403),
    );
  }

  next(); 
};

module.exports = {JWTProtection, restrictToAdmin};
