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
            return res.status(400).json(errors);
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
// @route  PUT/api/ticket/:ticketId/complete
// @desc   Mark ticket as complete
// @access  Private

router.put("/:ticketId/complete",requiresAuth,async(req,res) => {
    try{
        const ticket = await Ticket.findOne({
            user: req.user._id,
            _id: req.params.ticketId,
        })

        if(!ticket){
            return res.status(404).json({error: 'Could not find ticket'})
        }
        if(ticket.complete){
            return res.status(400).json({error: "Ticket is already complete"})
        }

        const updatedTicket = await Ticket.findOneAndUpdate(
            {
                user: req.user._id,
                _id: req.params.ticketId,
            },
            {
                complete:true,
                completedAt: new Date(),
            },
            {
                new:true
            }
        );

        return res.json(updatedTicket)
    }catch(err){
        return res.status(500).send(err.message)
    }
})
// @route   PUT/api/ticket/:ticketId/incomplete
// @desc    Mark a Ticket as incomplete
// @access  Private
router.put("/:ticketId/incomplete",requiresAuth, async (req,res) => {
    try{
        const ticket = await Ticket.findOne({
            user:req.user._id,
            _id:req.params.ticketId,
        })
        if(!ticket){
            return res.status(404).json({error: "could not find Ticket"})
        }
        if(!ticket.complete){
            return res.status(400).json({error: "Ticket is alread complete"})
        }
        const updatedTicket = await Ticket.findOneAndUpdate(
            { 
                user: req.user._id,
                _id: req.params.ticketId,
            },
            {
                complete:false,
                completedAt:null,
            },
            {
                new: true
            }
        )
        return res.json(updatedTicket);
    }catch(err){
        console.log(err);

        return res.status(500).send(err.message)
    }
})

// @route     put /api/ticket/:ticketId
// @desc      Update the ticket
// @access    Private

router.put("/:ticketId",requiresAuth,async (req,res) => {
    try{
        const ticket = await Ticket.findOne({
            user: req.user._id,
            _id: req.params.ticketId   
        })

        if(!ticket){
            return res.status(404).json({error: "could not find ticket"})
        }

        const {isValid,errors} = validateTicketInput(req.body);


        if(!isValid){
            return res.status(400).json(errors)
        }

        const updatedTicket = await Ticket.findOneAndUpdate(
            {
                user:req.user._id,
                _id:req.params.ticketId,
            },
            {
                content: req.body.content
            },
            {
                new:true
            }
        )
        return res.json(updatedTicket)
    }catch(err){
        console.log(err);
        return res.status(500).send(err.message)
    }
})


// @route     Delete /api/ticket/:ticketId
// @desc      Delete the ticket 
// @access    Private


router.delete("/:ticketId",requiresAuth,async (req,res) => {
    try{    
        const ticket = await Ticket.findOne({
            user: req.user._id,
            _id: req.params.ticketId,
        });
        
        if(!ticket){
            return res.status(404).json({error: "Could not find ticket"})
        }
        await Ticket.findOneAndRemove({
            user: req.user._id,
            _id: req.params.ticketId
        })

        return res.json({success: true})
    }catch(err){
        console.log(err)

        return res.status(500).send(err.message)
    }
})
module.exports = router;