const UsersModel = require('../model/UsersModel');
const jwt = require('jsonwebtoken')
const OTPModel = require('../model/OTPModel')
const SendEmailUtility = require('../Utility/SendEmailUtility')

// Registration
exports.registration = (req, res) => {
    let reqBody = req.body;
    UsersModel.create(reqBody, (err, data) => {
        if (err) {
            res.status(200).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}

// Login
exports.login = (req, res) => {
    let reqBody = req.body;
    UsersModel.aggregate([
        { $match: reqBody },
        { $project: { _id: 0, email: 1, firstName: 1, lastName: 1, mobile: 1, photo: 1 } }
    ], (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            if (data.length > 0) {
                let payload = { exp: Math.floor(Date.now() / 1000) + (24 * 60 * 600), data: data[0]['email'] }
                let token = jwt.sign(payload, 'SecrectKey');
                res.status(200).json({ status: "Success", token: token, data: data[0] })
            }
            else {
                res.status(401).json({ status: 'Unauthorized' })
            }
        }
    })
}

exports.profileUpdate = (req, res) => {
    let email = req.headers['email'];
    let reqBody = req.body;
    UsersModel.updateOne({ email: email }, reqBody, (err, data) => {
        if (err) {
            res.status(400).json({ status: "fail", data: err })
        }
        else {
            res.status(200).json({ status: "success", data: data })
        }
    })

}

exports.profileDetails = (req, res) => {
    let email = req.headers['email'];
    
    UsersModel.aggregate([
        {$match: {email: email}},
        {$project:{_id: 1, email: 1, firstName: 1, lastName: 1, mobile: 1, photo: 1, password: 1}}
    ], (err, data) => {
        if(err){
            res.status(400).json({status: 'fail', data: err})
        }
        else {
            res.status(200).json({status: 'success', data: data})
        }
    })
}

exports.recoverVerifyEmail=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000)
    try {
        // Email Account Query
        let UserCount = (await UsersModel.aggregate([{$match: {email: email}}, {$count: "total"}]))
        if(UserCount.length>0){
            // OTP Insert
            let CreateOTP = await OTPModel.create({email: email, otp: OTPCode})
            // Email Send
            let SendEmail = await SendEmailUtility(email,"Your PIN Code is= "+OTPCode,"Task Manager PIN Verification")
            res.status(200).json({status: "success", data: SendEmail})
        }
        else{
            res.status(200).json({status: "fail", data: "No User Found"})
        }

    }catch (e) {
        res.status(200).json({status: "fail", data:e})
    }

}

exports.recoverVerifyOTP = async(req, res) => {
    let email = req.params.email;
    let OTPcode = req.params.otp;
    let status = 0;
    let statusUpdate = 1;

    try{
        let OTPcount = await OTPModel.aggregate([{$match: {email:email, otp:OTPcode, status: 0}}, {$count: 'total'}])
        if(OTPcount.length > 0){
            let OTPupdate = await OTPModel.updateOne({email:email, otp:OTPcode, status:status}, {
                email:email,
                otp:OTPcode,
                status: statusUpdate
            })
            res.status(200).json({status: 'success', data: OTPupdate})
        } else {
            res.status(200).json({status: 'fail', data: 'Invalid Code'})
        }
    }
    catch(e){
        res.status(200).json({status: 'fail', data: e})
    }
}

exports.recoverResetPass = async(req, res) => {
    let email = req.body['email'];
    let OTPcode = req.body['OTP'];
    let newPass = req.body['password'];
    let statusUpdate = 1;

    try{
        let OTPusedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPcode, status:statusUpdate}}, {$count: 'total'}])
        if(OTPusedCount.length > 0){
            let passUpdate = await UsersModel.updateOne({email:email}, {
                password: newPass
            })
            res.status(200).json({status: 'success', data: passUpdate})
        } else {
            res.status(200).json({status: 'fail', data: 'Invalid Request'})
        }
    }
    catch(e){
        res.status(200).json({status: 'fail', data: e})
    }
}