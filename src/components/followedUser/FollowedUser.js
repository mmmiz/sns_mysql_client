// import React from 'react'
// import { useQuery } from "@tanstack/react-query";
// import axios from 'axios';

// export default function FollowedUser ({userId}) {
//   const { data: followers, error } = useQuery(['relationships', userId], () =>
//   axios.get(`/relationships?followedUserId=${userId}`).then((response) => response.data)
//   );
//   console.log(followers);
//   if (error) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <>
//       <div>Followers Component</div>
//       <p>Get followers here</p>
//       {followers ? (
//         <ul>
//           {followers.map((user, index) => (
//             <li key={index}>
//               <strong>User ID:</strong> {user.id}, <strong>Username:</strong> {user.username}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </>
//   )
// }


import React from 'react'

export default function FollowedUser() {
  return (
    <div>FollowedUser</div>
  )
}
