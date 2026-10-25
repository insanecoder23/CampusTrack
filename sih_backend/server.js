
        const express=require("express");
        const dbconnection=require("./config/mongo");
        const routes=require("./routes/Createuser")
        const cors=require("cors")
        const app=express()
        const fileUpload=require("express-fileupload");
         const cookieParser = require("cookie-parser");

        require("dotenv").config();

        const PORT=process.env.PORT || 4000;
           app.use(express.json());
       
         app.use(cookieParser());

    
                app.use(cors({
                origin: "http://localhost:8080",
                credentials: true
        }));
                app.use(fileUpload({
                useTempFiles : true,
                tempFileDir : '/tmp/'
                }));

        app.use("/api/v1",routes)
        

        app.listen(`${PORT}`, () => {
                console.log(`server running at ${PORT}`);
              dbconnection(); 
        })

        
        app.get("/",(req,res)=>{
               
                console.log("you are in homepage")
                res.send(`<h1>welcom to website</h>`)
                
        })



