import React, { Component } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import asset from "../abis/Assets.json"
import api from '../api'
import config from '../config'
import Loading from 'react-fullscreen-loading';
import swal from 'sweetalert';


const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
var contractAddress = config.Contract_address



class Createassets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            assetName: "",
            price: "",
            description: "",
            tokenId: "",
            ipfsHash: "",
            loader:false
        }
    }

    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
    };

    loadBlockchainData = async () => {
        try {

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

        } catch (err) {
            swal(err,"error")
        }

    }


    loadWeb3 = async () => {

        try {

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
        } catch (err) {
            console.log("errr", err)
            swal({title:"please install metamask",icon:"error"})
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
        var token = localStorage.getItem('token')
        console.log("token===========", token)
        if (this.state.assetName === "" || this.state.assetName === null) {
            return swal({title:"Enter your asset name", icon:"error"});
        } else if (this.state.price === "" || this.state.price === null) {
            return swal({title:"Enter your pay amount",icon:"error"})
        } else if (this.state.selectedFile === "" || this.state.selectedFile === null) {
            return swal({title:"please select your assets image",icon:"error"})
        } else if (this.state.description === "" || this.state.description === null) {
            return swal({title:"Enter description",icon:"error"})
        } else {
            this.setState({ loader: true })
            var file = this.state.selectedFile
            let reader = new window.FileReader()
            reader.readAsArrayBuffer(file)
            try {
                reader.onloadend = async () => {
                    console.log("clicked reader", reader)
                    const buffer = await Buffer.from(reader.result);
                    await ipfs.add(buffer, (err, ipfsHash) => {
                        console.log("imagehash&err", err, ipfsHash[0].hash);
                        //setState by setting ipfsHash to ipfsHash[0].hash 
                        this.setState({ ipfsHash: ipfsHash[0].hash });
                        const options = {
                            headers: { 'authToken': token }
                        };
                        axios.get(api.API_URL + "getTokenId", options).then((resp) => {
                            console.log('++++++++api=====url', resp)
                            var tokenId = resp.data.data
                            this.state.contract.methods.mint(this.state.assetName, tokenId, this.state.ipfsHash).send({ from: this.state.account })
                                .once('receipt', (receipt) => {
                                    const data = new FormData()
                                    data.append("assetName", this.state.assetName);
                                    data.append("price", this.state.price);
                                    data.append("description", this.state.description);
                                    data.append("owner", this.state.account);
                                    data.append("tokenId", tokenId)
                                    data.append("ipfsHash", this.state.ipfsHash)
                                    console.log("========hashinside", this.state.ipfsHash)
                                    let url = api.API_URL + "uploadImage";
                                    const config = {
                                        headers: {
                                            'content-type': 'multipart/form-data',
                                            'authtoken': token,
                                        }
                                    }
                                    axios.post(url, data, config)
                                        .then((result) => {
                                            this.setState({ loader: false })
                                            this.props.history.push("/")

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
            catch (exception) {
                console.log('=====exec', exception)
                this.setState({ loader: false })
            }
        }
    };

    render() {
        return (
            <>

                {this.state.loader ? (<Loading loading background="#ffffff00" loaderColor="#3498db" />) : (
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

                )}

            </>
        )
    }
}

export default Createassets;