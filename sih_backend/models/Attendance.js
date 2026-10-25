const mongoose = require("mongoose");

const Attendance = new mongoose.Schema({
   student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
   },
   studentFirstName: {
      type: String,
      required: true
   },
   studentLastName: {
      type: String,
      required: true
   },
   teacherFirstName: {
      type: String,
      required: true
   },
   teacherLastName: {
      type: String,
      required: true
   },
   rollNo: {
      type: String,
      trim: true
   },
   branch: {
      type: String
   },
   status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Absent"
   },
   createdAt: {
      type: Date,
      default: Date.now
   }
});

module.exports = mongoose.model("Attendance", Attendance);