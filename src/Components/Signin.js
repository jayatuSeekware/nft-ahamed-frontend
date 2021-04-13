import React, { Component } from 'react';
import axios from 'axios';
import api from '../api'
import config from '../config'
import swal from 'sweetalert';




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
            return swal({title:"Enter your email address" ,icon:"error"})
        } else if (this.state.password === "" || this.state.password === null) {
            return swal({title:"Enter your password" ,icon:"error"})
        } else {
            console.log("======elsecase", this.state.email, this.state.password)
            axios.post(api.API_URL + 'login', {
                "email": this.state.email,
                "password": this.state.password
            }).then((respdata) => {
                console.log("respdata", respdata.data)
                if (respdata.data.status === true) {
                    localStorage.setItem("token", respdata.data.token);
                    this.props.history.push('/')
                } else {
                    return swal({title:"Login failed,check your email and password",icon:"error"})
                }
            }).catch((errors) => {
                console.log("errors", errors)


            })
        }
    }


    render() {
        return (
            <>
                <div style={{ marginLeft: 300, marginRight: 300, padding: 30 }}>
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

                    <div style={{marginTop:20}}>

                        <p >
                            <a href="/Signup">Signup</a>
                        <a> | </a>
                             <a href="#">Forgot password?</a>
                        </p>
                    </div>
                </div>
            </>
        )
    }
}


export default Signin;