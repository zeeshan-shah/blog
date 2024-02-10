import React from "react";
import { Link } from "react-router-dom";

import styles from "../../styles/NotFoundPage.module.css"; // Update the import path


const NotFoundPage = () => {
  return (
    <div className={styles.notFoundContainer}> {/* Update the class name */}
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for might be under construction or does not exist.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default NotFoundPage;
