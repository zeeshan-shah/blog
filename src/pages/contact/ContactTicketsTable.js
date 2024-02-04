import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import buttonStyles from "../../styles/Button.module.css";
import classNames from "classnames";
import { axiosReq } from "../../api/axiosDefaults";
import styles from "../../styles/Contact.module.css";
import Asset from "../../components/Asset";

const ContactTicketsTable = ({ tickets, setTickets }) => {
    const currentUser = useCurrentUser();
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    const categoryMapping = {
        '1': 'Blog Inquiry',
        '2': 'Technical Support',
        '3': 'Business Partnership',
        '4': 'General Inquiry',
    };

    const handleDelete = async (ticketId) => {
        try {
            await axiosReq.delete(`/tickets/${ticketId}`);
            setTickets((prevTickets) =>
                prevTickets.filter((ticket) => ticket.id !== ticketId)
            );
            history.push("/tickets");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []); // Only fetch data on component mount

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p className={styles.alert}>Tickets are loading...</p>
                <Asset spinner />
            </div>
        );
    }

    if (tickets.length === 0) {
        return <p className={styles.alert}>No tickets generated yet.</p>;
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Admin Response</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket) => (
                    <tr key={ticket.id}>
                        <td>{categoryMapping[ticket.category]}</td>
                        <td>{ticket.subject}</td>
                        <td>{ticket.message}</td>
                        <td>{ticket.ticket_status}</td>
                        <td>{ticket.admin_response}</td>
                        <td>
                            {currentUser?.username === ticket.owner ? (
                                <>
                                    <Link to={`/tickets/${ticket.id}/edit`}>
                                        <Button
                                            className={classNames(
                                                buttonStyles.Button,
                                                buttonStyles.Blue
                                            )}
                                            variant="primary"
                                        >
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        className={classNames(
                                            buttonStyles.Button,
                                            buttonStyles.Red
                                        )}
                                        variant="danger"
                                        onClick={() => handleDelete(ticket.id)}
                                    >
                                        Delete
                                    </Button>
                                </>
                            ) : null}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ContactTicketsTable;
