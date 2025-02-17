import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";
import { RotatingLines } from "react-loader-spinner";
import { BASE_URL } from "../../utils/headers";
// Base URL for the API


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/api/adminLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
        }),
      });
      const data = await response.json();

      if (data.success) {

        console.log(data);
        if (data.data.token) {
          localStorage.setItem("token", data.data.token);
          navigate("/admin/home");
        } else {
          setError("Failed to log in: No token received.");
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  // for test
  // const handleLogin = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Simulate successful login by setting a dummy token
  //     const dummyToken = "mocked-local-token-12345";
  //     localStorage.setItem("userToken", dummyToken);
  //     navigate("/admin/home");
  //   } catch (err) {
  //     console.error("Error during login:", err);
  //     setError("An error occurred. Please try again.");
  //   }
  // };



  return (
    <div className="login">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username (Email)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          {loading ? <RotatingLines
            visible={true}
            height="60"
            width="60"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}} // Optional for additional inline styling
            wrapperClass="" // Optional for adding class names
          /> : <button type="submit">Login</button>}

        </form>
      </div>
    </div>
  );
};

export default Login;
