const mongoose = require("mongoose");

const dbconnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("mongoose connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

module.exports = dbconnection;