const {Schema, model} = require('mongoose')

const TicketSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            required: true,
        },
        complete: {
            type: Boolean,
            default: false
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps:true
    }
);


//export the model 
const Ticket = model("Ticket",TicketSchema)
module.exports = Ticket;