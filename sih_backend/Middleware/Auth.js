    const jwt = require("jsonwebtoken");
    const User = require("../models/User");

    exports.isAuthenticated = async (req, res, next) => {
    try {
      const token =
      req.cookies?.token ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing, please login",
      });
    }

        let decoded;
        try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token, please login again",
        });
        }

        const user = await User.findById(decoded.id);

        if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found, please login again",
        });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("AUTH MIDDLEWARE ERROR:", error.message);
        return res.status(500).json({
        success: false,
        message: "Something went wrong while authenticating",
        });
    }
    };

    exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.accounttype)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. This route is only accessible to: ${allowedRoles.join(", ")}`,
        });
        }
        next();
    };
    };

    exports.isTeacher = (req, res, next) => {
    if (!req.user || req.user.accounttype !== "teacher") {
        return res.status(403).json({
        success: false,
        message: "This route is only accessible to teachers",
        });
    }
    next();
    };

exports.isStudent = (req, res, next) => {
  console.log("Logged in user:", req.user?.email, "| accounttype:", req.user?.accounttype);
  if (!req.user || req.user.accounttype !== "student") {
    return res.status(403).json({
      success: false,
      message: "This route is only accessible to students",
    });
  }
  next();
};