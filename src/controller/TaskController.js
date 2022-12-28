const TaskModel = require("../model/TaskModel");

exports.createTask = (req, res) => {
    let reqBody = req.body;
    reqBody.email = req.headers['email']
    TaskModel.create(reqBody, (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}

exports.deleteTask = (req, res) => {
    let id = req.params.id;
    let query = { _id: id }
    TaskModel.deleteOne(query, (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}

exports.updateTask = (req, res) => {
    let id = req.params.id;
    let status = req.params.status;
    let query = { _id: id }
    let reqBody = { status: status };
    TaskModel.updateOne(query, reqBody, (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}

exports.listTaskByStatus = (req, res) => {
    let status = req.params.status;
    let email = req.headers['email']
    TaskModel.aggregate([
        { $match: { status: status, email: email } },
        {
            $project: {
                _id: 1, title: 1, description: 1, status: 1,
                createdDate: {
                    $dateToString: {
                        date: '$createdDate',
                        format: '%d-%m-%Y'
                    }
                }
            }
        }
    ], (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}

exports.taskStatusCount = (req, res) => {
    let email = req.headers['email']
    TaskModel.aggregate([
        {$match:{email:email}},
        {$group:{_id: "$status", sum:{$count: {}}}}
    ], (err, data) => {
        if (err) {
            res.status(400).json({ status: 'Failed', data: err })
        }
        else {
            res.status(200).json({ status: "Success", data: data })
        }
    })
}