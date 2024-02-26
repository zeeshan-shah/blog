import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Link, useHistory } from 'react-router-dom';
import buttonStyles from '../../styles/Button.module.css';
import classNames from 'classnames';
import moment from 'moment';
import { axiosReq } from '../../api/axiosDefaults';

const UpcomingBlogsTable = ({ blogs, setBlogs }) => {
  const currentUser = useCurrentUser();
  const history = useHistory();

  if (!blogs || !blogs.results || !Array.isArray(blogs.results)) {
    return null;
  }

  const showActionColumn =
    currentUser &&
    blogs.results.some((blog) => currentUser.username === blog.owner);

  const handleDelete = async (blogId) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this Record?',
    );
    if (!confirmed) return;

    try {
      await axiosReq.delete(`/upcoming-blogs/${blogId}`);
      setBlogs((prevBlogs) => ({
        ...prevBlogs,
        results: prevBlogs.results.filter((blog) => blog.id !== blogId),
      }));
      history.push('/upcoming-blogs');
    } catch (err) {
      // Handle error
    }
  };

  const filteredBlogs = blogs.results.filter((blog) =>
    moment(blog.release_date).isSameOrAfter(moment(), 'day'),
  );

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th className="text-center">Title</th>
          <th className="text-center d-none d-sm-table-cell">Category</th>
          <th className="text-center">Release Date</th>
          {showActionColumn && <th className="text-center">Action</th>}
        </tr>
      </thead>
      <tbody>
        {filteredBlogs.map((blog) => (
          <tr key={blog.id}>
            <td className="text-center">{blog.title}</td>
            <td className="text-center d-none d-sm-table-cell">
              {blog.category}
            </td>
            <td className="text-center">
              {moment(blog.release_date).format('MMM DD, YYYY')}
            </td>
            {showActionColumn && currentUser.username === blog.owner && (
              <td className="text-center">
                <Link to={`/upcoming-blogs/${blog.id}/edit`}>
                  <Button
                    className={classNames(
                      buttonStyles.Button,
                      buttonStyles.Blue,
                    )}
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
