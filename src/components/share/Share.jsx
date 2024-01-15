import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@mui/material";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    (newPost) => {
      return axios.post("/posts", newPost);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
        // queryClient.clear();

      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">

        <div className="top">

          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <div>
                <img className="file" alt="" src={URL.createObjectURL(file)} />
                <Button className="shareCancelImg" onClick={() => setFile(null)}>X</Button>
              </div>
              )}

          </div>

        </div>

        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;

// const Share = () => {
//   const [file, setFile] = useState(null);
//   const [desc, setDesc] = useState("");
//   const [posts, setPosts] = useState([]); // Manage posts locally
//   const { currentUser } = useContext(AuthContext);

//   const upload = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await axios.post("/upload", formData);
//       return res.data;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleClick = async (e) => {
//     e.preventDefault();
//     try {
//       let imgUrl = "";
//       if (file) {
//         imgUrl = await upload();
//       }
//       const newPost = { desc, img: imgUrl };

//       // Simulate adding the new post to the posts array
//       setPosts((prevPosts) => [newPost, ...prevPosts]);

//       // Simulate clearing form values
//       setDesc("");
//       setFile(null);

//       // Simulate sending the new post data to the server
//       await axios.post("/posts", newPost);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // ... rest of the component

// };

