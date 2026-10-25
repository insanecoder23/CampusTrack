const mongoose = require("mongoose");

const TeacherCodeSchema = new mongoose.Schema({
  teachercode: {
    type: String,
    required: true,
    unique: true,
  },
  headcount: {
    type: Number,
    required: true,
  },
  accounttype: {
    type: String,
  },
  name: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  used: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  
  },
});

module.exports = mongoose.model("TeacherCode", TeacherCodeSchema);