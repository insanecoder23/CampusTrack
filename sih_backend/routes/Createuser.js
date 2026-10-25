const express = require("express");
const router = express.Router();

const { Signup, Login, getalluser } = require("../controllers/Auth");
const { CreatTeacherCode } = require("../controllers/CreteTecahecode");
const {
  VerifyTeacherCode,
  VerifyStudentCode,
} = require("../controllers/CreateStudentcode");
const { isAuthenticated, isTeacher, isStudent } = require("../Middleware/Auth");
const {
  createQuery,
  getQueries,
  getQueryByEmail,
  deleteQuery,
} = require("../controllers/QuerySubmit");
const {
  GetStudentAttendance,
} = require("../controllers/getAttendanceByRollNoOrBranch");
const {
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../controllers/passwordController");

router.post("/Signup", Signup);
router.post("/Login", Login);
router.get("/user", getalluser);
router.post("/verifystudentcode", VerifyStudentCode);
router.post("/submitquery", createQuery);
router.get("/getallquery", getQueries);
router.get("/getquerybyemail", getQueryByEmail);
router.get("/getattendance", GetStudentAttendance);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/createteachercode", isAuthenticated, isTeacher, CreatTeacherCode);
router.post(
  "/verifyteachercode",
  isAuthenticated,
  isStudent,
  VerifyTeacherCode,
);

module.exports = router;
