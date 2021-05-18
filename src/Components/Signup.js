import React from 'react';
import axios from 'axios';
import api from '../api'
import swal from 'sweetalert';
import LoGO from "../images/logo-white.png"





class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: "",
            confirmPass: "",
            hidden: true,
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
            console.log('signupmethod_data', this.state.username, this.state.email, this.state.password, this.state.confirmPass)
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
                // console.log('signup_catchlock=====', errs)
            })
        }
    }


    render() {
        return (
            <>
                {/* <div className="main-body">
                    <div className="container h-100 ">

                        <div className="formContent">
                            <h1>Sign Up</h1>
                            <div>
                                <input type="text" placeholder="Username" value={this.state.username} onChange={this.handleusername}></input>
                                <input type="text" placeholder="Email" value={this.state.email} onChange={this.handleemail}></input>

                                <div className="pas-field">
                                    <input type={this.state.hidden ? 'password' : 'text'} placeholder="password" value={this.state.password} onChange={this.handlepassword}></input>
                                    <i className="fa fa-eye" aria-hidden="true" onClick={this.toggleShow}></i>
                                </div>
                                <div className="pas-field">
                                    <input type={this.state.hidden ? 'password' : 'text'} placeholder="Confirm password" value={this.state.confirmPass} onChange={this.handleconfirmpass}></input>
                                    <i className="fa fa-eye" aria-hidden="true" onClick={this.toggleShow}></i>
                                </div>
                                <input type="submit" className="fadeIn fourth" value="Sign Up" onClick={this.signup}></input>
                            </div>
                            <div id="formFooter">
                                <p>Already registered <a className="underlineHover" href="/Signin">Sign In</a></p>
                            </div>
                        </div>

                    </div>
                </div> */}

                <div className="user-screen-area">
         <div className="user-screen-box">
            <div className="user-screen-item screen-form">
               <div className="user-form">
                     <div className="nft-input-box validate-input" data-validate="Name is required">
                        <span className="label-nft-input">User Name</span>
                        <input className="nft-input"  type="text" placeholder="User name" value={this.state.username} onChange={this.handleusername}></input>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-input-box validate-input" data-validate="Name is required">
                        <span className="label-nft-input">Email Address</span>
                        <input className="nft-input" type="text" name="name" placeholder="name@example.com" value={this.state.email} onChange={this.handleemail}></input>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-input-box validate-input" data-validate="Name is required">
                        <span className="label-nft-input">Password</span>
                        <input className="nft-input" type={this.state.hidden ? 'password' : 'text'} placeholder="Password" value={this.state.password} onChange={this.handlepassword}></input>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-input-box validate-input" data-validate="Name is required">
                        <span className="label-nft-input"> Confirm Password</span>
                        <input className="nft-input" type={this.state.hidden ? 'password' : 'text'} placeholder="Confirm password" value={this.state.confirmPass} onChange={this.handleconfirmpass}></input>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-links-btn" >
                        <input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" />
                        <label htmlFor="styled-checkbox-1"><span>I agree to the <a href="">Terms</a> and <a href="">Privacy Policy</a>.</span></label>
                     </div>
                     <div className="nft-links-btn">
                        {/* <button className="theme-btn">Create Account</button> */}
                        <input type="submit" className="theme-btn" value="Sign Up" onClick={this.signup}></input>

                        <p className="theme-description text-center">Already registered <a href="/Signin">Sign In</a></p>
                     </div>
               </div>
               <div className="user-copyright">
                  <p className="theme-description">Copyright 2021 <a href="">NFT Marketplace</a> All Rights Reserved.</p>
               </div>
            </div>
            <div className="user-screen-item screen-bg-image text-center">
            <div className="user-logo">
                  <a href="index.html"><img src={LoGO}/></a>
               </div>
              
            </div>
         </div>
      </div>

            </>
        )
    }
}


export default Signup;

