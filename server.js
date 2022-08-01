// allows access to .env variables  
require("dotenv").config();
//initilize express server 
const express = require("express");


const app = express();


//middle ware that allows us to pass json when doing request 
app.use(express.json());
app.use(express.urlencoded());



app.get("/",(req,res) => {
    res.send("Ticket Tracker Express Server")
});

app.listen(process.env.PORT,() => {
    console.log(`Server running on port ${process.env.PORT}`);
});

app.post("/name",(req,res) => {
    if(req.body.name){
        return res.json({name:req.body.name})
    }else{
        return res.status(400).json({error: "No Name Provided"})
    }
});