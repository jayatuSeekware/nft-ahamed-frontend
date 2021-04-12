import './App.css';
import Web3 from 'web3';
import asset from "./abis/Assets.json"
import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import QRCode from "react-qr-code";
import { ethers } from "ethers";
import Loading from 'react-fullscreen-loading';
import api from './api'
import config from './config'

const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

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

var contractAddress = config.Contract_address

class App extends React.Component {
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
      ipfsHash:""
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
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


  loadBlockchainData = async () => {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const abi = asset
    const contract = new web3.eth.Contract(abi, contractAddress)
    this.setState({ contract })
    const totalSupply = await contract.methods.totalSupply().call()
    this.setState({ totalSupply })
    // Load asset
    console.log("totalsupply&contract", totalSupply, contract)
  }


  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  handleAssetName = (event) => {
    this.setState({ assetName: event.target.value })
  }

  handlePrice = (event) => {
    this.setState({ price: event.target.value })
  }

  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleDes = (event) => {
    this.setState({ description: event.target.value })
  }

  handleHash = (event) => {
    this.setState({ transHash: event.target.value })
  }

  openModal = (data) => {
    console.log('shomodal=====', data)
    this.setState({ tokenId: data })
    axios.post(api.API_URL + 'getsingledata', { "tokenId": data }).then((respo) => {
      this.setState({
        ipfsHash: respo.data.data.ipfsHash,
        price: respo.data.data.price,
        assetName: respo.data.data.assetName,
        description: respo.data.data.description
      })
      console.log("singledatadetails", respo.data.data.assetName)
    }).catch((er) => {
      console.log('er', er)
    })
    this.setState({ showModal: true })
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
    let assetname = this.state.assetName
    var txhash = this.state.transHash;
    var payamout = this.state.price;
    var payaddr = this.state.ethadd;
    var tokenid = this.state.tokenId;
    console.log(txhash, "hash=======================", tokenid);
    const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f99366737d854f5e91ab29dad087fcd5');
    this.setState({ loader: true })


    if (txhash === "" || txhash === null) {
      return alert("Enter your transaction hash.")
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
        axios.post(api.API_URL + 'paymentdetail', {
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




  generateNftToken = () => {
    


    if (this.state.assetName === "" || this.state.assetName === null) {
      return alert("Enter your asset name")
    } else if (this.state.price === "" || this.state.price === null) {
      return alert("Enter your pay amount")
    } else if (this.state.selectedFile === "" || this.state.selectedFile === null) {
      return alert("please select your assets image")
    } else if (this.state.description === "" || this.state.description === null) {
      return alert("Enter description")
    } else {

     
      var file = this.state.selectedFile
      let reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
  
     
  
       reader.onloadend = async () => {
  
        console.log("clicked reader",reader)
        const buffer =  await Buffer.from(reader.result);
  
        await ipfs.add(buffer, (err, ipfsHash) => {
          console.log("imagehash&err",err,ipfsHash[0].hash);
          //setState by setting ipfsHash to ipfsHash[0].hash 
          this.setState({ ipfsHash:ipfsHash[0].hash });

          axios.get(api.API_URL + "getTokenId").then((resp) => {
            console.log('++++++++api=====url', resp)
            var tokenId = resp.data.data
            this.setState({ loader: true })
            this.state.contract.methods.mint(this.state.assetName, tokenId, this.state.ipfsHash).send({ from: this.state.account })
              .once('receipt', (receipt) => {
                const data = new FormData()
                data.append("assetName", this.state.assetName);
                data.append("price", this.state.price);
                data.append("description", this.state.description);
                data.append("owner", this.state.account);
                data.append("tokenId", tokenId)
                data.append("ipfsHash",this.state.ipfsHash)
                console.log("========hashinside", this.state.ipfsHash)
                let url = api.API_URL + "uploadImage";
                const config = {
                  headers: { 'content-type': 'multipart/form-data' }
                }
                axios.post(url, data, config)
                  .then((result) => {
                    this.setState({ loader: false })
                    // window.location.reload();
                    console.log("resultData", result);
                  }).catch((errr) => {
                    console.log(errr)
                    this.setState({ loader: false })
                  })
                console.log("receipt", receipt)
              }).catch((errror) => {
                console.log("metamask", errror)
                this.setState({ loader: false })
              })
          }).catch((errrs) => {
            console.log("api", errrs)
            this.setState({ loader: false })
          })
    


        })
        
       }


     

   }
  };


  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
      const buffer = await Buffer.from(reader.result);
    //set this buffer -using es6 syntax
      this.setState({buffer});
      console.log("buddfe",buffer);

      await ipfs.add(buffer, (err, ipfsHash) => {
        console.log("imagehash&err",err,ipfsHash[0].hash);
        //setState by setting ipfsHash to ipfsHash[0].hash 
        this.setState({ ipfsHash:ipfsHash[0].hash });
      })
  };

  render() {
    return (
      <div style={{ textAlign: "center" }}>

        {this.state.loader ? (<Loading loading background="#ffffff00" loaderColor="#3498db" />) : (

          <div>

            <div className={'generatenftarea'}>
              <h1>Nft Assets</h1>

              <table>
                <tr>
                  <td><label>Asset Name</label></td>
                  <td><input type="text" value={this.state.assetName} onChange={this.handleAssetName} /></td>
                </tr>
                <tr>
                  <td><label>Price</label></td>
                  <td><input type="text" value={this.state.price} onChange={this.handlePrice} /></td>
                </tr>
                <tr>
                  <td><label>Upload your img</label></td>
                  <td> <input type="file" onChange={this.onFileChange} /></td>
                </tr>
                <tr>
                  <td><label>Description</label></td>
                  <td><input type="text" value={this.state.description} onChange={this.handleDes} /></td>
                </tr>
                <tr>

                </tr>
              </table>
              <button onClick={this.generateNftToken}> Generate Nft</button>
            </div>


            <div className="assetarea">
              {this.state.dataList.map(list => (
                list.soldStatus === "1" ? (

                  <div className="assetfield"  >
                    <img style={{ height: 200, width: 200 }} src={api.IPFS_URL + list.ipfsHash} alt=""/>
                    <p>Name: {list.assetName}</p>
                    <p>Price: {list.price}</p>
                    <p>Status:Sold</p>

                  </div>
                ) : (
                    <div className="assetfield" onClick={() => this.openModal(list.tokenId)} >
                      <img style={{ height: 200, width: 200 }} src={api.IPFS_URL + list.ipfsHash} alt=""/>
                      <p>Name: {list.assetName}</p>
                      <p>Price: {list.price}</p>
                      <p>Status:Not sold</p>

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

          <div className="singlemodaldetail">
            <div className="imagesection">
              <img src={"http://localhost:3000/" + this.state.imageName} alt=""/>
            </div>
            <div className="detailsection">
              <h1>{this.state.assetName}</h1>
              <div className="pricebox"><h3>{this.state.price}ETH</h3></div>
              <div className="descriptionbox"><p>{this.state.description}</p></div>
              <div className="bidsection">
                <button onClick={this.etherAddress}>Buy</button>
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
    )
  }
}




export default App;
