import React from "react";
import { Link, useHistory } from "react-router-dom";

import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import styles from "../../styles/Blog.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";


const Blog = (props) => {
  const {
    id,
    owner,
    profile_id,
    profile_image,
    comments_count,
    likes_count,
    like_id,
    title,
    content,
    category,
    image,
    updated_at,
    blogPage,
    setBlogs,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/blogs/${category}/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/blogs/${category}/${id}/`);
      history.goBack();
    } catch (err) {
      // //console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      const { data } = await axiosRes.post("/likes/", { blog: id });
      setBlogs((prevBlogs) => ({
        ...prevBlogs,
        results: prevBlogs.results.map((blog) => {
          return blog.id === id
            ? { ...blog, likes_count: blog.likes_count + 1, like_id: data.id }
            : blog;
        }),
      }));
    } catch (err) {
      //console.log(err);
    }
  };

  const handleUnlike = async () => {
    try {
      await axiosRes.delete(`/likes/${like_id}/`);
      setBlogs((prevBlogs) => ({
        ...prevBlogs,
        results: prevBlogs.results.map((blog) => {
          return blog.id === id
            ? { ...blog, likes_count: blog.likes_count - 1, like_id: null }
            : blog;
        }),
      }));
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <Card className={styles.Blog}>
      <Card.Body>
        <Media className="align-items-center justify-content-between">
          <Link to={`/profiles/${profile_id}`}>
            <Avatar src={profile_image} height={55} />
            {owner}
          </Link>
          <div className="d-flex align-items-center">
            <span>{updated_at}</span>
            {is_owner && blogPage && 
              <MoreDropdown 
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />}
          </div>
        </Media>
      </Card.Body>
      <Link to={`/blogs/${category}/${id}`}>
        <Card.Img src={image} alt={title} />
      </Link>
      <Card.Body>
        {title && <Card.Title className={styles.CardTitle}>{title}</Card.Title>}
        {/* Render paragraphs of content */}
        {content && content.split('\n').map((paragraph, index) => (
          <Card.Text key={index}>{paragraph}</Card.Text>
        ))}
        <div className={styles.BlogBar}>
          {is_owner ? (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>You can't bookmark your own blog!</Tooltip>}
            >
              <i className="far fa-bookmark" />
            </OverlayTrigger>
          ) : like_id ? (
            <span onClick={handleUnlike}>
              <i className={`fas fa-bookmark ${styles.Heart}`} />
            </span>
          ) : currentUser ? (
            <span onClick={handleLike}>
              <i className={`far fa-bookmark ${styles.HeartOutline}`} />
            </span>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Log in to bookmark blogs!</Tooltip>}
            >
              <i className="far fa-heart" />
            </OverlayTrigger>
          )}
          {likes_count}
          <Link to={`/blogs/${category}/${id}`}>
            <i className="far fa-comments" />
          </Link>
          {comments_count}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Blog;