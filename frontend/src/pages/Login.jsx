import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/login", {
        email,
        password
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />

        <button type="submit">
          Login
        </button>
      </form>

      <br />

      <Link to="/register">
        Create Account
      </Link>
    </div>
  );
}

export default Login;