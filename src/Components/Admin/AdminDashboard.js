import React from 'react';
import axios from 'axios';
import api from '../../api'
import Switch from "react-switch";

// import { id } from '@ethersproject/hash';






class Admindashboard extends React.Component {

    constructor(props) {
        
        super(props);
        this.state = {
            dataList: [],
            soldstatus: "",
            notListedDataList: [],
            checked:true
            
        };
        this.handleChange = this.handleChange.bind(this);
    }

    async componentDidMount() {
        await this.getAllListedData()
        await this.getAllNotListedData()


    }

    getAllNotListedData = async () => {
        axios.get(api.API_URL + 'getallnotlisteddata').then((notlisteddata) => {
            // console.log("getallnotlisteddata", notlisteddata.data.data)
            this.setState({ notListedDataList: notlisteddata.data.data })
        }).catch((errs) => {
            // console.log("alldata_api_catchblock", errs)
        })
    }



    //List of all data in table;
    getAllListedData = async () => {
        axios.get(api.API_URL + 'getalldata').then((listdata) => {
            // console.log("getalldatalist", listdata.data.data)
            this.setState({ dataList: listdata.data.data, soldstatus: listdata.data.data.soldStatus })
        }).catch((errs) => {
            // console.log("alldata_api_catchblock", errs)
        })
    }

    hide = (id,i) => {
        console.log("iddddd=====",id, i,this.state.checked)
        // axios.post(api.API_URL + "updatelisteddata", { "id": id }).then((resp) => {
        //     console.log("resp>>>>>>>>>>>",resp)
        // }).catch((err) => {
        //     console.log("errors", err)
        // })
    }

    handleChange(id,i,checked) {
        this.setState({ checked });
        console.log("iddddd=====",id, i,this.state.checked)


      }

    // show = (id) => {
    //     console.log("id++++++++", id)
    // }

    render() {
        return (
            <>

                <h1>Admin Dashboard!</h1>

                <div className="admintopheader">
                    <nav className="navbar navbar-expand-lg nav-custom-style fixed-top">

                        <div className="d-flex justify-content-end justify-content-lg-start pt-1 pt-lg-0">
                            <a className="navbar-brand" href="/">
                                <h3>LOGO</h3>
                                {/* <img src={Logo} alt="logo" />  */}
                            </a>
                        </div>

                        <ul className="nav header-menu">
                            <li className="nav-item">
                                <a className="nav-link" href="#" >Dashboard</a>
                            </li>
                        </ul>

                        <div className="collapse navbar-collapse justify-content-end navMenu">
                            <div className="nav-side-icon">
                                <button className="btn blue-btn"></button>
                                <span><i className="fas fa-bell"></i></span>
                                <span><i className="fas fa-cog"></i></span>
                            </div>
                        </div>

                    </nav>
                </div>


                <div className="main-body">
                    <div id="mySidebar" className="sidebar">
                        <a href="/">
                            <i className="fas fa-bell"></i>
                            <span>Home</span>
                        </a>
                        <a href="#">
                            <i className="fas fa-chart-area"></i>
                            <span>Buyers</span>
                        </a>


                    </div>
                    <div className="main-dashboard">
                        <div className="wrap" >
                            <div className="app-contant">
                                <div className="row">
                                    <div className="col-md-12 col-sm-12">
                                        <div className="coins-count">
                                            <div className="text-center">
                                                <h3> Listed Tokens For Sale</h3>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>UserEmail</th>
                                                            <th>AssetName</th>
                                                            <th>NftTokenId</th>
                                                            <th>Owner</th>
                                                            <th>Price</th>

                                                        </tr>
                                                    </thead>
                                                    {
                                                        this.state.dataList.map((list, i) => {
                                                            console.log("allnotlisteddatatable", list, i)
                                                            return (

                                                                <tbody>
                                                                    <tr>
                                                                        <td>{list.email}</td>
                                                                        <td>{list.assetName}</td>
                                                                        <td>{list.tokenId}</td>
                                                                        <td>{list.owner}</td>
                                                                        <td>{list.price}</td>
                                                                        <Switch onChange={this.handleChange.bind(this,list._id,i)} checked={this.state.checked} />

                                                                        {/* <button onClick={() => this.hide(list._id,i)}>Hide</button> */}

                                                                        {/* <button onClick={() => this.show(list._id)}>Show</button> */}

                                                                    </tr>
                                                                </tbody>
                                                            );
                                                        })
                                                    }
                                                </table>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <div className="coins-count">
                                            <div className="text-center">
                                                <h3>Non Listed Token </h3>
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>UserEmail</th>
                                                            <th>AssetName</th>
                                                            <th>NftTokenId</th>
                                                            <th>Owner</th>
                                                            <th>Price</th>

                                                        </tr>
                                                    </thead>
                                                    {
                                                        this.state.notListedDataList.map(list => {
                                                            console.log("allnotlisteddatatable", list)
                                                            return (

                                                                <tbody>
                                                                    <tr>
                                                                        <td>{list.email}</td>
                                                                        <td>{list.assetName}</td>
                                                                        <td>{list.tokenId}</td>
                                                                        <td>{list.owner}</td>
                                                                        <td>{list.price}</td>


                                                                    </tr>
                                                                </tbody>
                                                            );

                                                        })
                                                    }
                                                </table>
                                            </div>
                                        </div>
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


export default Admindashboard;