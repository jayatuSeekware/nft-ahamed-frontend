import React from 'react';
import axios from 'axios';
import api from '../api'
import swal from 'sweetalert';
import LoGO from "../images/logo.png"



class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            hidden: true,
        }
    }

    handleEmail = (event) => {
        this.setState({ email: event.target.value });
    }

    handlePassword = (event) => {
        this.setState({ password: event.target.value });
    }
    toggleShow = () => {
        this.setState({ hidden: !this.state.hidden });
    }

    signin = () => {
        if (this.state.email === "" || this.state.email === null) {
            return swal({ title: "Enter your email address", icon: "error" })
        } else if (this.state.password === "" || this.state.password === null) {
            return swal({ title: "Enter your password", icon: "error" })
        } else {
            axios.post(api.API_URL + 'login', {
                "email": this.state.email,
                "userType": 1,
                "password": this.state.password
            }).then((respdata) => {
                console.log("respdata============>login", respdata.data)
                if (respdata.data.status === true) {
                    sessionStorage.setItem("token", respdata.data.data.token);
                    localStorage.setItem('currentUserEmail', respdata.data.data.email)
                    if (respdata.data.data.email === "erkrujjawal@gmail.com") {
                        this.props.history.push('/admindashboard')
                    } else {
                        this.props.history.push('/')
                    }


                } else {
                    console.log("elsecase========")
                    swal({ title: respdata.data.message, icon: "error" })
                    this.props.history.push("/Signin");
                }
            }).catch((errors) => {
                // console.log("errors", errors)
            })
        }
    }


    render() {
        return (
            <>
        <section className="user-screen-area">
        <div className="user-screen-box">
            <div className="user-screen-item screen-form">
               <div className="user-form">
                   <form>
                     <div className="nft-input-box validate-input" data-validate="Email is required">
                        <span className="label-nft-input">Email</span>
                        <input className="nft-input" type="text" name="name" placeholder="Enter Email" value={this.state.email} onChange={this.handleEmail}/>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-input-box validate-input" data-validate="Name is required">
                        <span className="label-nft-input">Password</span>
                        <input className="nft-input" type="password" name="name" placeholder="******" value={this.state.password} onChange={this.handlePassword}/>
                        <span className="focus-nft-input"></span>
                     </div>
                     <div className="nft-links-btn">
                        <a href="/">Forgot My Password ?</a>
                     </div>
                     <div className="nft-links-btn">
                        <a onClick={this.signin} className="theme-btn">Log In</a>
                        <p className="theme-description text-center">Don’t have an account? <a href="/Signup">Sign Up</a></p>
                     </div>
                     </form>
               </div>

               <div className="user-copyright">
                  <p className="theme-description">Copyright 2021 <a href="/">NFT Marketplace</a> All Rights Reserved.</p>
               </div>
            </div>
            <div className="user-screen-item screen-bg-image text-center">
               <div className="user-logo">
                  <a href="index.html"><img src={LoGO}/></a>
               </div>
            </div>
         </div>
         </section>
            </>
        )
    }
}


export default Signin;

