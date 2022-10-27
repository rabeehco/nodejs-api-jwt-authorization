const express = require('express')
const app = express()
const mongoose = require('mongoose') 
const routes = require('./routes/routes')
const cors = require('cors')
const cookieParser = require('cookie-parser')


mongoose.connect('mongodb://localhost:27017/jwt_auth').then(() => {
    console.log('Connected to DB')
})

app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200']
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api', routes)


app.listen(3000, () => {
    console.log('connected to Port 3000')
})