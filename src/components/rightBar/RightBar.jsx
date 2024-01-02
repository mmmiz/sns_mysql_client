import { useMutation, useQuery } from "@tanstack/react-query";
import "./rightBar.scss";
import axios from "axios";

const RightBar = () => {
  const { isLoading, error, data, queryClient } = useQuery(['users'], async () => {
    const res = await axios.get('/users/allusers');
    return res.data;
  })

  const followUserMutation = useMutation(
    (userId) => axios.post('/relationships', { userId }),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['relationships']);
      },
    }
  );

  const unfollowUserMutation = useMutation(
    (userId) => axios.delete('/relationships', { data: { userId } }),
    {
      onSuccess: () => {
        queryClient.refetchQueries(['relationships']);
      },
    }
  );

  if (isLoading) { return <div>Loading...</div>; }
  if (error) { return <div>Error: {error.message}</div>; }

  return (
    <div className="rightBar">
      <div className="container">


        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
              <div className='userInfo'>
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <span>TEST USER</span>
              </div>

              <div className="buttons">
                <button>Follow</button>
                <button>Delete</button>
             </div>

            </div>

          {/* {data.map((user) => (
            <div key={user.id} className="user">
              <div className='userInfo'>
                <img
                  src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt=""
                />
                <span> {user.username}</span>
              </div>

              <div className="buttons">
                <button onClick={() => followUserMutation.mutate(user.id)}>Follow</button>
                <button onClick={() => unfollowUserMutation.mutate(user.id)}>Unfollow</button>
             </div>

            </div>
          ))} */}
        </div>


        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <p>
                <span>TEST USER</span> changed their cover picture
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RightBar;
