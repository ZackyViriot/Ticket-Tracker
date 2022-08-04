const express = require("express")
const router = express.Router();
const Ticket = require("../models/Ticket")
const requiresAuth = require("../middleware/permissions")
const validateTicketInput = require("../validation/ticketValidation")


// @route       GET /api/ticket/test
// @Desc        test the ticket route works 
// @Access      public

router.get("/test",(req,res) => {
    res.send("Ticket route working");
});



// @route       POST /api/ticket/new
// @Desc        create a new ticket 
// @Access      private

router.post("/new",requiresAuth,async(req,res) => {
    try{
        const {isValid,errors} = validateTicketInput(req.body);
        

        if(!isValid){
            return res.status(400).json(errors)
        }
        //Create a new ticket 
        const newTicket = new Ticket({
            user:req.user._id,
            content: req.body.content,
            complete:false,

        })
        // save to data base 
        await newTicket.save();

        return res.json(newTicket)
    }catch(err){
        console.log(err)
        return res.status(500).send(err.message);
    }
});

// @route  GET/api/ticket/current
// @desc   Current users Tickets 
// @access  Private
router.get("/current", requiresAuth,async(req,res) => {
    try{
        const completeTicket = await Ticket.find({
            user: req.user._id,
            complete: true,
        }).sort({completedAt: -1});

        const incompleteTicket = await Ticket.find({
            user:req.user._id,
            complete:false,
        }).sort({completedAt: -1});

        return res.json({incomplete: incompleteTicket,complete:completeTicket})
    }catch(err){
        console.log(err)
        return res.status(500).send(err.message);
    }
})

module.exports = router;