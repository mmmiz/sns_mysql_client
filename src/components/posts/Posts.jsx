import { useEffect } from "react";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data, refetch } = useQuery(["posts"], () =>
  axios.get("/posts?userId=" + userId)
    .then((res) => res.data)
    .catch((error) => {
      console.error("Error fetching posts:", error);
      throw error; // Rethrow the error to be caught by the query hook
    })
);

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    fetchData();
  }, [refetch]);

  
  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post, index) => (
            <div key={`${post.id}_${index}`}>
              <Post post={post} />
            </div>
          ))}
    </div>
  );
};

export default Posts;
