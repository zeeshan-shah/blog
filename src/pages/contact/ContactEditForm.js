import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useRedirect } from "../../hooks/useRedirect";


const CATEGORY_CHOICES = [
  { value: "1", label: "Blog Inquiry" },
  { value: "2", label: "Technical Support" },
  { value: "3", label: "Business Partnership" },
  { value: "4", label: "General Inquiry" },
];

function ContactEditForm() {
  const { id } = useParams();
  useRedirect("loggedOut");

  const [errors, setErrors] = useState({});
  const [contactData, setContactData] = useState({
    category: "",
    subject: "",
    message: "",
  });
  const { category, subject, message } = contactData;

  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosReq.get(`/tickets/${id}`);
        const { category, subject, message, is_owner } = data;

        is_owner
          ? setContactData({ category, subject, message })
          : history.push("/"); // Redirect if the user is not the owner
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Contact ticket not found, redirect to the home page
          history.push("/");
        } else {
          console.error("Error fetching contact ticket", error);
        }
      }
    };

    fetchData();
  }, [history, id]);

  const handleChange = (event) => {
    setContactData({
      ...contactData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("category", category);
    formData.append("subject", subject);
    formData.append("message", message);

    try {
      await axiosReq.put(`/tickets/${id}`, formData);
      history.push("/tickets"); // Redirect to the contact tickets page after editing
    } catch (err) {
      //console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option value="" disabled>Select a category</option>
          {CATEGORY_CHOICES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </Form.Control>
      </Form.Group>
      {errors?.category?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          name="subject"
          value={subject}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.subject?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          value={message}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.message?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        Update
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Container className={appStyles.Content}>{textFields}</Container>
      </Row>
    </Form>
  );
}

export default ContactEditForm;
