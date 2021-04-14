import React, { Component } from 'react';
import axios from 'axios';
import api from '../api'
import config from '../config'
import swal from 'sweetalert';




class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPass: "",
            hidden: true,
            password: ''
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
    toggleShow = () => {
        this.setState({ hidden: !this.state.hidden });
    }



    signup = () => {
        if (this.state.username === "" || this.state.username === null) {
            return swal({ title: 'Enter your username', icon: "error" })
        } else if (this.state.email === "" || this.state.email === null) {
            return swal({ title: "Enter your email address", icon: "error" })
        } else if (this.state.password === "" || this.state.password === null) {
            swal({ title: 'Enter your password', icon: "error" })
        } else if (this.state.confirmPass === "" || this.state.confirmPass === null) {
            swal({ title: 'Confirm your pasword', icon: "error" })
        } else if (this.state.confirmPass !== this.state.password) {
            swal({ title: "Password and confirm Password don't match", icon: "error" })
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
                    swal({ title: "Registered successfull.", icon: "success" }).then((resp) => {

                        this.props.history.push('/Signin')
                    })

                } else {
                    swal({ title: "This email is already taken,try with another one", icon: "error" })
                }
            }).catch((errs) => {
                console.log('errs=====', errs)
            })
        }
    }


    render() {
        return (
            <>

                {/* <div style={{ marginLeft: 300, marginRight: 300, padding: 30 }}>

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

                    <div style={{ marginTop: 20 }}>

                        <p className="forgot-password text-center">
                            Already registered <a href="/Signin">sign in</a>
                        </p>
                    </div>
                </div> */}

                {/* test start */}
                <div className="main-body">
                    <div className="container h-100 ">

                        <div className="formContent">
                            <h1>Sign Up</h1>
                            <div>
                                <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleusername}></input>
                                <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleemail}></input>

                                <div className="pas-field">
                                    <input type={this.state.hidden ? 'password' : 'text'} placeholder="password" value={this.state.password} onChange={this.handlepassword}></input>
                                    <i class="fa fa-eye" aria-hidden="true" onClick={this.toggleShow}></i>
                                </div>
                                <div className="pas-field">
                                    <input type={this.state.hidden ? 'password' : 'text'} placeholder="Confirm password" value={this.state.confirmPass} onChange={this.handleconfirmpass}></input>
                                    <i class="fa fa-eye" aria-hidden="true" onClick={this.toggleShow}></i>
                                </div>


                                <input type="submit" className="fadeIn fourth" value="Sign Up" onClick={this.signup}></input>
                            </div>
                            <div id="formFooter">
                                <p>Already registered <a className="underlineHover" href="/Signin">Sign In</a></p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* testend */}

            </>
        )
    }
}


export default Signup;