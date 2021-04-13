import React, { Component } from 'react';
import axios from 'axios';
import api from '../api'
import config from '../config'
// import '../App.css';
// import '../css/signin.css'



class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    handleEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    handlePassword = (event) => {
        this.setState({ password: event.target.value })
    }

    signin = () => {
        console.log("signin button clicked")
        if (this.state.email === "" || this.state.email === null) {
            alert("Enter your email address")
        } else if (this.state.password === "" || this.state.password === null) {
            alert("Enter your password")
        } else {
            console.log("======elsecase", this.state.email, this.state.password)
            axios.post(api.API_URL + 'login', {
                "email": this.state.email,
                "password": this.state.password
            }).then((respdata) => {
                console.log("respdata", respdata.data)
                if (respdata.data.status === true) {
                    alert("Login Successfull")
                    localStorage.setItem("token", respdata.data.token);
                } else {
                    alert("Login failed,check your email and password")
                }
            }).catch((errors) => {
                console.log("errors", errors)


            })
        }
    }


    render() {
        return (
            <>

                <h3>Sign In</h3>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" value={this.state.email} onChange={this.handleEmail} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password" value={this.state.password} onChange={this.handlePassword} />
                </div>

                {/* <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div> */}

                <button className="btn btn-primary btn-block" onClick={this.signin}>Submit</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>

            </>
        )
    }
}


export default Signin;