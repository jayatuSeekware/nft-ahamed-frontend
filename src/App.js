import './App.css';
import Web3 from 'web3';
import asset from "./abis/Assets.json"
import React, { Component } from 'react';
import axios from 'axios';




var contractAddress = "0xEE33aE7ed6B6A3D0a17334f871AF675FbCA80fb2"


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
      dataList: []
    };
  }

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.getlist()
    await this.getAllData()
  };

  getlist = async () => {
    axios.get("http://localhost:3000/users/getTokenId").then((resp) => {
      console.log('++++++++', resp)
      this.setState({ tokenId: resp.data.data })
    }).catch((errrs) => {
      console.log(errrs)
    })
  }

  getAllData = async () => {
    axios.get('http://localhost:3000/users/getalldata').then((listdata) => {
      console.log("====", listdata.data.data)
      this.setState({ dataList: listdata.data.data })
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


  generateNftToken = () => {


    console.log("=====tokenid==", this.state.tokenId)
    this.state.contract.methods.mint(this.state.assetName, this.state.tokenId).send({ from: this.state.account })
      .once('receipt', (receipt) => {

        const data = new FormData()
        data.append(
          'artImage',
          this.state.selectedFile
        );
        data.append("assetName", this.state.assetName);
        data.append("price", this.state.price);
        data.append("description", this.state.description);
        data.append("owner", this.state.account);
        data.append("tokenId", this.state.tokenId)
        console.log("========", this.state.assetName, this.state.price, this.state.selectedFile, this.state.description, this.state.account, this.state.tokenId)
        let url = "http://localhost:3000/users/uploadImage";
        const config = {
          headers: { 'content-type': 'multipart/form-data' }
        }

        axios.post(url, data, config)
          .then((result) => {
            console.log("resultData", result);

          }).catch((errr) => {
            console.log(errr)
          })

        console.log("receipt", receipt)
      })




  };

  render() {

    return (
      <div style={{ textAlign: "center" }}>

        <h1>Nft Assets</h1>

        <label>Asset Name</label>
        <input type="text" value={this.state.assetName} onChange={this.handleAssetName} /><br></br><br></br>
        <label>Price</label>
        <input type="text" value={this.state.price} onChange={this.handlePrice} /><br></br><br></br>
        <label>Upload your img</label>
        <input type="file" onChange={this.onFileChange} /><br></br><br></br>
        <label>Description</label>

        <input type="text" value={this.state.description} onChange={this.handleDes} /><br></br><br></br>
        <button onClick={this.generateNftToken}> Generate Nft</button>
        <div>
          {this.state.dataList.map(list => (
            <div>
              <img style={{height:200,width:200}} src={"http://localhost:3000/" + list.artImage} />
              <p>{list.assetName}</p>
              <p>{list.price}</p>

            </div>
          ))}
        </div>

      </div>
    )
  }
}




export default App;
