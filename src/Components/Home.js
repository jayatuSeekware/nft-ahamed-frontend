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



const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',

  }
};



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
      swal({title:"Unauthrized access! Login first",icon:"error"})
    }


    // this.setState({ showModal: true })
  }

  closeModal = () => {
    this.setState({ showModal: false })
  }

  etherAddress = () => {
    const ethaddress = "0x93b8d57D2CECdC0Fd485CFCD7fB965D575445DcB"
    this.setState({ ethadd: ethaddress, newModel: true })
  }

  closeModalNew = () => {
    this.setState({ newModel: false })
  }

  paymentMethod = () => {
    var token = localStorage.getItem('token');
    let assetname = this.state.assetName
    var txhash = this.state.transHash;
    var payamout = this.state.price;
    var payaddr = this.state.ethadd;
    var tokenid = this.state.tokenId;
    console.log(txhash, "hash=======================", tokenid);
    const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f99366737d854f5e91ab29dad087fcd5');
    this.setState({ loader: true })


    if (txhash === "" || txhash === null) {
      return swal("Enter your transaction hash.", "error");
    }

    provider.getTransaction(txhash).then((transaction) => {
      console.log("transdetails", transaction.from, transaction.to);
      let paidprice = transaction.value.toString() / 1E18;
      let sendtoadd = transaction.to;
      if (payamout !== paidprice) {
        alert("Please pay required amount.")
        this.setState({ loader: false })

      } else if (payaddr !== sendtoadd) {
        alert("please pay to correct address")
        this.setState({ loader: false })

      } else {
        const options = {
          headers: { 'authToken': token }
        };

        axios.post(api.API_URL + 'paymentdetail', options, {
          "assetName": assetname,
          "tokenId": tokenid,
          "newOwnerAddrs": payaddr,
          "boughtTokenHash": txhash,
          "tokenPrice": payamout,
        }).then((datas) => {
          console.log('datas', datas)
          if (datas.data.status) {
            this.setState({ newModel: false, showModal: false })
            if (!alert('Transfering success')) { window.location.reload(); }
          } else {
            alert("Tranfering failed.")
            this.setState({ loader: false })
          }
        }).catch((errss) => {
          console.log('++++++++catchblock', errss)
          this.setState({ loader: false })

        })

      }
    });


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




            {/* ======modal1======== */}
            <Modal
              isOpen={this.state.showModal}
              style={customStyles}
              contentLabel="Example Modal"
              ariaHideApp={false}
            >
              <div className="row">
                <div className="singlemodaldetail">
                  <div className="col-sm-8">
                    <div className="imagesection">
                      <img src={api.IPFS_URL + this.state.ipfsHash} alt="" />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="detailsection">
                      <div className="sidedetail">
                        <h2>{this.state.assetName}</h2>
                        <div className="pricebox"><h3>{this.state.price}ETH</h3></div>
                        <div className="descriptionbox"><p>{this.state.description}</p></div>
                      </div>
                      <div className="bidsection">
                        <button onClick={this.etherAddress}>Buy</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>


              <button className="closemodal" onClick={this.closeModal}>X</button>

            </Modal>
            {/* modalsecond */}
            <Modal
              isOpen={this.state.newModel}
              style={customStyles}
              contentLabel="Example Modal"
              ariaHideApp={false}
            >

              <div className="paymentmodal">
                <div className="paysection">
                  <h1>Ethereum Address</h1>
                  <div className="qrcode-area">
                    <QRCode value={this.state.ethadd} />
                  </div>
                  <p>{this.state.ethadd}</p>
                  <p>Amount To Pay: {this.state.price}ETH</p>
                  <p>Enter Your Transection Hash</p>
                  <input type="text" placeholder="Transection Hash" onChange={this.handleHash}></input>

                  <div className="bidsection">
                    <button onClick={this.paymentMethod}>I Have Paid</button>
                  </div>
                </div>
              </div>

              <button className="closemodal" onClick={this.closeModalNew}>X</button>
            </Modal>
          </div>
        </div>
      </>
    )
  }
}




export default Home;
