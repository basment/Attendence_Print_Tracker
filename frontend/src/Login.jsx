import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username && password) {
      try {
        const response = await fetch("https://8319-72-241-45-75.ngrok-free.app/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        const result = await response.json();

        if (response.ok) {
          alert("Login successful!");
          navigate('/');
        } else {
          alert("Login failed: " + (result.error || "Invalid credentials"));
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Unable to connect to server.");
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2>FastPass</h2>
        <p className="subtext">Please <strong>enter your credentials</strong> to login.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="password-container" style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: '30px' }} // Add padding for the icon
              />
              <span onClick={() => setShowPassword(!showPassword)} className="eye-icon" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle eye icon */}
              </span>
            </div>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;