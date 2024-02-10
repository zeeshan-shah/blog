import React from "react";
import { useParams } from "react-router-dom";

import ContactEditForm from "./ContactEditForm";


const ContactTicketEditPage = () => {
  const { id } = useParams();

  return (
    <div>
      <h2>Edit Contact Ticket</h2>
      <ContactEditForm ticketId={id} />
    </div>
  );
};

export default ContactTicketEditPage;
