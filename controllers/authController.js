const userSchema = require("../models/userSchema");
const jwt = require("jsonwebtoken");


const registerController = async (req, res) => {
    try {
        const existingUser = await userSchema.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(401).send({
                success: false,
                message: 'Already registered please login !'
            });
        }
        const user = new userSchema(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: "Registration successfully !",
            user
        });

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in registeration Page !"
        })
    }
}


const loginController = async (req, res) => {
    try {
        const user = await userSchema.findOne({ email: req.body.email });
        const userPassword = await userSchema.findOne({ password: req.body.password });
        if (!user) {
            return res.send({
                success: false,
                message: "User not Found !"
            });
        }
        if (!userPassword) {
            return res.send({
                success: false,
                message: "Invalide password !"
            });
        }
        if (user.role !== req.body.role) {
            return res.send({
                success: false,
                message: "Role Does not matched !"
            });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        // localStorage.setItem("token",token);
        return res.send({
            success: true,
            message: "Login Successfully !",
            token, user
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in Login Page !"
        })
    }
};

// current-user
const currentController = async (req, res) => {
    try {
        const user = await userSchema.findOne({ _id: req.body.userId });
        return res.send({
            success: true,
            message: "Fetched successfully !",
            user
        });
    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: "Error in current Controller !"
        })
    }

}

module.exports = { loginController, registerController, currentController };