// module.exports = (err, req, res, next) => {
//     const statusCode = err.statusCode || 500;

//     res.status(statusCode).json({
//         success: false,
//         message: err.message
//     });
// };

const appError = require('../helper/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new appError(message, 400)
}

const handleDuplicatedFieldsDB = err => {
    const value = Object.values(err.keyValue)[0]
    const message = `Duplicated field value: ${value}. Please use another value!`
    return new appError(message, 400)
}

const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new appError(message, 400)
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500

    let error = Object.assign(err)

    if (error.name == 'CastError') {
        error = handleCastErrorDB(error)
    }
    if (error.name == 1100) {
        error = handleDuplicatedFieldsDB(error)
    }
    if (error.name == 'ValidationError') {
        error = handleValidationErrorDB(error)
    }


    res.status(error.statusCode).json({
        success: false,
        message: error.message
    })

}