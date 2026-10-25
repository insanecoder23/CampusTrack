const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    DateOfBirth: {
        type: Date
    },

    UserImage: {
        type: String
    },

    Rollno: {
        type: Number,
        required: true
    },

    BatchYear: {
        type: Number,
        default: () => new Date().getFullYear()
    },

    BatchMonth: {
        type: Number,
        default: () => new Date().getMonth() + 1
    }
});

module.exports = mongoose.model("Profile", profileSchema);