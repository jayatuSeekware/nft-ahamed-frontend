import React from 'react';
import Header from '../Header';



class Seller extends React.Component {

    // handleClick(event) {
    //     console.log('Click happened');
    //     var x = document.getElementById("collaps-detail");
    //     if (x.style.display === "none") {
    //         x.style.display = "block";
    //     } else {
    //         x.style.display = "none";
    //     }

    // }


    render() {

        return (
            <>
                <h1>Admin Dashboard!</h1>
                <div className="wrap" >
                            <div className="app-contant">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="coins-count">
                                            <div className="text-center">
                                                <h3>Seller</h3>


                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

            </>
        )
    }




}
export default Seller;