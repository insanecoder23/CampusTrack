
const Attendance =require("../models/Attendance")
// Add this in your controller file:
exports.GetStudentAttendance = async (req, res) => {
  try {
    const { rollNo, startDate, endDate } = req.query;

    let filter = {};

    // Filter by student roll number saved when VerifyStudentCode created the record
    if (rollNo) {
      filter.rollNo = rollNo;
    }

    // Filter for current month view
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }


    const records = await Attendance.find(filter);
    console.log(records); 

    return res.status(200).json({
      success: true,
      data: records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};