import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import Blog from './Blog';
import Asset from '../../components/Asset';
import appStyles from '../../App.module.css';
import styles from '../../styles/BlogsPage.module.css';
import { useLocation } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';
import NoResults from '../../assets/no-results.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import PopularProfiles from '../profiles/PopularProfiles';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

function BlogsPage({ message, filter = '' }) {
  const [blogs, setBlogs] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();
  const { category } = useParams();
  const history = useHistory();
  const currentUser = useCurrentUser();

  const [query, setQuery] = useState('');

  useEffect(() => {
    let isMounted = true; // Flag to track mounted state

    const fetchBlogs = async () => {
      try {
        let url;
        if (category) {
          // If category is defined
          url = `/blogs/${category}/?${filter}search=${query}`;
        } else {
          // If category is not defined, fetch data from all categories with filter
          const allCategories = [
            'science',
            'politics',
            'sports',
            'travel',
            'programming',
          ];
          const categoryData = await Promise.all(
            allCategories.map(async (cat) => {
              const { data } = await axiosReq.get(
                `/blogs/${cat}/?${filter}search=${query}`,
              );
              return data.results;
            }),
          );

          // Combine results from all categories
          const combinedData = categoryData.reduce(
            (acc, curr) => acc.concat(curr),
            [],
          );
          if (isMounted) {
            // Check if component is still mounted before updating state
            setBlogs({ results: combinedData });
            setHasLoaded(true);
          }
          return; // Exit early
        }

        const { data } = await axiosReq.get(url);
        if (isMounted) {
          // Check if component is still mounted before updating state
          setBlogs(data);
          setHasLoaded(true);
        }
      } catch (err) {
        // Handle errors
        // console.error(err);
        history.push('/');
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 1000);

    // Cleanup function to cancel the timer and update the mounted flag
    return () => {
      clearTimeout(timer);
      isMounted = false; // Set the flag to indicate that the component is unmounted
    };
  }, [filter, query, pathname, category, history, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form
          className={styles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search blogs"
          />
        </Form>

        {hasLoaded ? (
          <>
            {blogs.results.length ? (
              <InfiniteScroll
                children={blogs.results.map((blog) => (
                  <Blog key={blog.id} {...blog} setBlogs={setBlogs} />
                ))}
                dataLength={blogs.results.length}
                loader={<Asset spinner />}
                hasMore={!!blogs.next}
                next={() => fetchMoreData(blogs, setBlogs)}
              />
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container>
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default BlogsPage;
