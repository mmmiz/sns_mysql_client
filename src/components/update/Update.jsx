import { useState } from "react";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  // console.log(user);

  const upload = async (file) => {
    console.log(file)
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  // UPDATE USER INFO
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (user) => {
      return axios.put("/users", user);
      // (axios.put("/users", user)) and the backend (db.query(..., [req.body.email, req.body.password, ..., userInfo.id], ...)) should match.
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const coverUrl = cover ? await upload(cover) : user.coverPic;
      const profileUrl = profile ? await upload(profile) : user.profilePic;
  

      const updatedUser = {
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      };

      mutation.mutate(updatedUser);
      mutation.isSuccess && setCover(null);
      mutation.isSuccess && setProfile(null);

      setOpenUpdate(false);
    } catch (error) {
      console.error("Error updating:", error);
    }
  }

// // DELETE PIC 
//     const picMutation = useMutation(
//       async () => {
//         try {
//           const response = await axios.put(`/users?picToDelete=${user?.id}`);
//           console.log(response.data);
//           return response.data;
//         } catch (error) {
//           throw error.response.data;
//         }
//       },
//       {
//         onSuccess: () => {
//           queryClient.invalidateQueries(["user"]); 
//         },
//         onError: (error) => {
//           console.error("Error deleting picture:", error);
//         },
//       }
//     );
//     const picDeleteHandle = () => {
//       if (user?.id) {
//         picMutation.mutate();
//         setOpenUpdate(false);
//       } else {
//         console.error("User ID is undefined.");
//       }
//     };


  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">

            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : "/upload/" + user.coverPic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
              
            {/* <button onClick={picDeleteHandle}>delete</button> */}
            </label>

            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />

            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : "/upload/" + user.profilePic
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>

            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>

          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
