import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import Logo from '../images/nlogo.jpg';
import Select from 'react-select';


let jwttoken;

function Header(props) {
    console.log("props header-----",props);
    let ASSET = [];

    if(props.fromScreen == "Home"){
        for(let i=0; i< props.dataList.length;i++){
            console.log("first value---",props.dataList[i].assetName)
            let obj = {"label":props.dataList[i].assetName,"value":props.dataList[i].tokenId,"soldstatus":props.dataList[i].soldStatus}
            ASSET.push(obj);
        }
    }


    const handleChange = (event) => {
     var jwttoken = sessionStorage.getItem("token")
     console.log("event token" , event, event.soldstatus);
      if (jwttoken) {

        if(event.soldstatus == "1"){
            swal({ title: "This NFT is Sold", icon: "error" })

        }
        else{
            history.push({
                pathname:  "/Detail",
                state: {
                 tokenID: event.value
            } 
             });
        }
    
     } else {
       swal({ title: "Unauthorized access! Login first", icon: "error" })
     }
    };

    
  const colourStyles = {
    control: styles => ({ 
    width:"385px",
    // outerHeight:"390px" ,
    backgroundColor: 'white',
    display: 'block',
    alignItems: 'center',
    display: 'flex'
})
  };


    jwttoken = sessionStorage.getItem("token")
    const history = useHistory();

    const login = () => {
        history.push("/Signin");
    }
    const logout = () => {
        sessionStorage.clear()
        window.location.reload()
    }
    const generateasset = () => {
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

                    {props.fromScreen == "Home" ? ( 
                        <div className="p-1 bg-light rounded rounded-pill shadow-sm search-box">
                        <div className="input-group">
                            
                        <Select
                                        className="basic-single"
                                        classNamePrefix="Enter NFT-Asset Name"
                                        options={ASSET}
                                        onChange={(selectedAsset) => handleChange(selectedAsset)}
                                        styles={colourStyles}
                                        
                                    />
                        </div>
                    </div>
                      ):(null
                    )}
                    <ul className="nav header-menu">
                        <li className="nav-item">
                            <a className="nav-link" href="/" >Explore</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain" target="_blank">Meatmask Tutorials</a>
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