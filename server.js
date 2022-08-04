// allows access to .env variables  
require("dotenv").config();
//initilize express server 
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// import routes 
const authRoute = require("./routes/auth")
const ticketRoute = require("./routes/ticket")

const app = express();


//middle ware that allows us to pass json when doing request 
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());



app.get("/api",(req,res) => {
    res.send("Ticket Tracker Express Server")
});


app.use("/api/auth", authRoute)
app.use("/api/ticket",ticketRoute)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to database")

    app.listen(process.env.PORT,() => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});