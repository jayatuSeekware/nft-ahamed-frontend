import React from 'react';


function Header() {

    return (
            <div className="topheader">
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                    <div className="container">
                        <div className="d-flex justify-content-end justify-content-lg-start pt-1 pt-lg-0">
                            <a className="navbar-brand" href="index.html">
                                <h3>BRAND</h3>
                            </a>
                        </div>
                        <div className="collapse navbar-collapse justify-content-end navMenu">
                            <button className="btn btn-primary">Login</button>
                        </div>


                    </div>
                </nav>
            </div>
    );
}

export default Header;