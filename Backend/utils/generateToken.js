const JWT = require("jsonwebtoken")

const generateToken = (user) =>{
    const secret = process.env.SECRET
    
    const token = JWT.sign(
        {
            userId : user._id,
            isAdmin : user.isAdmin,
            username : user.name
        },
        secret,
        {expiresIn: "1d"}
    )

    return token
}

module.exports = generateToken