import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log(`Email: ${email}, Password: ${password}`);
        navigate('/dashboard');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <h1>Welcome Back!</h1>
            <p>Please log in to your account to continue.</p>
            <form onSubmit={handleLoginSubmit}>
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

                <button type="submit">Login</button>
            </form>
            <p>Not a member? <span onClick={handleSignUpClick} style={{cursor: 'pointer', color: '#4682b4'}}>Sign up now</span></p>
        </div>
    );
}

export default Login;
