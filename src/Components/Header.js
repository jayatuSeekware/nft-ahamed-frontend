import React from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';

var jwttoken;

function Header() {
    jwttoken = localStorage.getItem("token")
    console.log("inside header==========", jwttoken);

    const history = useHistory();
    const login = () => {
        history.push("/Signin");
    }

    const logout = () => {
        localStorage.clear()
        window.location.reload()
    }

    const generateasset = () => {
        console.log("inside header==========", jwttoken);

        if (jwttoken) {
            history.push("/Createassets")
        } else {
            return swal({ title: "Please login!", icon: "error" })
        }

    }

    return (

        <div className="topheader">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container">
                    <div className="d-flex justify-content-end justify-content-lg-start pt-1 pt-lg-0">
                        <a className="navbar-brand" href="/">
                            <h3>BRAND</h3>
                        </a>
                    </div>
                    <div className="collapse navbar-collapse justify-content-end navMenu">
                        {jwttoken ? (
                            <div>
                                <button className="btn btn-primary" onClick={logout}>Logout</button>
                                <button style={{ marginLeft: 20 }} className="btn btn-primary" onClick={generateasset}>Generate asset</button>
                            </div>
                        ) : (
                            <div>
                                <button className="btn btn-primary" onClick={login}>Login</button>
                                <button style={{ marginLeft: 20 }} className="btn btn-primary" onClick={generateasset}>Generate asset</button>
                            </div>
                        )}

                        {/* <button className="btn btn-primary" onClick={login}>Login</button>



                        <button style={{ marginLeft: 20 }} className="btn btn-primary" onClick={generateasset}>Generate asset</button> */}

                    </div>


                </div>
            </nav>
        </div>
    );
}

export default Header;