const jwt = require("jsonwebtoken");
const User = require("../models/User");


const clean = (t) => (t && t !== "null" && t !== "undefined" ? t : null);

exports.isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

   
    const token = clean(headerToken) || clean(req.cookies?.token);

   
    console.log("AUTH DEBUG:", {
      hasHeader: !!clean(headerToken),
      hasCookie: !!clean(req.cookies?.token),
      secretSet: !!process.env.JWT_SECRET,
    });

    if (!token) {
      return res.status(401).json({
        success: false,
        reason: "NO_TOKEN",
        message: "Token missing, please login",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch (err) {
      console.log("JWT VERIFY ERROR:", err.name, "-", err.message);
      return res.status(401).json({
        success: false,
        reason: err.message, 

    
        message: "Invalid or expired token, please login again",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        reason: "USER_NOT_FOUND",
        message: "User not found, please login again",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH MIDDLEWARE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while authenticating",
    });
  }
};

exports.authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.accounttype)) {
    return res.status(403).json({
      success: false,
      message: `Access denied. This route is only accessible to: ${allowedRoles.join(", ")}`,
    });
  }
  next();
};

exports.isTeacher = exports.authorizeRoles("teacher");
exports.isStudent = exports.authorizeRoles("student");