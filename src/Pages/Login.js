import React, { useState } from 'react'
import "./Login.css";
import logo from "../Images/Logo.png";
import {Link} from "react-router-dom";
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    axios.defaults.withCredentials = true;
    async function authenticate(e) {
        e.preventDefault();
        try {
            axios.post('http://localhost:5000/api/Login', 
            {
                    username: username,
                    password: password,
            }).then((response) =>{
                if (response.data.login === "denied") {
                    alert(response.message)
                }
                else{
                    window.location.href = "http://localhost:3000/home"
                }
            })
            // Handle successful login
          } catch (error) {
            console.log(error)
          }
        
    }
    return (
        <div className='body'>
            <form onSubmit={authenticate} className= "w-50 border border-light shadow-2 rounded position-absolute top-50 start-50 translate-middle col-4 p-4 d-flex flex-column text-light">
                <h2 className="text-center text-white font-monospace"><img src={logo} className='mx-3' alt="" /><strong>AuctioNex</strong></h2>
                <div className="mb-3 d-flex flex-column align-items-start w-100">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="text" className="text-light form-control w-100" id="usernme" onChange={(e) => setUsername(e.target.value)} name = "username" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start w-100">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="text-light form-control w-100" onChange={(e) => setPassword(e.target.value)} name = "password" id="password" />
                </div>
                <div className= "d-flex justify-content-between">
                    <span>Don't have account? <Link to="/signup"> <strong>Sign Up</strong></Link></span>
                    <button type="submit" className="btn btn-primary border-0 shadow bg-white text-dark"><strong>Login</strong></button>
                </div>
            </form>
        </div>
    )
}
