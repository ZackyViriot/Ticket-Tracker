const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const validatorRegisterInput = require('../validation/registerValidation')

// @route       GET /api/auth/test
// @desc        Test the auth route
// @access      Public
router.get("/test",(req,res) => {
    res.send("Auth route working")
})
// @route       POST /api/auth/register
// @desc        Create a new user
// @access      Public
router.post("/register", async (req,res) => {
    try {
        const {errors, isValid} = validatorRegisterInput(req.body);
        if(!isValid){
            return res.status(400).json(errors);
        }
        // check for existing user 
        const existingEmail = await User.findOne({
            email: new RegExp("^" + req.body.email + "$" , "i")
        });

        if(existingEmail){
            return res
            .status(400)
            .json({error: 'There is already a user with this email'})
        }
        //Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password,12);
        //Create a New User 
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
        })
        // save the user to the database 
        const savedUser = await newUser.save();

        // return the new User
        return res.json(savedUser);

    }catch(err){
        //error here
        console.log(err);
        res.status(500).send(err.message)
    }
})


module.exports = router;