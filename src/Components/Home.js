import React from "react";
import "../App.css";
import api from "../api";
import Header from "./Header";
import Web3 from "web3";
import axios from "axios";
import Loading from "react-fullscreen-loading";
import swal from "sweetalert";
// import Web3 from 'web3';
// import asset from "../abis/Assets.json"
// import Modal from 'react-modal';
// import QRCode from "react-qr-code";
// import { ethers } from "ethers";
// import config from '../config'
// require('dotenv').config()

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ReactPaginate from "react-paginate";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
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
      ipfsHash: "",
      totalitem: undefined,

      offset: 0,
      data: [],
      perPage: 5,
      currentPage: 0,

      check1: true,

      sort: "",
      products: [],
      filteredProducts: [],

      totalData: [],
      totalDatas: [],
    };

    this.handlePageClick = this.handlePageClick.bind(this);

    this.handleSortCheapest = this.handleSortCheapest.bind(this);
    this.handleSortExpensive = this.handleSortExpensive.bind(this);
    this.handleSortNew = this.handleSortNew.bind(this);
    this.handleSortOld = this.handleSortOld.bind(this);


    this.handleSort = this.handleSort.bind(this);
    this.handleSortN = this.handleSortN.bind(this);
  }

  async componentDidMount() {
    await this.getAllData();
    await this.loadWeb3();
  }

  loadWeb3 = async () => {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    } catch (err) {
      // console.log("loadweb3catchblock", err)
      swal({ title: "please install metamask", icon: "error" });
    }
  };

  //List of all data in table;
  getAllData = async () => {
    axios
      .get(api.API_URL + "getalldata")
      .then((listdata) => {
        console.log("getalldatalist", listdata.data.data.length);


        this.setState(
          {
            originalData : listdata.data.data,
            totalitem: listdata.data.data.length,
            totalData: listdata.data.data,

            dataList: listdata.data.data.slice(
              this.state.offset,
              this.state.offset + this.state.perPage
            ),
            // totalData: listdata.data.data,
            // totalData:listdata.data.data.sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ,

            //  sort : this.state.dataList.sort((a,b) => (this.state.sort === 'lowest')? (a.price < b.price?1:-1):(a.price > b.price?1:-1) ),

            soldstatus: listdata.data.data.soldStatus,
            pageCount: Math.ceil(
              listdata.data.data.length / this.state.perPage
            ),
          },
          () => {
            console.log(
              "this.state",
              this.state.offset,
              this.state.dataList.length,
              this.state.offset + this.state.perPage
            );
            // console.log("is it sorting", listdata.data.data.sort((a,b) => a.createdAt > b.createdAt) )
            console.log(
              "dates sort",
              listdata.data.data.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
              )
            );
          }
        );
      })
      .catch((errs) => {
        // console.log("alldata_api_catchblock",errs)
      });
  };

  notSoldClick = (data) => {
    console.log("shomodal=====", data);
    var jwttoken = sessionStorage.getItem("token");
    if (jwttoken) {
      this.props.history.push("/Detail", {
        tokenID: data,
      });
    } else {
      swal({ title: "Unauthorized access! Login first", icon: "error" });
    }
  };

  //  toggleSortDateNew () {
  //    const {dataList} = this.state
  //    let newList = dataList
  //     newList = dataList.sort((a,b) => a.createdAt < b.createdAt)
  //     this.setState ({
  //       dataList : newList
  //     })

  // }

  handleSortCheapest = () => {
    this.setState({
      sortValue: this.state.dataList.sort(
        (a, b) => parseFloat(a.price) - parseFloat(b.price)
      ),
    });
  };

  // Sort price high to low
  handleSortExpensive = () => {
    this.setState({
      sortValue: this.state.dataList.sort(
        (a, b) => parseFloat(b.price) - parseFloat(a.price)
      ),
    });
  };

  handleSort = (ascending) => {
    this.resetPage();

    let totaldata = this.state.totalData;
    let x = ascending
      ? this.state.totalData.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        )
      : this.state.totalData.sort(
          (a, b) => parseFloat(b.price) - parseFloat(a.price)
        );
    this.setState({
      totaldata: this.state.dataList,
      dataList: this.state.totalData.slice(
        0,
        this.state.perPage
      ),
      // totalData:this.state.totalData.sort( (a, b) => new Date(b.createdAt) - new Date(a.createdAt)) ,

      pageCount: Math.ceil(this.state.totalData.length / this.state.perPage),
    });
  };

  handleSortNew = () => {
    this.setState({
      sortV: this.state.totalData.sort((a, b) => a.createdAt - b.createdAt),
    });
  };

  // Sort createdAt old
  handleSortOld = () => {
    this.setState({
      sortV: this.totalData.sort((a, b) => b.createdAt - a.createdAt),
    });
  };

  resetPage = () => {
    this.setState({
      currentPage:0,
       offset:0,
    });
  };

  handleSortN = (ascending) => {

    this.resetPage();
    let totaldata = this.state.totalData;

    let y = ascending
      ? this.state.totalData.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
      : this.state.totalData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        
    this.setState({
      totaldata: this.state.dataList,

      dataList: this.state.totalData.slice(
        0,
        this.state.perPage
      ),
    });
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
        dataList: this.state.totalData.slice(
          offset,
          offset + this.state.perPage
        ),

      }
      
    );
  };






  render() {
    console.log("props value", this.props);
    return (
      <>
        <Header
          className="header-main"
          dataList={this.state.dataList}
          fromScreen="Home"
        />
        
          <div style={{ textAlign: "center", marginTop: "75px" }}>
            {this.state.loader ? (
              <Loading loading background="#ffffff00" loaderColor="#3498db" />
            ) : (
              <div>
              <div className="container">
              <div className="main-body">
                <section className="browse-product-area page-paddings">
                  <div className="container">
                    <div className="row">
                      <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12">
                        <div className="browse-product-filter">
                          <div className="filter-box">
                            <h3 className="theme-title">Categories</h3>
                            <div className="filter-menu">
                              <ul>
                                <li>
                                  <input
                                    className="styled-checkbox"
                                    id="styled-checkbox-1"
                                    type="checkbox"
                                    checked={this.state.check1}
                                  />
                                  <label for="styled-checkbox-1">
                                    <span>Art</span>
                                  </label>
                                </li>
                              </ul>
                            </div>
                          </div>
                          
                            <div className="filter-box">
                              <h3 className="theme-title">Sort by</h3>
                              <form>
                              <ul>
                                <li>
                                  
                                  <label><input
                                    type="radio"
                                    value="value1"
                                    name="mybtn"
                                    onChange={() => this.handleSortN(false)}
                                  />   Newest</label>
                                </li>
                                <li>
                                  
                                  <label> <input
                                    type="radio"
                                    value="value2"
                                    name="mybtn"
                                    onChange={() => this.handleSortN(true)}
                                  />  Oldest</label>
                                </li>
                                <li>
                                  
                                  <label> <input
                                    type="radio"
                                    value="value3"
                                    name="mybtn"
                                    onChange={() => this.handleSort(true)}
                                  />  Price - Low to high</label>
                                </li>
                                <li>
                                  
                                  <label><input
                                    type="radio"
                                    value="value4"
                                    name="mybtn"
                                    onChange={() => this.handleSort(false)}
                                  />  Price - High to low</label>
                                </li>
                              </ul>
                              </form>

                            </div>
                        </div>
                      </div>

                      <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
                        <div className="browse-product-top">
                          <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                              <div className="browse-product-left">
                                <p>
                                  Showing: {this.state.dataList.length}/
                                  {this.state.totalitem}{" "}
                                </p>
                              </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                              <div className="browse-product-right clearfix"></div>
                            </div>
                          </div>
                        </div>

                        <div className="browse-product-box">
                          <div className="tab-content">
                            <div
                              className="tab-pane active"
                              id="item-grid"
                              role="tabpanel"
                            >
                              <div className="row">
                                {this.state.dataList.map((list) =>
                                  list.soldStatus === "1" ? (
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                    <div className="item-group">
                                        <div className="item-group-content">
                                          <div className="items-like">
                                            <i className="far fa-heart"></i>
                                          </div>
                                          <div className="item-group-avtar">
                                            <img
                                              style={{
                                                height: 100,
                                                width: 200,
                                              }}
                                              src={api.IPFS_URL + list.ipfsHash}
                                              alt=""
                                            />
                                          </div>
                                          <h3 className="theme-title">
                                            <a href="buy-detail.html">
                                              {list.assetName}
                                            </a>
                                          </h3>
                                          
                                          <p className="theme-description">
                                          <h2 className="item-price text-muted">{list.price} BNB</h2>
                                          </p>
                                          <p className="theme-description">
                                            {" "}
                                            Sold{" "}
                                          </p>

                                          <div className="item-group-btn">
                                            <a
                                              className="theme-btn btn-disabled  text-muted disabled"
                                              onClick={() =>
                                                this.notSoldClick(list.tokenId)
                                              }
                                            >
                                              Sold Out
                                            </a>
                                            <a
                                              className="item-detail-btn"
                                              href="buy-detail.html"
                                            >
                                              <i className="fas fa-info-circle"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                      <div className="item-group">
                                        <div className="item-group-content">
                                          <div className="items-like">
                                            <i className="far fa-heart"></i>
                                          </div>
                                          <div className="item-group-avtar">
                                            <img
                                              style={{
                                                height: 100,
                                                width: 200,
                                              }}
                                              src={api.IPFS_URL + list.ipfsHash}
                                              alt=""
                                            />
                                          </div>
                                          <h3 className="theme-title">
                                            <a href="buy-detail.html">
                                              {list.assetName}
                                            </a>
                                          </h3>
                                          
                                          <p className="theme-description">
                                          <h2 class="item-price">{list.price} BNB</h2>
                                          </p>
                                          <p className="theme-description">
                                            {" "}
                                            Not Sold{" "}
                                          </p>

                                          <div className="item-group-btn">
                                            <a
                                              className="theme-btn"
                                              onClick={() =>
                                                this.notSoldClick(list.tokenId)
                                              }
                                            >
                                              Buy Now
                                            </a>
                                            <a
                                              className="item-detail-btn"
                                              href="buy-detail.html"
                                            >
                                              <i className="fas fa-info-circle"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div
                              className="tab-pane"
                              id="item-list"
                              role="tabpanel"
                            >
                              <div className="row">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                  <div className="item-group item-group-list"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              </div>


              <div className="page">
          <ReactPaginate
            previousLabel={"PREV"}
            nextLabel={"NEXT"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            forcePage={this.state.currentPage}
            
          />
        </div>

        <footer className="footer-main">
          <div className="footer-top">
            <div className="container">
              <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="footer-widget">
                    <a href="index.html">
                      <img src="assets/images/logo-white.png" alt="" />
                    </a>
                    <p className="theme-description">
                      We are one of the best pre-designed template providers,
                      for all the niches with more than 800 designs.{" "}
                    </p>
                    <div className="footer-links clearfix">
                      <div className="footer-icon-box">
                        <a href="" title="Facebook">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </div>
                      <div className="footer-icon-box">
                        <a href="" title="Twitter">
                          <i className="fab fa-twitter"></i>
                        </a>
                      </div>
                      <div className="footer-icon-box">
                        <a href="" title="Linkedin">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12">
                  <div className="footer-widget">
                    <h3 className="theme-title">My account</h3>
                    <div className="footer-menu-services">
                      <ul className="menu-service-menu">
                        <li>
                          <a href="create-store.html">Create a Store</a>
                        </li>
                        <li>
                          <a href="min-item.html">List an Item for sale</a>
                        </li>
                        <li>
                          <a href="login.html">My Profile</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12">
                  <div className="footer-widget">
                    <h3 className="theme-title">Need Help?</h3>
                    <div className="footer-menu-services">
                      <ul className="menu-service-menu">
                        <li>
                          <a href="contact.html">Help and support</a>
                        </li>
                        <li>
                          <a href="faq.html">FAQ</a>
                        </li>
                        <li>
                          <a href="contact.html">Contact us</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-2 col-md-6 col-sm-6 col-12">
                  <div className="footer-widget">
                    <h3 className="theme-title">Buy an Item</h3>
                    <div className="footer-menu-services">
                      <ul className="menu-service-menu">
                        <li>
                          <a href="browse.html">Browse Digital Items</a>
                        </li>
                        <li>
                          <a href="browse.html">Browse Stores</a>
                        </li>
                        <li>
                          <a href="browse.html">Where to buy NFTs</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                  <div className="footer-widget">
                    <h3 className="theme-title">Go pro</h3>
                    <div className="footer-menu-services">
                      <ul className="menu-service-menu">
                        <li>
                          <a href="go-pro.html">Premium services</a>
                        </li>
                        <li>
                          <a href="privacy-policy.html">Privacy Policy</a>
                        </li>
                        <li>
                          <a href="terms-of-use.html">Terms of use</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="copyright-text text-center">
                    <p>
                      Copyright 2021 <a href="index.html">NFT Marketplace</a>{" "}
                      All Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>






              </div>
            )}
          </div>
        
       
      </>
    );
  }
}

export default Home;
