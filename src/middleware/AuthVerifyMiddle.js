var jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    let Token = req.headers['token'];
    jwt.verify(Token, "SecrectKey", function (err, decoded) {
        if (err) {
            console.log('Token', Token)
            res.status(401).json({ status: "unauthorized" })
        }
        else {
            let email = decoded['data'];
            console.log(email)
            req.headers.email = email
            next();
        }
    })
}