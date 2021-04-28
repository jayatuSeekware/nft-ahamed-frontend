import React from 'react';
import axios from 'axios';
import api from '../../api'
import Switch from "react-switch";
import DataTable from 'react-data-table-component';



const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }, { id: 2, title: ' the Barbarian', year: '1983' }];

const customStyles = {
    title: {
        style: {
          alignItem:'centre',
          color:'#fff'
        }
    },
    rows: {
        style: {
            minHeight: '50px', // override the row height
        }
    },
    headCells: {
        style: {
            paddingLeft: '25px', // override the cell padding for head cells
            paddingRight: '25px',
        },
    },
    cells: {
        style: {
            paddingLeft: '24px', // override the cell padding for data cells
            paddingRight: '24px',
        },
    },
};


class Admindashboard extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            dataList: [],
            soldstatus: true,
            notListedDataList: [],
            checked: true,
            columns: [
                {
                    name: 'Email',
                    selector: 'email',
                },
                {
                    name: 'AssetName',
                    selector: 'assetName',
                    sortable: true,
                },
                {
                    name: 'NftTokenId',
                    selector: 'tokenId',
                },
                {
                    name: 'OwnerAddress',
                    selector: 'owner',
                },
                {
                    name: 'NewOwnerAddress',
                    selector: 'newOwnerAddrress'
                },
                {
                    name: 'Price',
                    selector: 'price',
                },

                {
                    name: 'PlatformFee',
                    selector: 'platformfees'
                },
                {
                    name: 'TransactionFee',
                    selector: 'transactionfee'

                },
                {
                    name: 'AmountSentToTokenOwner',
                    selector: 'amtSendToTokenOwner'
                },
                {
                    name: 'Sold Status',
                    selector: 'soldStatus',

                },
                {
                    name: "Hide/Show",
                    selector: 'hide',
                    cell: row =>
                        <div onClick={() => this.handleonclick(row._id, row.hide)}>
                            <button style={{ width: 120, fontSize: 13 }} className=" btn btn-primary">
                                {row.hide}
                            </button>
                        </div>

                }
            ],

            columnnotlisted: [
                {
                    name: 'email',
                    selector: 'email',
                },
                {
                    name: 'AssetName',
                    selector: 'assetName',
                    sortable: true,
                },
                {
                    name: 'NftTokenId',
                    selector: 'tokenId',
                },
                {
                    name: 'OwnerAddress',
                    selector: 'owner',
                },
                {
                    name: 'Price',
                    selector: 'price',
                },
                {
                    name: 'Sold Status',
                    selector: 'soldStatus',

                }

            ]

        };
        this.handleChange = this.handleChange.bind(this);

    }

    setTableData = () => {

    }

    handleonclick = (item, stats) => {
        console.log("item handle on click---", item, stats);

        if (stats === "Hidden") {


            console.log("item 1", item, stats);
            axios.post(api.API_URL + "updatelisteddata", { "id": item, "status": "Not-Hidden" }).then((resp) => {
                console.log("resp>>>>>>>>>>>", resp)
                this.getAllListedData()

            }).catch((err) => {
                console.log("errors", err)
            })
        }
        else {
            console.log("item 2", item, stats);

            axios.post(api.API_URL + "updatelisteddata", { "id": item, "status": "Hidden" }).then((resp) => {
                console.log("resp>>>>>>>>>>>", resp)
                this.getAllListedData()

            }).catch((err) => {
                console.log("errors", err)
            })
        }

    }



    async componentDidMount() {
        await this.getAllListedData()
        await this.getAllNotListedData()


    }

    //List of all data in table;
    getAllListedData = async () => {
        axios.get(api.API_URL + 'getalldataforAdmin').then((listdata) => {
            console.log("getalldatalist", listdata.data.data)
            this.setState({ dataList: listdata.data.data, soldstatus: listdata.data.data.soldStatus }, () => {

                this.setTableData();
            })

        }).catch((errs) => {
            // console.log("alldata_api_catchblock", errs)
        })
    }

    getAllNotListedData = async () => {
        axios.get(api.API_URL + 'getallnotlisteddata').then((notlisteddata) => {
            // console.log("getallnotlisteddata", notlisteddata.data.data)
            this.setState({ notListedDataList: notlisteddata.data.data })
        }).catch((errs) => {
            // console.log("alldata_api_catchblock", errs)
        })
    }

    hide = (id, i) => {
        console.log("iddddd=====", id, i, this.state.checked)
        // axios.post(api.API_URL + "updatelisteddata", { "id": id }).then((resp) => {
        //     console.log("resp>>>>>>>>>>>",resp)
        // }).catch((err) => {
        //     console.log("errors", err)
        // })
    }

    handleChange(id, i, checked) {
        //this.setState({ checked });
        console.log("iddddd=====", id, i, this.state.checked)


    }

    logout = () => {
        console.log("id++++++++")
        sessionStorage.clear()
        this.props.history.push('/Signin')
    }

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
                                <button className="btn blue-btn" onClick={this.logout}>Logout</button>
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


                                                <DataTable
                                                    title="Listed Tokens For Sale"
                                                    columns={this.state.columns}
                                                    data={this.state.dataList}
                                                    customStyles={customStyles}
                                                />

                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-md-12 col-sm-12">
                                        <div className="coins-count">
                                            <div className="text-center">
                                                <DataTable
                                                    title="Not Listed Tokens"
                                                    columns={this.state.columnnotlisted}
                                                    data={this.state.notListedDataList}
                                                />
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