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

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  "https://campus-track-pied.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// Matches campus-track-<hash or branch>-insanecoder23s-projects.vercel.app
const vercelPreviewRegex =
  /^https:\/\/campus-track-[a-z0-9-]+-insanecoder23s-projects\.vercel\.app$/;

const corsOptions = {
  origin: function (origin, callback) {
    // allow tools like Postman/curl that send no Origin
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || vercelPreviewRegex.test(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // reject quietly instead of throwing a 500
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // handle preflight

app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to website</h1>");
});

app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
  dbconnection();
});