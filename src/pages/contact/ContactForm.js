import React, { useState, useEffect } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import { useRedirect } from '../../hooks/useRedirect';
import { useLocation } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';
import styles from '../../styles/Contact.module.css';

const CATEGORY_CHOICES = [
  { value: '1', label: 'Blog Inquiry' },
  { value: '2', label: 'Technical Support' },
  { value: '3', label: 'Business Partnership' },
  { value: '4', label: 'General Inquiry' },
  { value: '5', label: 'Advertise with Us' },
];

const ContactForm = ({ onFormSubmit }) => {
  useRedirect('loggedOut');

  const [errors, setErrors] = useState({});
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const defaultCategory = queryParams.get('category');

  const [formData, setFormData] = useState({
    category: defaultCategory || '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      category: defaultCategory || '',
    }));
  }, [defaultCategory]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});

    const { category, subject, message } = formData;

    if (!category || !subject || !message) {
      setErrors({
        category: !category ? ['Category is required.'] : '',
        subject: !subject ? ['Subject is required.'] : '',
        message: !message ? ['Message is required.'] : '',
      });
      return;
    }

    try {
      await axiosReq.post('/tickets/', formData);
      setSubmitted(true);
      onFormSubmit();
    } catch (error) {
      console.error('Error creating contact ticket:', error);
      setErrors(
        error.response?.data || { general: 'Failed to create contact ticket' },
      );
    }
  };

  const textFields = (
    <div className={styles.formContainer}>
      {submitted ? (
        <Alert variant="success">
          Thank you for your submission! We'll get back to you soon.
        </Alert>
      ) : (
        <>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select a category
              </option>
              {CATEGORY_CHOICES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Form.Control>
            {errors.category && (
              <Alert variant="warning">{errors.category}</Alert>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
            {errors.subject && (
              <Alert variant="warning">{errors.subject}</Alert>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />
            {errors.message && (
              <Alert variant="warning">{errors.message}</Alert>
            )}
          </Form.Group>
          <div className="text-center">
            <Button
              className={`${btnStyles.Button} ${btnStyles.Yellow}`}
              type="submit"
            >
              Submit
            </Button>
          </div>
          {errors.general && <Alert variant="danger">{errors.general}</Alert>}
        </>
      )}
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Container className={appStyles.Content}>
          <h2 className={styles.heading}>Get in Touch!</h2>
          {textFields}
        </Container>
      </Row>
    </Form>
  );
};

export default ContactForm;
