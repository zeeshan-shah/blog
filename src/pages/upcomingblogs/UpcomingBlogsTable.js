import React from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link, useHistory } from "react-router-dom";
import buttonStyles from "../../styles/Button.module.css";
import classNames from "classnames";
import moment from "moment";
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
      // Handle error
    }
  };

  const filteredBlogs = blogs.results.filter((blog) =>
    moment(blog.release_date).isSameOrAfter(moment(), "day")
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th className="d-none d-sm-table-cell">Category</th>
          <th>Release Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredBlogs.map((blog) => (
          <tr key={blog.id}>
            <td>{blog.title}</td>
            <td className="d-none d-sm-table-cell">{blog.category}</td>
            <td>{moment(blog.release_date).format("MMM DD, YYYY")}</td>
            {currentUser?.username === blog.owner && (
              <td>
                <Link to={`/upcoming-blogs/${blog.id}/edit`}>
                  <Button
                    className={classNames(buttonStyles.Button, buttonStyles.Blue)}
                    variant="primary"
                    size="sm"
                  >
                    Edit
                  </Button>
                </Link>
                <Button
                  className={classNames(buttonStyles.Button, buttonStyles.Red)}
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                >
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UpcomingBlogsTable;
