const Query=require("../models/QuerSchema")
exports.createQuery = async (req, res) => {
   try {
      const { firstName, lastName, email, subject, message } = req.body;

      if (!firstName || !lastName || !email || !subject || !message) {
         return res.status(400).json({
            success: false,
            message: "Please fill in all required fields"
         });
      }

      const query = await Query.create({
         firstName,
         lastName,
         email,
         subject,
         message
      });

      res.status(201).json({
         success: true,
         data: query
      });
   } catch (error) {
      
      if (error.name === "ValidationError") {
         return res.status(400).json({
            success: false,
            message: Object.values(error.errors).map((e) => e.message).join(", ")
         });
      }
      res.status(500).json({
         success: false,
         message: "Server error, please try again later"
      });
   }
};


exports.getQueries = async (req, res) => {
   try {
      const queries = await Query.find().sort({ createdAt: -1 }); 

      res.status(200).json({
         success: true,
         count: queries.length,
         data: queries
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error, please try again later"
      });
   }
};


exports.getQueryByEmail = async (req, res) => {
    
   try {
      const { email } = req.body;

      if (!email) {
         return res.status(400).json({
            success: false,
            message: "Email is required"
         });
      }

      const queries = await Query.find({ email: email.toLowerCase() }).sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         count: queries.length,
         data: queries
      });
   } catch (error) {
      res.status(500).json({
         success: false,
         message: "Server error, please try again later"
      });
   }
};