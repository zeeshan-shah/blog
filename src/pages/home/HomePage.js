import React, { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import BlogCarousel from './BlogCarousel';
import UpcomingBlogsTable from '../upcomingblogs/UpcomingBlogsTable';
import Advertisements from '../../components/Advertisements'; // Import the Advertisements component
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import NoResults from '../../assets/no-results.png';
import Asset from '../../components/Asset';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import btnStyles from '../../styles/Button.module.css';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import appStyles from '../../styles/Homepage.module.css';

function HomePage() {
  const [featuredBlogs, setFeaturedBlogs] = useState({ results: [] });
  const [upcomingBlogs, setUpcomingBlogs] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        // Fetch Featured Blogs
        const allCategories = [
          'science',
          'politics',
          'sports',
          'travel',
          'programming',
        ];
        const categoryData = await Promise.all(
          allCategories.map(async (cat) => {
            const { data } = await axiosReq.get(`/blogs/${cat}/`);
            return data.results;
          }),
        );

        // Combine results from all categories
        const combinedData = categoryData.reduce(
          (acc, curr) => acc.concat(curr),
          [],
        );

        if (isMounted) {
          // Check if the component is still mounted
          setFeaturedBlogs({ results: combinedData });
        }

        // Fetch Upcoming Blogs
        const upcomingData = await axiosReq.get('/upcoming-blogs/');

        if (isMounted) {
          // Check if the component is still mounted
          setUpcomingBlogs({ results: upcomingData.data.results });
          setHasLoaded(true);
        }
      } catch (err) {
        // console.error(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 1000);

    return () => {
      isMounted = false; // Set the flag to indicate that the component is unmounted
      clearTimeout(timer); // Clear the timer when the component unmounts
    };
  }, []);

  return (
    <Row className={`${appStyles.Content} ${appStyles.HomePageRow}`}>
      <Col className={`py-2 p-0 p-lg-2 ${appStyles.HomePageCol}`} lg={12}>
        <BlogCarousel category="Featured Blogs" blogs={featuredBlogs.results} />
        <h2 className="mt-4 mb-4 text-center" style={{ color: '#CBA328' }}>
          Upcoming Blogs
        </h2>
        {hasLoaded ? (
          <UpcomingBlogsTable
            blogs={upcomingBlogs}
            setBlogs={setUpcomingBlogs}
          />
        ) : (
          <div className="mt-3">
            <p>Loading blogs...</p>
            <Asset spinner />
          </div>
        )}
        {hasLoaded && upcomingBlogs.results.length === 0 && (
          <Container className={appStyles.Content}>
            <Asset src={NoResults} message="No upcoming blogs found." />
          </Container>
        )}

        {/* Two Cards for creating blogs */}
        {currentUser && (
          <Row className="mt-4">
            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title>Create a New Blog</Card.Title>
                  <Card.Text>
                    Write and publish your latest blog post.
                  </Card.Text>
                  <Link to="/blogs/create">
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.Blue} mt-auto`}
                      type="submit"
                    >
                      Create Blog
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Title>Create an Upcoming Blog</Card.Title>
                  <Card.Text>
                    Share information about your upcoming blogs.
                  </Card.Text>
                  <Link to="/upcoming-blogs/create">
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.Blue} mt-auto`}
                      type="submit"
                    >
                      Create Upcoming Blog
                    </Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Col>
      {/* Render the advertisement column only on larger screens */}
      <Advertisements />
    </Row>
  );
}

export default HomePage;
