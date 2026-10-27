const express = require("express");
const dbconnection = require("./config/mongo");
const routes = require("./routes/Createuser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "http://localhost:8080",
    
  ],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

app.get("/", (req, res) => {
  res.send("<h1>Welcome to website</h1>");
});

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
  dbconnection();
});