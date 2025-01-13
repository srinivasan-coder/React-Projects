import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const navigate = useNavigate();

  const apiBaseUrl = 'http://localhost:5000'; // Base URL for Node.js server

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login flow
        const response = await axios.post(`${apiBaseUrl}/login`, {
          userid: email, // Change 'email' to 'userid' if matching your API
          password: password,
        });
  
        console.log('Login successful:', response.data);
        // localStorage.setItem('token', response.data.token || 'fake-jwt-token'); // Adjust if JWT is implemented
        // alert('Login successful!'); // Replace with navigation logic
        setEmail('');
        setPassword('');
        navigate('/home');
      } else {
        // Register flow
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
  
        const response = await axios.post(`${apiBaseUrl}/register`, {
          name:name,
          userid: email, // Change 'email' to 'userid' if matching your API
          password: password,
        });
  
        console.log('Registration successful:', response.data);
        // alert('Registration successful! Please login.'); // Replace with navigation logic
        setIsLogin(true); // Switch to login mode after successful registration
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Username:</label>
            <input type="text" id="username" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Enter username" required />
          </div>
        )}
  
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email" required />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password" required/>
        </div>
  
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password" required/>
          </div>
        )}
  
        {error && <p className="error">{error}</p>}
  
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? (isLogin ? 'Logging in...' : 'Registering...') : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
  
      <p className="toggle-link">
        {isLogin ? 'Don’t have an account?' : 'Already have an account?'}{' '}
        <span style={{ color: '#6a11cb', cursor: 'pointer' }} onClick={() => setIsLogin(!isLogin)} >
          {isLogin ? 'Register here' : 'Login here'}
        </span>
      </p>
    </div>
  );  
};

export default Login;
