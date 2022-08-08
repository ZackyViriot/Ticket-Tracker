import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

// initial state
const initialState = {
  user: null,
  fetchingUser: true,
  completeTickets: [],
  incompleteTickets: [],
};

//reducer
const globalReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        fetchingUser: false,
      };
    case "SET_COMPLETE_TICKETS":
      return {
        ...state,
        completeTickets: action.payload,
      };
    case "SET_INCOMPLETE_TICKETS":
      return {
        ...state,
        incompleteTickets: action.payload,
      };
    case "RESET_USER":
      return {
        ...state,
        user: null,
        completeTickets: [],
        incompleteTickets: [],
        fetchingUser: false,
      };
    default:
      return state;
  }
};

//create the context

export const GlobalContext = createContext(initialState);

//provider component
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  useEffect(() => {
    getCurrentUser();
  }, []);
  // action: get current User
  const getCurrentUser = async () => {
    try {
      const res = await axios.get("/api/auth/current");
      if (res.data) {
        const ticketRes = await axios.get("/api/ticket/current");

        if (ticketRes.data) {
          dispatch({ type: "SET_USER", payload: res.data });
          dispatch({
            type: "SET_COMPLETE_TICKETS",
            payload: ticketRes.data.complete,
          });
          dispatch({
            type: "SET_INCOMPLETE_TICKETS",
            payload: ticketRes.data.incomplete,
          });
        }
      } else {
        dispatch({ type: "RESET_USER" });
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };

  const logout = async () => {
    try {
      await axios.put("/api/auth/logout");

      dispatch({ type: "RESET_USER" });
    } catch (err) {
      console.log(err);
      dispatch({ type: "RESET_USER" });
    }
  };
  const addTicket = (ticket) => {
    dispatch({
      type: "SET_INCOMPLETE_TICKETS",
      payload: [ticket, ...state.incompleteTickets],
    });
  };
  const ticketComplete = (ticket) => {
    dispatch({
      type: "SET_INCOMPLETE_TICKETS",
      payload: state.incompleteTickets.filter(
        (incompleteTicket) => incompleteTicket._id !== ticket._id
      ),
    });

    dispatch({
      type: "SET_COMPLETE_TICKETS",
      payload: [ticket, ...state.completeTickets],
    });
  };


  const ticketIncomplete = (ticket) => {
    dispatch({
        type: "SET_COMPLETE_TICKETS",
        payload: state.completeTickets.filter(
            (completeTicket) => completeTicket._id !== ticket._id
        ),
    });
    const newIncompleteTickets = [ticket,...state.incompleteTickets];
    dispatch({
        type: "SET_INCOMPLETE_TICKETS",
        payload: newIncompleteTickets.sort(
            (a,b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
    })
  };

  const removeTicket = (ticket) => {
    if(ticket.complete){
        dispatch({
            type: " SET_COMPLETE_TICKETS",
            payload: state.completeTickets.filter(
                (completeTicket) => completeTicket !== ticket._id
            )
        })
    }else {
        dispatch({
            type: " SET_INCOMPLETE_TICKETS",
            payload: state.incompleteTickets.filter(
                (incompleteTicket) => incompleteTicket !== ticket._id
            )
        })
    }
  };

  const updateTicket = (ticket) => {
    if(ticket.complete){
        const newCompleteTickets = state.completeTickets.map(
            (completeTicket) => completeTicket._id !== ticket._id ? completeTicket : ticket
        )

        dispatch({
            type: "SET_COMPLETE_TICKETS",
            payload: newCompleteTickets,
        })
    }else {
        const newIncompleteTickets = state.incompleteTickets.map(
            (incompleteTicket) => incompleteTicket._id !== ticket._id ? incompleteTicket : ticket
        )

        dispatch({
            type: "SET_INCOMPLETE_TICKETS",
            payload: newIncompleteTickets,
        })
    }
  }
  const value = {
    ...state,
    getCurrentUser,
    logout,
    addTicket,
    ticketComplete,
    ticketIncomplete,
    removeTicket,
    updateTicket,
  };
  return (
    <GlobalContext.Provider value={value}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}
