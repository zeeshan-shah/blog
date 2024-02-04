// UpcomingBlogs.js
import React, { useEffect, useState } from "react";
import UpcomingBlogsTable from "./UpcomingBlogsTable";
import { axiosReq } from "../../api/axiosDefaults";

const UpcomingBlogs = () => {
  const [blogs, setBlogs] = useState();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosReq.get("/upcoming-blogs/");
        setBlogs(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching upcoming blogs", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Upcoming Blogs</h2>
      <UpcomingBlogsTable blogs={blogs}  setBlogs={setBlogs} /> {/* Pass currentUser to UpcomingBlogsTable */}
    </div>
  );
};

export default UpcomingBlogs;