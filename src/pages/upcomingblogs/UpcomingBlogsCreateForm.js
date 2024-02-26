import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';

import { useHistory } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';
import { useRedirect } from '../../hooks/useRedirect';

const CATEGORY_CHOICES = [
  ['science', 'Science and Technology'],
  ['politics', 'Politics'],
  ['sports', 'Sports'],
  ['travel', 'Travel'],
  ['programming', 'Programming'],
];

function UpcomingBlogsCreateForm() {
  useRedirect('loggedOut');
  const [errors, setErrors] = useState({});

  const [blogData, setBlogData] = useState({
    title: '',
    category: '',
    release_date: '',
  });
  const { title, category, release_date } = blogData;

  const history = useHistory();

  const handleChange = (event) => {
    setBlogData({
      ...blogData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('title', title);
    formData.append('category', category);
    formData.append('release_date', release_date);

    try {
      await axiosReq.post('/upcoming-blogs/', formData);
      history.goBack();
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
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={category}
          onChange={handleChange}
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORY_CHOICES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {errors?.category?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Release Date</Form.Label>
        <Form.Control
          type="date"
          name="release_date"
          value={release_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.release_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Yellow}`}
        type="submit"
      >
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className="text-center">Add an upcoming blog</h2>
      <Row>
        {/* ... (other components) */}
        <Container className={appStyles.Content}>{textFields}</Container>
        {/* ... (other components) */}
      </Row>
    </Form>
  );
}

export default UpcomingBlogsCreateForm;
