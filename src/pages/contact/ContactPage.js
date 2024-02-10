import React, { useState } from "react";

import ContactForm from "./ContactForm";
import ContactTicketsPage from "./ContactTicketsPage";
import styles from "../../styles/Contact.module.css";
import { useRedirect } from "../../hooks/useRedirect";



const ContactPage = () => {
  useRedirect("loggedOut");

  const [rerenderTickets, setRerenderTickets] = useState(false);

  const handleRerenderTickets = () => {
    setRerenderTickets(!rerenderTickets);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Contact Us</h1>
      <ContactForm onFormSubmit={handleRerenderTickets} />
      <ContactTicketsPage rerenderTickets={rerenderTickets} />
    </div>
  );
};

export default ContactPage;
