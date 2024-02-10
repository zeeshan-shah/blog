import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "../../styles/BlogCarousel.module.css";
import buttonStyles from "../../styles/Button.module.css";
import classNames from "classnames";


const BlogCarousel = ({ category, blogs }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set autoplay speed in milliseconds
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={`${styles.categoryHeading} text-center mb-4`} style={{ color: '#9B2915' }}>{category}</h2>
      <Slider {...settings}>
        {blogs.map((blog) => (
          <div key={blog.id}>
            <Card className={styles.customCard}>
              <Card.Img
                variant="top"
                src={blog.image}
                alt={blog.title}
                className={styles.cardImage}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body className={styles.customCardBody}>
                <Card.Title className={styles.cardTitle}>{blog.title}</Card.Title>
                <div className="d-flex justify-content-center align-items-center">
                  <Link to={`/blogs/${category}/${blog.id}`}>
                    <Button
                      className={classNames(buttonStyles.Button, buttonStyles.Blue)}
                      variant="primary"
                    >
                      Read More
                    </Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BlogCarousel;
