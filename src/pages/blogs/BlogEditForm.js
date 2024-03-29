import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';

import styles from '../../styles/BlogCreateEditForm.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';

const CATEGORY_CHOICES = [
  ['science', 'Science and Technology'],
  ['politics', 'Politics'],
  ['sports', 'Sports'],
  ['travel', 'Travel'],
  ['programming', 'Programming'],
];

function BlogEditForm() {
  const [errors, setErrors] = useState({});
  const { cat, id } = useParams();

  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    category: cat,
    image: '',
  });
  const { title, content, category, image } = blogData;

  const imageInput = useRef(null);
  const history = useHistory();
  const [selectedImage, setSelectedImage] = useState(''); // State to store the selected image for saving

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/blogs/${cat}/${id}/`);
        const { title, category, content, image, is_owner } = data;

        is_owner
          ? setBlogData({ title, category, content, image })
          : history.push('/');
      } catch (err) {
        //console.log(err);
      }
    };

    handleMount();
  }, [history, id, cat]);

  const handleChange = (event) => {
    setBlogData({
      ...blogData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      setSelectedImage(event.target.files[0]);
      setBlogData({
        ...blogData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    if (!title) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        title: ['Title is required.'],
      }));
      return; // Prevent API request if title field is empty
    }

    formData.append('title', title);
    formData.append('content', content);
    formData.append('category', category);

    if (!imageInput?.current?.files[0] && selectedImage) {
      formData.append('image', selectedImage);
    } else if (imageInput?.current?.files[0]) {
      formData.append('image', imageInput?.current?.files[0]);
    }

    try {
      await axiosReq.put(`/blogs/${category}/${id}/`, formData);
      history.push(`/blogs/${category}/${id}`);
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
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
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
        update
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <figure>
                <Image className={appStyles.Image} src={image} rounded />
              </figure>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Blue} btn`}
                  htmlFor="image-upload"
                >
                  Change the image
                </Form.Label>
              </div>

              <Form.File
                id="image-upload"
                accept="image/*"
                onChange={handleChangeImage}
                ref={imageInput}
              />
            </Form.Group>
            {errors?.image?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default BlogEditForm;
