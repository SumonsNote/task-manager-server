// Basic Lib Important
const express = require('express')
const router = require('./src/routes/api')
const app = new express();
const bodyParser = require('body-parser')

// Security Middleware Import
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')

// Database Lim Import
const mongoose = require('mongoose')

// Security Middleware Implement
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
// Body Parser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// Request Rate Limit
const limiter = rateLimit({windowMs:15*60*1000, max:5000})
app.use(limiter)

// Mongo DB Databse Connection
let URI = 'mongodb+srv://<username>:<password>@cluster0.drwbe.mongodb.net/task-manager-todo-application?retryWrites=true&w=majority'
let OPTION = {user: 'task-manager-todo-application', pass: 'task-manager-todo-application', autoIndex: true}
mongoose.connect(URI, OPTION,(error) => {
    console.log('Connection successfully connected')
    console.log('Error', error);
})

// Routing Implement
app.use('/api/v1', router)

// Undefined Route Implement
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"Not Found"})
})

module.exports = app;