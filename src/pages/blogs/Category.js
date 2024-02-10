import styles from "../../styles/Category.module.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import NoResults from "../../assets/no-results.png";
import science from "../../assets/science.jpg";
import politics from "../../assets/politics.jpg";
import sports from "../../assets/sports.jpg";
import travel from "../../assets/travel.jpg";
import programming from "../../assets/programming.jpg";


function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/blogs/");
        setCategories(response.data.results);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container className={styles.categoryContainer}>
      <h2 className={styles.categoryHeading}>Categories</h2>
      <Row xs={1} md={3} className="d-flex justify-content-center">
        {categories.map((category) => (
          <Col key={category.category} className="mb-4">
            <Link to={`/blogs/${category.category}`}>
              <Card className={`${styles.categoryCard} ${styles.hoverEffect}`}>
                <Card.Img
                  variant="top"
                  src={getCategoryImage(category.category)}
                  alt={`Image for ${category.category} category`}
                  onError={(e) => {
                    // Fallback to a default image if the category image is not found
                    e.target.src = NoResults; // Replace 'NoResults' with the path to your default image
                  }}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column justify-content-center">
                  <Card.Title className={`${styles.categoryTitle} text-center`}>
                    {category.category.toUpperCase()}
                  </Card.Title>
                  {/* You can add more details or actions here if needed */}
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

// Helper function to get the correct image for each category
function getCategoryImage(category) {
  switch (category.toLowerCase()) {
    case "science":
      return science;
    case "politics":
      return politics;
    case "sports":
      return sports;
    case "travel":
      return travel;
    case "programming":
      return programming;
    default:
      return NoResults; // Default image if category is not recognized
  }
}

export default Category;
