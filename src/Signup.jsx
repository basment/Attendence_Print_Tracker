import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
        try {
            const response = await fetch("https://8319-72-241-45-75.ngrok-free.app/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: fullName,
                    email: email,
                    password: password
                })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                alert("Account created successfully!");
                navigate("/events");
            } else {
                alert("Signup failed: " + result.error);
            }
    
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    return (
        <div className="signup-container">
            <h1>Create Account</h1>
            <form onSubmit={handleSignupSubmit}>
                <label htmlFor="fullName">Full Name</label>
                <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Signup;
