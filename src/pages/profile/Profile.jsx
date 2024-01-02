import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Link, useLocation, useParams,  } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import axios from "axios";
import Post from "../../components/post/Post";
// import FollowedUser from "../../components/followers/FollowedUser";


const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);

  // const username = useParams().username;
  const {id} = useParams();
  // const userId = parseInt(useLocation().pathname.split("/")[2]); // this is for sending url to server
  const userId = parseInt(id); // this is for sending url to server


  // USER PROFILE
  const { isLoading, error, data } = useQuery(["user"], () =>
    axios.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  );

  // MY OWN POSTs
  const {isLoading: postIsLoading, error: postError, data: postData } = useQuery(["posts"], () =>
    axios.get("/posts/myposts", { params: { userId } }).then((res) => res.data)
  );

  // GET users you followed 
//   const { isLoading: followedIsLoading, data: userYouFollowed } = useQuery(["relationship"], () =>
//   axios.get(`/relationships/followings/${userId}`).then((res) => {
//     console.log(res.data, "Followed by current logged user");
//     return res.data;
//   })
// );


  // GET your follower


// MY lIKES 
// const { data: likeData } = useQuery(["mylikes"], () =>
//   axios.get("/posts/mylikes?userId" + userId).then((res) => {
//     console.log(res.data, 'MY likes');
//     return res.data;
//   })
// );


  // DONT TOUCH the profile user is followed?
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationship"],
    () =>
      axios.get("/relationships?followedUserId=" + userId).then((res) => {
        return res.data;
      })
  );
  const queryClient = useQueryClient();
  const mutation = useMutation(
    (following) => {
      if (following)
        return axios.delete("/relationships?userId=" + userId);
      return axios.post("/relationships", { userId });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["relationship"]);
      },
    }
  );

  
  const [following, setFollowing] = useState(null);
  useEffect(() => {
    if (relationshipData) {
      setFollowing(relationshipData.includes(currentUser.id));
    }
  }, [relationshipData, currentUser.id]);

  const handleFollow = () => {
    if (rIsLoading) {
      return; // Do nothing while loading
    }
    const isFollowing = relationshipData ? relationshipData.includes(currentUser.id) : false;
    mutation.mutate(isFollowing);
  };


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            {/* <img src={"/upload/"+data.coverPic} alt="" className="cover" />
            <img src={"/upload/"+data.profilePic} alt="" className="profilePic" /> */}
            <img src='The https://plus.unsplash.com/premium_photo-1669790760074-45031389009e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="" className="cover" />
            <img src='https://images.unsplash.com/photo-1640310820557-248ea182a387?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="" className="profilePic" />
          </div>


          <div className="profileContainer">

            <div className="uInfo">

              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>

              <div className="center">
                {data ? (<span>{data.name}</span>) : (<p>none</p>)}
                
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    {data ? (<span>{data.city}</span>) : (<p>none</p>)}
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    {/* <span>{data.website}</span> */}
                    {data ? (<span>{data.website}</span>) : (<p>none</p>)}
                  </div>
                </div>


                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>

              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>

            <div>
              <div style={{display: 'flex', justifyContent:"space-evenly"}}>
                 <h2>Posts</h2>
                 <Link to={`/profile/${userId}/likes`} style={{ textDecoration: "none", color: 'inherit'}}><h2>Likes</h2></Link>
                 <Link to='' style={{ textDecoration: "none", color: 'inherit'}}><h2>Following</h2></Link>
                 <Link to='' style={{ textDecoration: "none", color: 'inherit'}}><h2>Follower</h2></Link>
              </div>
      
              <p>
                {postIsLoading && <p>Loading...</p>}
                {postError && <p>Error: {postError.message}</p>}
                {!postIsLoading && !postError && (
                  postData.length > 0 ? (
                    postData.map((post) => (
                      <div style={{marginTop: '10px'}}><Post post={post} key={post.id} /></div>
                    ))
                  ) : (
                    <p>No posts available</p>
                  )
                )}
              </p>
            </div>


            {/* <p>
              <p>My Likes</p>
              {likeData !== null && likeData !== undefined && likeData.map((likedPost) => (
                <Post key={likedPost.id} post={likedPost} />
              ))}
            </p> */}

              <div>
                <p>Following</p>
                {/* <ul>
                  {followedIsLoading ? (
                    <li>Loading...</li>
                  ) : userYouFollowed && userYouFollowed.length > 0 ? (
                    userYouFollowed.map((user) => (
                      <li key={user.name}>{user.name}</li>
                    ))
                  ) : (
                    <li>No followed users</li>
                  )}
                </ul> */}
              </div>


          </div>

        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;