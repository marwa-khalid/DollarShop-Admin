import React from 'react'
import { useState } from 'react';
import {useDispatch } from 'react-redux';
import { login } from '../redux/UserSlice'; 
import './Login.css'

const Login = () => {

  const dispatch = useDispatch();

  const [email, setEmail] = useState("admin@dollarwala.com");
  const [password, setPassword] = useState("12345678");
  const [emailErr, setEmailError] = useState("");
  const [passErr, setPassError] = useState("");
  const [Err, setError] = useState("");

  const handleLogin = async () => {

    if (!email) {
      setEmailError("Email is required");
      return;
    }else setEmailError('');
    if (!password) {
      setPassError("Password is required.");
      return;
    }else setPassError('');
    
    if(email=="admin@dollarwala.com" && password == "12345678"){   
      dispatch(login({ email: email, password: password }));
    }
    else setError("Invalid Credentials");
  };

  return  (
    <div className="login-container">
     <div className="login-form">
      <h2 className='heading'>Admin Login</h2>
      <form>
        <div className="form-group ">
          <label htmlFor="email">Email:</label>
          <input
            className='inputt'
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailErr && <p style={{ color: 'red', fontSize: '16px' }}>{emailErr}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            className='inputt'
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passErr && <p style={{ color: 'red', fontSize: '16px' }}>{passErr}</p>}
        </div>
        <button className='buttonn' type="button" onClick={handleLogin}>
          Login
        </button>
        {Err && <p style={{ color: 'red', fontSize: '16px', textAlign:"center" }}>{Err}</p>}
      </form>
    </div>
    </div>
  )
}

export default Login
