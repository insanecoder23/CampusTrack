const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.Signup = async (req, res) => {
    try {
        const { email, password,confirmPassword, firstname, lastname,  Branch, Year, RollNo ,accounttype} = req.body;

        if (!email || !password || !firstname || !confirmPassword || !lastname ||!Branch||!accounttype|| !Year) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required  a details",
            });
        }

        if (accounttype === "student" && !RollNo) {
            return res.status(400).json({
                success: false,
                message: "Roll number is required for students",
            });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let hashpassword;
        try {
            hashpassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }

        let user = await User.create({
            email,
            password: hashpassword,
            confirmPassword:password,
            firstname,
            lastname,
            accounttype,
            Branch,
            Year,
            RollNo,
        });

        user = user.toObject();
        delete user.password;

        return res.status(200).json({
            success: true,
            data: user,
            message: "Account created successfully",
        });

    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map((e) => e.message).join(", "),
            });
        }
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password, accounttype } = req.body;

        if (!email || !password || !accounttype) {
            return res.status(400).json({
                success: false,
                message: "Please fill all details correctly"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not registered, please register first"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password incorrect"
            });
        }

        if (user.accounttype !== accounttype) {
            return res.status(403).json({
                success: false,
                message: `This account is registered as a ${user.accounttype}, not a ${accounttype}. Please login from the correct section.`
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            accounttype: user.accounttype
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "2h"
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        const option = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        return res.cookie("token", token, option).status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userResponse
        });

    } catch (error) {
        console.log("LOGIN ERROR:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getalluser = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        return res.status(200).json({
            success: true,
            data: users,
            message: "Users retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};