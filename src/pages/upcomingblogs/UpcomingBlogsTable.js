import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import buttonStyles from "../../styles/Button.module.css";
import classNames from "classnames";
import moment from "moment"; // Import the moment library
import { axiosReq } from "../../api/axiosDefaults";

const UpcomingBlogsTable = ({ blogs, setBlogs }) => {
  const currentUser = useCurrentUser();
  const history = useHistory();

  if (!blogs || !blogs.results || !Array.isArray(blogs.results)) {
    return null;
  }

  const handleDelete = async (blogId) => {
    try {
      await axiosReq.delete(`/upcoming-blogs/${blogId}`);
      setBlogs((prevBlogs) => ({
        ...prevBlogs,
        results: prevBlogs.results.filter((blog) => blog.id !== blogId),
      }));
      history.push("/upcoming-blogs");
    } catch (err) {
      console.log(err);
    }
  };

  // Filter out blogs older than today
  const filteredBlogs = blogs.results.filter((blog) =>
    moment(blog.release_date).isSameOrAfter(moment(), "day")
  );

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Release Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredBlogs.map((blog) => (
          <tr key={blog.id}>
            <td>{blog.title}</td>
            <td>{blog.category}</td>
            <td>{blog.release_date}</td>
            <td>
              {currentUser?.username === blog.owner ? (
                <>
                  <Link to={`/upcoming-blogs/${blog.id}/edit`}>
                    <Button
                      className={classNames(buttonStyles.Button, buttonStyles.Blue)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    className={classNames(buttonStyles.Button, buttonStyles.Red)}
                    variant="danger"
                    onClick={() => handleDelete(blog.id)}
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

export default UpcomingBlogsTable;
