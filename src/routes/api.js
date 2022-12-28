const express = require('express')
const UserController = require('../controller/UserController')
const TaskController = require('../controller/TaskController')
const AuthVerifyMiddle = require('../middleware/AuthVerifyMiddle')
const router = express.Router()

// User
router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/profileUpdate', AuthVerifyMiddle, UserController.profileUpdate)
router.get('/profileDetails', AuthVerifyMiddle, UserController.profileDetails)
router.get('/recoverVerifyEmail/:email', UserController.recoverVerifyEmail)
router.get('/recoverVerifyOTP/:email/:otp', UserController.recoverVerifyOTP)
router.post('/recoverResetPass', UserController.recoverResetPass)

// Task
router.post('/createTask', AuthVerifyMiddle, TaskController.createTask);
router.get('/deleteTask/:id', AuthVerifyMiddle, TaskController.deleteTask)
router.get('/updateTask/:id/:status', AuthVerifyMiddle, TaskController.updateTask)
router.get('/listTaskByStatus/:status', AuthVerifyMiddle, TaskController.listTaskByStatus)
router.get('/taskStatusCount', AuthVerifyMiddle, TaskController.taskStatusCount)

module.exports = router;