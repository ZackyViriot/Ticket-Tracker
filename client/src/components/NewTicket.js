import axios from 'axios';
import React from 'react';
import { useGlobalContext } from '../context/GlobalContext';


const NewTicket = () => {
    const [content,setContent] = React.useState("");
    const {addTicket} = useGlobalContext();
    const onSubmit = e => {
        e.preventDefault();

        axios.post("/api/ticket/new", {content}).then(res => {
            setContent("");
            addTicket(res.data)
        })
    }

    return (
        <form className = "new" onSubmit = {onSubmit}>
            <input type = 'text' value = {content} onChange = {e => setContent(e.target.value)} />

            <button className = 'btn' type = 'submit' disable = {content.length == 0}>
                Add
            </button>
        </form>
    )
}

export default NewTicket