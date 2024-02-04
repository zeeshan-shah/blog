// useRedirect.js
import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

export const useRedirect = (userAuthStatus, callback) => {
  const history = useHistory();

  useEffect(() => {
    const handleMount = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // if user is logged in, the code below will run
        if (userAuthStatus === "loggedIn") {
          callback(true);  // Callback to update the loggedIn state
        }
      } catch (err) {
        // if user is not logged in, the code below will run
        if (userAuthStatus === "loggedOut") {
          callback(false);  // Callback to update the loggedIn state
          history.push("/");
        }
      }
    };

    handleMount();
  }, [history, userAuthStatus, callback]);
};
