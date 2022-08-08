import React from "react";
import axios from 'axios'
import { useGlobalContext } from "../context/GlobalContext";

const TicketCard = ({ ticket }) => {
  const [content, setContent] = React.useState(ticket.content);
  const [editing, setEditing] = React.useState(false);
  const {ticketComplete,ticketIncomplete,removeTicket,updateTicket} = useGlobalContext();


  const input = React.useRef(null);

  const onEdit = (e) => {
    e.preventDefault();
    setEditing(true);
    input.current.focus();
  };
  const stopEditing = (e) => {
    if(e){
        e.preventDefault();

    }
    setEditing(false);
    setContent(ticket.content)
  }

  const markAsComplete = e => {
    e.preventDefault();

    axios.put(`/api/ticket/${ticket._id}/complete`).then(res => {
      ticketComplete(res.data);
    })

  }

  const markAsIncomplete = (e) => {
    e.preventDefault();
    axios.put(`/api/ticket/${ticket._id}/incomplete`).then(res => {
      ticketIncomplete(res.data);
    })
  }
  const deleteTicket = e => {
    e.preventDefault();


    if(window.confirm("Are you sure you want to delete this ticket")){
      axios.delete(`/api/ticket/${ticket._id}`).then(() => {
        removeTicket(ticket)
      })
    }
  }
  const editTicket = e => {
    e.preventDefault();
    axios.put(`/api/ticket/${ticket._id}`, {content}).then(res => {
      updateTicket(res.data);
      setEditing(false)
    }).catch(() => {
      stopEditing();
    })
  }


  
  return (
    <div className={`todo ${ticket.complete ? "todo--complete" : ""}`}>
      <input type="checkbox" checked={ticket.complete}  
      onChange={!ticket.complete ? markAsComplete : markAsIncomplete}
      />

      <input
        type="text"
        ref={input}
        value={content}
        readOnly={!editing}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="todo__controls">
        {!editing ? (
          <>
            {!ticket.complete && <button onClick={onEdit}>Edit</button>}
            <button onClick = {deleteTicket}>Delete</button>
          </>
        ) : (
          <>
            <button onClick = {stopEditing}>Cancel</button>
            <button onClick = {editTicket}>Save</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
