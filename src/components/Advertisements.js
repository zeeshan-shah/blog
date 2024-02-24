import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import btnStyles from "../styles/Button.module.css";
import NoResults from "../assets/no-results.png";
import styles from "../styles/advertisement.module.css";

const Advertisements = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axiosReq.get("/advertisements/");
        setAds(data.results);
      } catch (error) {
        console.error("Error fetching advertisements", error);
      }
    };

    fetchAds();
  }, []);

  return (
    <div className={styles.advertisementContainer}>
      {Array.isArray(ads) && ads.map((ad) => (
        <Card key={ad.id} className={styles.advertisementCard}>
          <Card.Body className="d-flex flex-column align-items-center">
            <Card.Title>{ad.title}</Card.Title>
            <Card.Img
              variant="top"
              src={ad.image}
              alt={`Image for ${ad.image} ad`}
              onError={(e) => {
                e.target.src = NoResults; // Replace 'NoResults' with the path to your default image
              }}
              className={styles.advertisementImage}
            />
            <Card.Text>{ad.content}</Card.Text>
            {/* Sanitize and validate the URL */}
            {isValidUrl(ad.target_url) && (
              <a href={ad.target_url} target="_blank" rel="noopener noreferrer">
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Blue} mt-auto`}
                  type="submit"
                >
                  Open Ad
                </Button>
              </a>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

// Function to validate URL
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

export default Advertisements;
