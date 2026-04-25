const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

app.use(cors())

require('dotenv/config')
const api = process.env.API_URL
const port = process.env.PORT



//Middlewares
app.use(express.json())
app.use(morgan('tiny'))

//Routes
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories')
const usersRouter = require('./routers/users')


app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)









//Database connection settings
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Database connection is ready ...')
})
.catch((err)=>{
    console.log(err.message);
    
})

app.listen(port, ()=>{
    console.log(`app running on http://localhost:${port}`)
})
