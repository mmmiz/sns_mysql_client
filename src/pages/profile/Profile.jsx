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

import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import axios from "axios";
import Post from "../../components/post/Post";
import Likes from "../../components/likes/Likes";
import { Button } from "@mui/material";
import FollowedUser from "../../components/followedUser/FollowedUser";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openFollowings, setOpenFollowings] = useState(false);
  // const [openFollowers, setOpenFollowers] = useState(false);
  
  const { currentUser } = useContext(AuthContext);
  // console.log(currentUser.username);

  // const username = useParams().username;
  const {id} = useParams();
  // const userId = parseInt(useLocation().pathname.split("/")[2]); // this is for sending url to server
  const userId = parseInt(id); // this is for sending url to server


  // USER PROFILE
  const { isLoading, error, data, refetch: refetchUser } = useQuery(["user"], () =>
    axios.get("/users/find/" + userId).then((res) => {
      // console.log(res.data);
      return res.data;
    })
  );


  // MY OWN POSTs
  const {isLoading: postIsLoading, error: postError, data: postData, refetch: refetchPosts } = useQuery(["posts"], () =>
    axios.get("/posts/myposts", { params: { userId } })
    .then((res) => {
      const data = res.data;
      // console.log('MY POSTS DATA:', data);
      return data;
    })
  ); //   { params: { userId: id } }


  useEffect(() => {
    const refetch = async() => {
      await refetchUser();
      await refetchPosts();
    }
    refetch();
  }, [userId, refetchUser, refetchPosts]);



  // MY lIKES params version 
//   const { data: likedPosts } = useQuery(["mylikes"], () =>
//   axios.get(`/likes/mylikes/${userId}`)
//   .then((res) => {
//     const data = res.data;
//     console.log('LIKED POSTS DATA:', data);
//     return data; })
//   .catch((error) => {
//     console.error("Error fetching likes:", error);
//     throw error;
//   })
// );
  const { data: likedPosts } = useQuery(["mylikes"], () =>
  axios.get(`/likes/mylikes?likedUserId=${userId}`)
  .then((res) => {
    const data = res.data;
    // console.log('LIKED POSTS DATA:', data);
    return data; })
  .catch((error) => {
    // console.error("Error fetching likes:", error);
    throw error;
  })
);


// GET users you followed 
  const {  data: userYouFollowed } = useQuery(["relationship"], () =>
  axios.get(`/relationships/followings?profileUserId=${userId}`).then((res) => {
    // console.log(res.data, "Followed by current logged user");
    return res.data;
  })
);

  // GET your followers
  const { data: yourFollowers } = useQuery(["followers"], () =>
  axios.get(`/relationships/followers?userFollowingId=${userId}`).then((res) => {
    // console.log(res.data, "aaa");
    return res.data;
  }).catch((error) => {
    console.log('error:', error);
  })
);


  // DONT TOUCH the profile user is followed?
  const { isLoading: rIsLoading, data: relationshipData } = useQuery(
    ["relationships"],
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
        queryClient.invalidateQueries(["relationships"]);
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


  // useEffect(() => {
  //   if (userId === currentUser.id) {
  //     setOpenUpdate(true);
  //   } 
  // }, [userId, currentUser.id]);


  return (
    <div className="profile">
      {isLoading ? (
        "loading"
      ) : (
        <>
          <div className="images">
            <img src={"/upload/"+data?.coverPic} alt="" className="cover" />
            <img src={"/upload/"+data?.profilePic} alt="" className="profilePic" /> 
            {/* <img src='The https://plus.unsplash.com/premium_photo-1669790760074-45031389009e?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="" className="cover" />
            <img src='https://images.unsplash.com/photo-1640310820557-248ea182a387?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="" className="profilePic" /> */}
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
                {data ? (<span>{data?.username}</span>) : (<p>none</p>)}
                
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    {data ? (<span>{data?.city}</span>) : (<p>none</p>)}
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    {/* <span>{data.website}</span> */}
                    {data ? (<span>{data?.website}</span>) : (<p>none</p>)}
                  </div>
                </div>


                {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  // <button onClick={handleUpdateButtonClick}>update</button>
                  <button onClick={() => setOpenUpdate(!openUpdate)}>update</button> 
                  // ^^ this can be used without const dont use(true);
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
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}

            <div>
              <div style={{display: 'flex', justifyContent:"space-evenly"}}>
                <h2>Posts</h2>
                {/* <Link to={`./likes`} style={{ textDecoration: "none", color: 'inherit'}}><p>Likes</p></Link> */}
                {/* <Link to={`./followings`} style={{ textDecoration: "none", color: 'inherit'}}><p>Follow</p></Link> */}
                {/* <Link to={`./followers`} style={{ textDecoration: "none", color: 'inherit'}}><p>Follower</p></Link> */}
                {/* <Button onClick={() => setOpenFollowings(!openFollowings)}>Followings</Button> */}
              </div>

                {/* {openFollowings && userYouFollowed.map((fol) => (
                  <div key={fol.id}> 
                    <FollowedUser FollowedUser={fol} />
                  </div>
                ))}

                <h3>Followers</h3>
                {yourFollowers && yourFollowers.map((followers) => (
                  <div key={followers.id}> 
                   <p>{followers.name}</p>
                  </div>
                ))} */}

                  {!postIsLoading && !postError && (
                    postData.length > 0 ? (
                      postData.map((post) => ( 
                        <div key={post.id} style={{marginBottom: '5px'}} > 
                         <Post post={post} />
                        </div>
                      ))
                    ) : (
                      <div>
                        <p>No posts available</p>
                      </div>
                    )
                  )} 
            </div>

            {/* <div>
              <h2>Liked Posts</h2>
              {likedPosts && likedPosts.length > 0 ? (
                likedPosts
                .filter((post) => post !== null) // Filter out null values
                .map((post) => (
                  <Post post={post} />
                  ))
              ) : (
                <p>No liked posts available</p>
              )}
            </div> */}

          </div>

        </>
      )}
    </div>
  );
};

export default Profile;