const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword:{
    type:String,
    required:true,
  },
  accounttype: {
    type: String,
    enum: ["student", "teacher"],
    required: true
  },
  RollNo: {
    type: String,
    required: function () {
      return this.accounttype === "student";
    },
    trim: true
  },
  Branch: {
    type: String,
    enum: ["IT", "CS", "ECE", "EE", "CE", "MC", "AIML"],
  },
  Year: {
    type: String,
    required: true
  },
 
});

module.exports = mongoose.model("User", userschema);