import React, { useEffect, useState } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import btnStyles from '../styles/Button.module.css';
import NoResults from '../assets/no-results.png';
import styles from '../styles/Advertisement.module.css';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const Advertisements = () => {
  const [ads, setAds] = useState([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    let isMounted = true;

    const fetchAds = async () => {
      try {
        const { data } = await axiosReq.get('/advertisements/');
        if (isMounted) {
          setAds(data.results);
        }
      } catch (error) {
        console.error('Error fetching advertisements', error);
      }
    };

    fetchAds();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className={styles.advertisementContainer}>
      {Array.isArray(ads) &&
        ads.map((ad) => (
          <Card key={ad.id} className={styles.advertisementCard}>
            <Card.Body className="d-flex flex-column align-items-center">
              <Card.Title>{ad.title}</Card.Title>
              <Card.Img
                variant="top"
                src={ad.image}
                alt={`Image for ${ad.image} ad`}
                onError={(e) => {
                  e.target.src = NoResults;
                }}
                className={styles.advertisementImage}
              />
              <Card.Text>{ad.content}</Card.Text>
              <Link
                key={ad.id}
                to={{
                  pathname: currentUser ? '/tickets/' : '/signin',
                  search: '?category=5',
                  state: { from: '/tickets/', search: '?category=5' }, // Pass the redirect URL as state
                }}
              >
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Blue} mt-auto`}
                  type="submit"
                >
                  Contact Us
                </Button>
              </Link>
            </Card.Body>
          </Card>
        ))}
    </div>
  );
};

export default Advertisements;
