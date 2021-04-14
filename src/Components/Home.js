import '../App.css';
import Web3 from 'web3';
import asset from "../abis/Assets.json"
import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import QRCode from "react-qr-code";
import { ethers } from "ethers";
import Loading from 'react-fullscreen-loading';
import api from '../api'
import config from '../config'
import Header from './Header';
import swal from 'sweetalert';



require('dotenv').config()







class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: "",
      selectedFile: null,
      assetName: "",
      price: "",
      description: "",
      tokenId: "",
      dataList: [],
      showModal: false,
      imageName: "",
      newModel: false,
      ethadd: "",
      transHash: "",
      soldstatus: "",
      visible: false,
      loader: false,
      ipfsHash: ""
    };
  }

  async componentWillMount() {
    await this.getAllData()
  };



  //List of all data in table;
  getAllData = async () => {
    axios.get(api.API_URL + 'getalldata').then((listdata) => {
      console.log("====", listdata.data.data)
      this.setState({ dataList: listdata.data.data, soldstatus: listdata.data.data.soldStatus })
    }).catch((errs) => {
      console.log(errs)
    })
  }





  handleHash = (event) => {
    this.setState({ transHash: event.target.value })
  }

  openModal = (data) => {
    console.log('shomodal=====', data)
    var jwttoken = localStorage.getItem("token")
    if (jwttoken) {
      this.props.history.push('/Detail', {
        tokenID: data
      })
    } else {
      swal({ title: "Unauthrized access! Login first", icon: "error" })
    }


    // this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }



 




  render() {
    return (
      <>
        <Header />

        <div className="container">

          <div style={{ textAlign: "center" }}>

            {this.state.loader ? (<Loading loading background="#ffffff00" loaderColor="#3498db" />) : (

              <div>
                <h3 style={{ marginTop: 50 }}>Top listed tokens</h3>

                <div className="assetarea row">
                  {this.state.dataList.map(list => (
                    list.soldStatus === "1" ? (

                      <div className="col-sm-3">
                        <div className="assetfield"  >
                          <div className="assetimage">
                            <img style={{ height: 200, width: 200 }} src={api.IPFS_URL + list.ipfsHash} alt="" />
                          </div>
                          <div className="assetdetail">
                            <h3 className="assetname">{list.assetName}</h3>
                            <p>Price: {list.price}</p>
                            <p>Status:Sold</p>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="col-sm-3">
                        <div className="assetfield" onClick={() => this.openModal(list.tokenId)} >
                          <div className="assetimage">
                            <img style={{ height: 200, width: 200 }} src={api.IPFS_URL + list.ipfsHash} alt="" />
                          </div>
                          <div className="assetdetail">
                            <h3 className="assetname">{list.assetName}</h3>
                            <p>Price: {list.price}</p>
                            <p className="assetstatus">Status:Not sold</p>
                          </div>

                        </div>
                      </div>
                    )
                  ))}
                </div>

              </div>

            )}

          </div>
        </div>
      </>
    )
  }
}




export default Home;
