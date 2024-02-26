import React, { useState } from 'react';

import ContactForm from './ContactForm';
import ContactTicketsPage from './ContactTicketsPage';
import { useRedirect } from '../../hooks/useRedirect';

import styles from '../../styles/Contact.module.css';

const ContactPage = () => {
  useRedirect('loggedOut');

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
