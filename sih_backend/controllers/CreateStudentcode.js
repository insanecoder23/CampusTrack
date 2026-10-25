const StudentCode = require("../models/Studentcode");
const TeacherCode = require("../models/Teachercode");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

const generateCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

exports.VerifyTeacherCode = async (req, res) => {
  try {
    const { teacherCode } = req.body;
    const studentId = req.user._id;

    if (!teacherCode || teacherCode.length !== 6) {
      return res.status(400).json({
        success: false,
        message: "Please provide teachercode",
      });
    }

    const found = await TeacherCode.findOne({
      teachercode: teacherCode,
      accounttype: "teacher",
    }).populate("name", "firstname lastname email");

    if (!found) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired teacher code",
      });
    }

    if (found.expiresAt && found.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "This teacher code has expired",
      });
    }

    const studentcode = generateCode();

    const createdStudentCode = await StudentCode.create({
      studentcode,
      teachercode: found.teachercode,
      accounttype: "student",
      teacher: found.name._id,              
      teacherName: found.name
        ? `${found.name.firstname} ${found.name.lastname}`
        : "",
      studentName: `${req.user.firstname} ${req.user.lastname}`,
      student: studentId,
    });

    return res.status(200).json({
      success: true,
      message: "Teacher code verified, student code generated",
      data: {
        studentcode: createdStudentCode.studentcode,
        teachercode: found.teachercode,
        teacherName: createdStudentCode.teacherName,
        studentName: createdStudentCode.studentName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.VerifyStudentCode = async (req, res) => {
  try {
    const { studentcode } = req.body;
   

    if (!studentcode) {
      return res.status(400).json({
        success: false,
        message: "Please provide your personal code",
      });
    }

    const normalizedCode = studentcode.trim().toUpperCase();

    const found = await StudentCode.findOne({ studentcode: normalizedCode });
    console.log(found);

    if (!found) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired code",
      });
    }

    if (found.used) {
      return res.status(409).json({
        success: false,
        message: "This code has already been used",
      });
    }

    const student = await User.findById(found.student);
    console.log(student)
    if (!student || student.accounttype !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can mark attendance",
      });
    }

    const teacher = await User.findById(found.teacher);

    if (!teacher || teacher.accounttype !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Associated teacher not found",
      });
    }

    found.used = true;
    await found.save();

    const attendance = await Attendance.create({
      student: student._id,
      teacher: teacher._id,
      studentFirstName: student.firstname,
      studentLastName: student.lastname,
      teacherFirstName: teacher.firstname,
      teacherLastName: teacher.lastname,
      rollNo: student.RollNo,
      branch: student.Branch,
      status: "Present",
    });

    return res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      data: {
        attendanceId: attendance._id,
        rollNo: attendance.rollNo,
        branch: attendance.branch,
        studentName: `${attendance.studentFirstName} ${attendance.studentLastName}`,
        teacherName: `${attendance.teacherFirstName} ${attendance.teacherLastName}`,
        status: attendance.status,
        createdAt: attendance.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};