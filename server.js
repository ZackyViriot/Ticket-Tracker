// allows access to .env variables  
require("dotenv").config();
//initilize express server 
const express = require("express");
const mongoose = require("mongoose");

// import routes 
const authRoute = require("./routes/auth")

const app = express();


//middle ware that allows us to pass json when doing request 
app.use(express.json());
app.use(express.urlencoded());



app.get("/api",(req,res) => {
    res.send("Ticket Tracker Express Server")
});


app.use("/api/auth", authRoute)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to database")

    app.listen(process.env.PORT,() => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});