import React, { useEffect, useState } from "react";

import { axiosReq } from "../../api/axiosDefaults";
import ContactTicketsTable from "./ContactTicketsTable";


const ContactTicketsPage = ({ rerenderTickets }) => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axiosReq.get("/tickets/");
        setTickets(data.results);
      } catch (error) {
        console.error("Error fetching contact tickets:", error);
      }
    };

    fetchTickets();
  }, [rerenderTickets]);

  return (
    <div>
      <h2>Contact Tickets</h2>
      <ContactTicketsTable tickets={tickets} setTickets={setTickets} />
    </div>
  );
};

export default ContactTicketsPage;
