const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "Auth Failed",
                });
            }
            else {
                req.body.userId = decode.userId;
                next();
            }
        })
    } catch (error) {
        console.log(error)
        res.send({
            success: false,
            message: "Error in authMiddleware",
            error
        })
    }
}
module.exports = authMiddleware;