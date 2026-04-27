// const expressJwt = require('express-jwt')
const { expressjwt: expressJwt } = require('express-jwt');

function authJwt(){
    const secret = process.env.secret
    const api = process.env.API_URL
    return expressJwt({
        secret,
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            { url: new RegExp(`${api}/products(.*)`), methods: ['GET', 'OPTIONS'] },
            { url: new RegExp(`${api}/categories(.*)`), methods: ['GET', 'OPTIONS'] },
            { url: /\/public\/upload(.*)/, methods: ['GET', 'OPTIONS'] },
            '/api/v1/users/login',
            '/api/v1/users/signup'
        ]
    })
}

async function isRevoked(req, token) {
    if(!token.payload.isAdmin){
        return true;
    }

    return false;
}

module.exports = authJwt