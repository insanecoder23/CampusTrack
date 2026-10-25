const mongoose = require("mongoose");

const StudentCodeSchema = new mongoose.Schema({
  studentcode: {
    type: String,
    required: true,
  },
  teachercode: {
    type: String,
    required: true,
  },
  accounttype: {
    type: String,
    default: "student",
  },
  teacher: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
},
  teacherName: {
    type: String,
  },
  studentName: {
    type: String,
  },
  used: {
    type: Boolean,
    default: false,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StudentCode", StudentCodeSchema);