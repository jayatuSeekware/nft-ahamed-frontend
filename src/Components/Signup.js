import React, { Component } from 'react';
import axios from 'axios';
import api from '../api'
import config from '../config'
// import '../App.css';
// import '../css/signin.css'



class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPass: ""
        }
    }

    handleusername = (event) => {
        this.setState({ username: event.target.value })
    }

    handleemail = (event) => {
        this.setState({ email: event.target.value })
    }

    handlepassword = (event) => {
        this.setState({ password: event.target.value })
    }

    handleconfirmpass = (event) => {
        this.setState({ confirmPass: event.target.value })
    }


    signup = () => {
        if (this.state.username === "" || this.state.username === null) {
            alert('Enter your username')
        } else if (this.state.email === "" || this.state.email === null) {
            alert("Enter your email address")
        } else if (this.state.password === "" || this.state.password === null) {
            alert('Enter your password')
        } else if (this.state.confirmPass === "" || this.state.confirmPass === null) {
            alert('Confirm your pasword')
        } else if (this.state.confirmPass !== this.state.password) {
            alert("Password and confirm Password don't match")
        } else {
            console.log('button clicked', this.state.username, this.state.email, this.state.password, this.state.confirmPass)
            axios.post(api.API_URL + 'register', {
                "userName": this.state.username,
                "email": this.state.email,
                "password": this.state.password,
                "confirmPass": this.state.confirmPass
            }).then((respdata) => {
                console.log("respdata", respdata.data)
                if (respdata.data.status === true) {
                    alert("Registered successfull.")
                    this.props.history.push('/Signin')

                } else {
                    alert("This email is already taken,try with another one")
                }
            }).catch((errs) => {
                console.log('errs=====', errs)
            })
        }
    }


    render() {
        return (
            <>

                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input type="text" className="form-control" placeholder="Username" value={this.state.username} onChange={this.handleusername} />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="text" className="form-control" placeholder="Email" value={this.state.email} onChange={this.handleemail} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="password" value={this.state.password} onChange={this.handlepassword} />
                </div>

                <div className="form-group">
                    <label> Confirm Password</label>
                    <input type="password" className="form-control" placeholder="Confirm password" value={this.state.confirmPass} onChange={this.handleconfirmpass} />
                </div>

                <button className="btn btn-primary btn-block" onClick={this.signup}>Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>

            </>
        )
    }
}


export default Signup;