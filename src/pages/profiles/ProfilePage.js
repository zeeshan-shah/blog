import React, { useEffect, useState } from 'react';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import Asset from '../../components/Asset';

import styles from '../../styles/ProfilePage.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';

import PopularProfiles from './PopularProfiles';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useParams } from 'react-router';
import { axiosReq } from '../../api/axiosDefaults';
import {
  useProfileData,
  useSetProfileData,
} from '../../contexts/ProfileDataContext';
import { Button, Image } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Blog from '../blogs/Blog';
import { fetchMoreData } from '../../utils/utils';
import NoResults from '../../assets/no-results.png';
import { ProfileEditDropdown } from '../../components/MoreDropdown';

function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profileBlogs, setProfileBlogs] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const { id } = useParams();

  const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
  const { pageProfile } = useProfileData();

  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setHasLoaded(false);
        const [{ data: pageProfile }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));

        // Fetch blogs from every category
        const allCategories = [
          'science',
          'politics',
          'sports',
          'travel',
          'programming',
        ];
        const blogsPromises = allCategories.map(async (cat) => {
          const { data } = await axiosReq.get(
            `/blogs/${cat}/?owner__profile=${id}`,
          );
          return data.results;
        });

        // Combine results from all categories
        const combinedBlogs = (await Promise.all(blogsPromises)).flat();

        setProfileBlogs({ results: combinedBlogs });
        setHasLoaded(true);
      } catch (err) {
        //console.log(err);
      }
    };
    fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image
            className={styles.ProfileImage}
            roundedCircle
            src={profile?.image}
          />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
              <div>{profile?.blogs_count}</div>
              <div>blogs</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.followers_count}</div>
              <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
              <div>{profile?.following_count}</div>
              <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
          {currentUser &&
            !is_owner &&
            (profile?.following_id ? (
              <Button
                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                onClick={() => handleUnfollow(profile)}
              >
                unfollow
              </Button>
            ) : (
              <Button
                className={`${btnStyles.Button} ${btnStyles.Black}`}
                onClick={() => handleFollow(profile)}
              >
                follow
              </Button>
            ))}
        </Col>
        {profile?.bio && <Col className="p-3">{profile.bio}</Col>}
      </Row>
    </>
  );

  const mainProfileBlogs = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s blogs</p>
      <hr />
      {profileBlogs.results.length > 0 ? ( // Check if there are results in profileBlogs
        <InfiniteScroll
          children={profileBlogs.results.map((blog) => (
            <Blog key={blog.id} {...blog} setBlogs={setProfileBlogs} />
          ))}
          dataLength={profileBlogs.results.length}
          loader={<Asset spinner />} // Display spinner while loading
          hasMore={!!profileBlogs.next}
          next={() => fetchMoreData(profileBlogs, setProfileBlogs)}
        />
      ) : (
        <Asset
          src={NoResults}
          message={`No results found, ${profile?.owner} hasn't blogged yet.`}
        />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfileBlogs}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;
