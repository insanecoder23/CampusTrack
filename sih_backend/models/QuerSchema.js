const mongoose = require("mongoose");

const QuerySchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
         trim: true
      },
      lastName: {
         type: String,
         required: true,
         trim: true
      },
      email: {
         type: String,
         required: true,
         trim: true,
         lowercase: true,
         match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
      },
      subject: {
         type: String,
         required: true,
         trim: true
      },
      message: {
         type: String,
         required: true,
         trim: true
      }
   },
   { timestamps: true } 
);

module.exports = mongoose.model("Query", QuerySchema);