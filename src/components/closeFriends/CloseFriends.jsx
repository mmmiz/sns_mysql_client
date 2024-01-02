import React, { useContext, useState } from 'react';
import { Button } from '@mui/material';
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { AuthContext } from '../../context/authContext';
import axios from 'axios';

export default function CloseFriends({ friend }) {
  // const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);

  const [userIdToFollow, setUserIdToFollow] = useState(friend.id);
  const [message, setMessage] = useState('');

  

  const handleFollow = async () => {
    try {
      const response = await axios.post('/relationships', 
      { userId: userIdToFollow }, 
      { withCredentials: true } // works fine without it 
      );
      if (response.status === 200) {
        console.log(response.data);
        setUserIdToFollow(response.data);
        setMessage(`Successfully followed user: ${response.data}`);
      } else {
        setMessage(`Error following user: ${response.data}`);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <img
          src={"/upload/"}
          alt=""
          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <p style={{ marginRight: '10px' }}>{friend.username}</p>

        <button onClick={handleFollow}>Follow User</button>
         <p>{message}</p>
      </div>
    </>
  );
}
