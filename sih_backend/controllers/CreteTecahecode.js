const TeacherCode = require("../models/Teachercode");

const generateCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};

const CODE_VALIDITY_MS = 30 * 1000; 

exports.CreatTeacherCode = async (req, res) => {
  try {
    const { headcount } = req.body;
    const teacher = req.user;

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!headcount) {
      return res.status(400).json({
        success: false,
        message: "Please provide headcount",
      });
    }

    await TeacherCode.deleteMany({ name: teacher._id });

   
    let teachercode;
    let duplicate;
    do {
      teachercode = generateCode();
      duplicate = await TeacherCode.findOne({ teachercode });
    } while (duplicate);

    const createcode = await TeacherCode.create({
      teachercode,
      headcount,
      accounttype: "teacher",
      name: teacher._id,
      used: false,
      expiresAt: new Date(Date.now() + CODE_VALIDITY_MS),
    });

    const populatedCode = await createcode.populate("name", "firstname lastname email");

    return res.status(200).json({
      success: true,
      message: "Teacher code generated successfully",
      data: populatedCode,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate teacher code, please try again",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};