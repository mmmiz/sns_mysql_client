import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

  return (
    <div className="register">
      <div className="card">

        <div className="left">
          <h1>Lama Social.</h1>
          <p>
            HELLO!
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>


        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>

        
      </div>
    </div>
  );
};

export default Register;


// // ---------below or useRef (realtime-chat-p)------------------
//   const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [err, setErr] = useState(null);
//   const navigate = useNavigate();

//   const handleClick = async (e) => {
//     e.preventDefault();

//     try {
//       await axios.post("/auth/register", { username, email, password, name });
//       navigate("/login");
//     } catch (err) {
//       setErr(err.response.data);
//     }
//   };

//   return (
//     <form>
//       {/* Input components for username, email, password, name */}
//       <button onClick={handleClick} onchange={handleChange}>Register</button>
//     </form>
//   );
// };
