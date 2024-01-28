import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Blog from "./Blog";

function BlogPage() {
  const { category, id} = useParams();
  
  const [blog, setBlog] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: blog }] = await Promise.all([
          axiosReq.get(`/blogs/${category}/${id}`),
        ]);
        setBlog({ results: [blog] });
        console.log(blog);
        console.log("Category:", category);
        console.log("ID:", id);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [category, id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <p>Popular profiles for mobile</p>
        <Blog {...blog.results[0]} setBlogs={setBlog} blogPage />
        <Container className={appStyles.Content}>Comments</Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        Popular profiles for desktop
      </Col>
    </Row>
  );
}

export default BlogPage;