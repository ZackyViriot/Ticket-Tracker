import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import TicketCard from './TicketCard';
import NewTicket from './NewTicket';


const Dashboard = () => {
    const {user,completeTickets,incompleteTickets} = useGlobalContext();
    const navigate = useNavigate();


    React.useEffect(() => {
        if(!user && navigate){
            navigate("/")
        }
    }, [user,navigate])

    return (
      <div className = "dashboard">
        <NewTicket/>
        <div className = "todos">
            {incompleteTickets.map((ticket) => (
                <TicketCard ticket = {ticket} key = {ticket._id} />
            ))}
        </div>
        {completeTickets.length > 0 && (
            <div className = "todos">
                <h2 className = "todos__title">Complete Ticket's</h2>
                {completeTickets.map((ticket) =>(
                    <TicketCard ticket = {ticket} key = {ticket._id} />
                ))}
            </div>
        )}
      </div>
    );
};

export default Dashboard;