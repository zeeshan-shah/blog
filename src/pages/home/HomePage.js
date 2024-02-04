import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import BlogCarousel from "./BlogCarousel";
import UpcomingBlogsTable from "../upcomingblogs/UpcomingBlogsTable";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import NoResults from "../../assets/no-results.png";
import Asset from "../../components/Asset";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import btnStyles from "../../styles/Button.module.css";

import { Link } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";


import appStyles from "../../App.module.css";

function HomePage({ filter = "" }) {
  const [featuredBlogs, setFeaturedBlogs] = useState({ results: [] });
  const [upcomingBlogs, setUpcomingBlogs] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch Featured Blogs
        const allCategories = ["science", "politics", "sports", "travel", "programming"];
        const categoryData = await Promise.all(
          allCategories.map(async (cat) => {
            const { data } = await axiosReq.get(`/blogs/${cat}/`);
            return data.results;
          })
        );

        // Combine results from all categories
        const combinedData = categoryData.reduce((acc, curr) => acc.concat(curr), []);
        setFeaturedBlogs({ results: combinedData });

        // Fetch Upcoming Blogs
        const upcomingData = await axiosReq.get("/upcoming-blogs/");
        setUpcomingBlogs({ results: upcomingData.data.results });

        setHasLoaded(true);
      } catch (err) {
        console.error(err);
      }
    };

    setHasLoaded(false);
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [filter]);

  return (
    <>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={12}>
          <BlogCarousel category="Featured Blogs" blogs={featuredBlogs.results} />
          <h2>Upcoming Blogs</h2>
          {hasLoaded ? (
            <UpcomingBlogsTable blogs={upcomingBlogs} setBlogs={setUpcomingBlogs} />
          ) : (
            <>
              <p>Loading blogs...</p>
              <Asset spinner />
            </>
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
                <Card>
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title>Create a New Blog</Card.Title>
                    <Card.Text>
                      Write and publish your latest blog post.
                    </Card.Text>
                    <Link to="/blogs/create">
                      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                        Create Blog
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Body className="d-flex flex-column align-items-center">
                    <Card.Title>Create an Upcoming Blog</Card.Title>
                    <Card.Text>
                      Share information about your upcoming blogs.
                    </Card.Text>
                    <Link to="/upcoming-blogs/create">
                      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
                        Create Upcoming Blog
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
          
        </Col>
      </Row>
    </>
  );
}

export default HomePage;
