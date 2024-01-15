import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState } from "react";
import moment from "moment";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  
  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    axios.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  );

  // COMMENTS
  const { isLoading: commentsLoading, error: commentsError, data: commentsData } = useQuery(["comments", post.id], () =>
    axios.get("/comments?postId=" + post.id).then((res) => res.data)
  );
  
  const queryClient = useQueryClient();

  // LIKE
  const mutation = useMutation(
    (liked) => {
      if (liked) return axios.delete("/likes?postId=" + post.id);
      return axios.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  
  // DELETE
  const deleteMutation = useMutation(
    (postId) => {
      return axios.delete("/posts/" + postId);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLike = () => {  mutation.mutate(data ? data.includes(currentUser.id) : false); };
  const handleDelete = () => {  deleteMutation.mutate(post.id); };

  return (
    <div className="post">

      <div className="container">

        <div className="user">
          <div className="userInfo">
            <img src={"/upload/"+post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>

          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>


        <div className="content">
          <p>{post.desc}</p>
          <img src={"/upload/" + post.img} alt="" />
        </div>

        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data?.length} Likes
          </div>

          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsLoading ? "loading" : commentsData ? commentsData.length : 0} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && 
          <div key={post.id}>
            <Comments postId={post.id} />
          </div>
        }
      </div>

    </div>
  );
};

export default Post;
