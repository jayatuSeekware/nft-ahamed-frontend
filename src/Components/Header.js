import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import Logo from '../images/nlogo.jpg';
// import Howto from './howto';

var jwttoken;

const people = [
    "Siri",
    "Alexa",
    "Google",
    "Facebook",
    "Twitter",
    "Linkedin",
    "Sinkedin"
  ];

function Header(props) {
    console.log("props header-----",props);
    const [searchTerm, setSearchTerm] = React.useState("");
 const [searchResults, setSearchResults] = React.useState([]);
 const handleChange = event => {
    setSearchTerm(event.target.value);
  };
 React.useEffect(() => {
    const results = people.filter(person =>
      person.toLowerCase().includes(searchTerm)
    );
    setSearchResults(results);
  }, [searchTerm]);


    const resetInputField = () => {
       // setSearchValue("")
    }

    const callSearchFunction = (e) => {
        e.preventDefault();
        // props.search(searchValue);
        resetInputField();
    }



    jwttoken = sessionStorage.getItem("token")
    // console.log("inside header==========", jwttoken);
    const history = useHistory();
    const login = () => {
        history.push("/Signin");
    }
    const logout = () => {
        sessionStorage.clear()
        window.location.reload()
    }
    const generateasset = () => {
        // console.log("towen header", jwttoken);
        if (jwttoken) {
            history.push("/Createassets")
        } else {
            return swal({ title: "Please login!", icon: "error" })
        }
    }


    return (
        <div className="topheader">
            <nav className="navbar navbar-expand-lg nav-custom-style fixed-top">
                <div className="container">
                    <div className="d-flex justify-content-end justify-content-lg-start pt-1 pt-lg-0">
                        <a className="navbar-brand" href="/">
                            <img src={Logo} alt="logo" />
                        </a>
                    </div>
                    <div className="p-1 bg-light rounded rounded-pill shadow-sm search-box">
                        <div className="input-group">
                            <input type="text"
                                placeholder="Search by collectable name"
                                aria-describedby="button-addon1"
                                className="form-control border-0 bg-light"
                                value={searchTerm}
                                onChange={handleChange} />

                               

                            {/* <div className="input-group-append">
                                <button id="button-addon1" onClick={callSearchFunction} className="btn btn-link text-primary"><i className="fa fa-search"></i></button>
                            </div> */}

                            {/* <ul>
                                        {searchResults.map(item => (
                                        <li>{item}</li>
                                        ))}
                                    </ul> */}
                        </div>
                    </div>
                    <ul className="nav header-menu">
                        <li className="nav-item">
                            <a className="nav-link" href="/" >Explore</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/howto" target="_blank">How it works</a>
                        </li>

                    </ul>
                    <div className="collapse navbar-collapse justify-content-end navMenu">
                        {jwttoken != null ? (
                            <div>
                                <button className="btn blue-btn" onClick={logout}>Logout</button>
                                <button style={{ marginLeft: 20 }} className="btn border-btn" onClick={generateasset}>Generate asset</button>
                            </div>
                        ) : (
                            <div>
                                <button className="btn blue-btn" onClick={login}>Login</button>
                                <button style={{ marginLeft: 20 }} className="btn border-btn" onClick={generateasset}>Generate asset</button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Header;