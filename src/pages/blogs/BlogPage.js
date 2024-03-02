import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import appStyles from '../../App.module.css';
import { axiosReq } from '../../api/axiosDefaults';
import Blog from './Blog';
import Comment from '../comments/Comment';
import CommentCreateForm from '../comments/CommentCreateForm';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import InfiniteScroll from 'react-infinite-scroll-component';
import Asset from '../../components/Asset';
import { fetchMoreData } from '../../utils/utils';
import PopularProfiles from '../profiles/PopularProfiles';

function BlogPage() {
  const { category, id } = useParams();
  const history = useHistory();

  const [blog, setBlog] = useState({ results: [] });
  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    let isMounted = true; // Flag to track whether the component is mounted

    const handleMount = async () => {
      try {
        const [{ data: blog }, { data: comments }] = await Promise.all([
          axiosReq.get(`/blogs/${category}/${id}`),
          axiosReq.get(`/comments/?blog=${id}`),
        ]);

        // Check if the component is still mounted before updating state
        if (isMounted) {
          setBlog({ results: [blog] });
          setComments(comments);
        }
      } catch (err) {
        // console.error(err);
        // Redirect to the home page if an error occurs (blog not found)
        history.push('/');
      }
    };

    handleMount();

    // Cleanup function to run when the component is unmounted
    return () => {
      isMounted = false; // Update the mounted flag to false when unmounting
    };
  }, [category, id, history]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <Blog {...blog.results[0]} setBlogs={setBlog} blogPage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              blog={id}
              setBlog={setBlog}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            'Comments'
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setBlog={setBlog}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default BlogPage;
