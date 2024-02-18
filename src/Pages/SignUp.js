import React, { useState } from 'react'
// import "./Login.css";
import logo from "../Images/Logo.png";
import axios from 'axios';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [Pname, setPname] = useState('');
    const [password, setPassword] = useState('');
    async function authenticate(e) {
        e.preventDefault();
        try {
            axios.post('http://localhost:5000/api/signup', {
                    name: Pname,
                    username: username,
                    password: password,
            }).then((response) => {
                if (response.data.login === "denied") {
                    alert(response.message)
                }
                else{
                    window.location.href = "http://localhost:3000/Login"
                }
            })
            
          } catch (error) {
            console.log(error)
          }
    }
    return (
        <div className='body'>
            <form onSubmit={authenticate} className= "w-50 border border-light shadow-2 rounded position-absolute top-50 start-50 translate-middle col-4 p-4 d-flex flex-column text-light">
                <h2 className="text-center text-white font-monospace"><img src={logo} className='mx-3' alt="" /><strong>AuctioNex</strong></h2>
                <div className="mb-3 d-flex flex-column align-items-start w-100">
                    <label htmlFor="Pname" className="form-label">Name</label>
                    <input type="text" className="text-light form-control w-100" id="name" onChange={(e) => setPname(e.target.value)} name = "Pname" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start w-100">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="text" className="text-light form-control w-100" id="usernme" onChange={(e) => setUsername(e.target.value)} name = "username" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3 d-flex flex-column align-items-start w-100">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="text-light form-control w-100" onChange={(e) => setPassword(e.target.value)} name = "password" id="password" />
                </div>
                <div className= "d-flex justify-content-between">
                    <span>Don't have account? <a href="./signup.php"> <strong>Sign Up</strong></a></span>
                    <button type="submit" className="btn btn-primary border-0 shadow bg-white text-dark"><strong>Login</strong></button>
                </div>
            </form>
        </div>
    )
}
