import React, { Component } from 'react';
import axios from 'axios';
import api from '../api'
import config from '../config'
import '../App.css';

import Header from '../Components/Header'



class Details extends React.Component {
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



    componentDidMount() {
        console.log('this.props', this.props.location.state.tokenID)
        this.setState({ tokenId: this.props.location.state.tokenID })
        axios.post(api.API_URL + 'getsingledata', { "tokenId": this.props.location.state.tokenID }).then((respo) => {
            console.log("========respo", respo)
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
    }


    render() {
        console.log('this.props', this.props.location.state, "========")


        return (
            <>
                <Header />
                <div className="container">
                    <div className="singlemodaldetail">
                    <div class="row">
                        
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
                                    <button className="btn btn-primary" onClick={this.etherAddress}>Buy</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
                
            </>

        )
    };
};



export default Details;
