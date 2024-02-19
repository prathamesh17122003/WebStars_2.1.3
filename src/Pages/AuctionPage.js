import React, { useEffect , useState} from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios';
import {Link} from "react-router-dom";

export default function AuctionPage() {

    let box = document.getElementById('cardets');
    let comments = document.getElementById('comments');
    let boxingStyle = {
        width:"100%",
        height:"100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "none"
    }
    function closeCar() {
        box.style.display = "none";
    }

    function  opencar(){
        box.style.display = "block"; 
    }

    function closecomments() {
        comments.style.display = "none";
    }

    function  opencomments(){
        comments.style.display = "block"; 
    }

    const [login, setLogin] = useState(false);
    const [userId, setuserId] = useState(false);
    const [currentVal, setcurrentVal] = useState(0);
    const [Comments, setComments] = useState([]);
    const [commentval, setcommentsval] = useState('');
    const [totalBids, settotalBids] = useState(0);
    const [selfBids, setselfBids] = useState(0);
    // Get the query parameters from the current URL
    const queryParams = new URLSearchParams(window.location.search);

    // Get the value of a specific parameter
    const paramValue = queryParams.get('paramName');

    // Example: Get the value of the 'id' parameter
    const id = queryParams.get('id');

    const[sliderAuction, setsliderAuction] = useState([])

    axios.defaults.withCredentials = true;
    useEffect(()  => {
        axios.get('http://localhost:5000/api/protected').then((response) => {
            if (response.data.login !== "success") {
                window.location.href = "http://localhost:3000/Login"
            }
            setuserId(response.data.userId)
        })

    }, [])

    useEffect(() => {
        if (userId) {
            axios.get(`http://localhost:5000/api/getAuctionDets?id=${id}&uid=${userId}`).then((response) => {
                setsliderAuction(response.data.records);
                settotalBids(response.data.totalBids);
                setselfBids(response.data.selfBids)
                setComments(response.data.comments)
                console.log(response.data.comments)
                if (response.data.records.increment > 0) {
                    setcurrentVal(response.data.records.currentVal + response.data.records.increment)
                }
                else{
                    setcurrentVal(response.data.records.currentVal)
                }
            });
        }
    }, [userId]);


    async function addBidForm(e) {
        e.preventDefault();
        axios.post(`http://localhost:5000/api/placeBid`, {
            uid: userId,
            aid: id,
            newVal: currentVal,
            bidLeft: sliderAuction.maxBids - 1
        }).then((response) => {
            if (response.data.status === 'ok') {
                alert("Your bid has been placed")
                // window.location.href = `http://localhost:3000/Home`
            }
        });
    }

    async function addComment(e) {
        e.preventDefault();
        console.log(commentval)
        axios.post(`http://localhost:5000/api/addComment`, {
            uid: userId,
            aid: id,
            commentval: commentval
        }).then((response) => {
            if (response.data.status === 'ok') {
                alert("Your comment has been posted")
                // window.location.href = `http://localhost:3000/Home`
            }
        });
    }

    return (
        <div className='bg-dark'>
            {login && <Navbar login="success" />}
            {!login && <Navbar login="denied" />}
            
            <div className='d-flex'>
                <div className='text-white w-100'>
                    <div className='d-flex justify-content-evenly'>
                        <div className='p-5 col-7'>
                            <div id="carouselExampleCaptions" className="carousel slide rounded-4 overflow-hidden">
                                <div className="carousel-inner">
                                    <div key={sliderAuction.id} to="https://youtube.com" className="carousel-item active">
                                        <img src={`http://localhost:5000/images/${sliderAuction.image}`} className="d-block w-100" alt="..." />
                                        
                                    </div>
                                </div>
                                {/* <hr className='m-0' style={{boxShadow: "black 15px 20px 137px 300px", opacity: "1", position:"sticky"}}/> */}
                            </div>
                        </div>
                        <div className='col-4 py-5 pe-2 d-flex flex-column fs-5'>
                            <h1>Auction Details</h1>
                            <div className='my-3'>
                                <span className=''>Title: </span>
                                <span className='text-secondary'>
                                    {sliderAuction.title}
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Description: </span>
                                <span className='text-secondary'>
                                    {sliderAuction.description}
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Starting price: </span>
                                <span className='text-secondary'>
                                    Rs. {sliderAuction.startPrice}/-
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Current price: </span>
                                <span className='text-secondary'>
                                    Rs. {sliderAuction.currentVal}/-
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Auction Type: </span>
                                <span className='text-secondary'>
                                    {sliderAuction.increment !== 0 ? `Incremental Auction` : `Open Auction`}
                                </span>
                            </div>
                            {
                                sliderAuction.increment !== 0 ?
                                <div className='my-3'>
                                    <span className=''>Predefined increment: </span>
                                    <span className='text-secondary'>
                                        {sliderAuction.increment}
                                    </span>
                                </div>:
                                <div></div>
                            }
                            <div className='my-3'>
                                <span className=''>Auction Starts: </span>
                                <span className='text-secondary'>
                                    {
                                        sliderAuction.startTime
                                    }
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Auction Ends: </span>
                                <span className='text-secondary'>
                                    {
                                        sliderAuction.endTime
                                    }
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Bids per user: </span>
                                <span className='text-secondary'>
                                    {
                                        sliderAuction.maxBids
                                    }
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Total bids placed: </span>
                                <span className='text-secondary'>
                                    {totalBids}
                                </span>
                            </div>
                            <div className='my-3'>
                                <span className=''>Bids placed by you: </span>
                                <span className='text-secondary'>
                                    {selfBids}
                                </span>
                            </div>
                            <button onClick={opencar} className='btn btn-success'>Place Bid</button>
                        </div>
                    </div>
                    <div className='my-5 px-4'>
                        <hr />
                        <div className='d-flex'>
                            <h3>Comments</h3>
                            <span><button onClick={opencomments} className='btn btn-success ms-5'>Add Comment</button></span>
                        </div>
                        {Comments.map((element, index) => (
                            <div key={index} className='my-4'>
                                <div className='fs-5'>{element.name}</div>
                                <div className='text-secondary'>
                                    {element.comment}
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            <div className="position-fixed start-0 top-0" id="cardets" style={boxingStyle}>
                <div className="position-fixed start-50 top-50 translate-middle col-5">
                    <form onSubmit={addBidForm} className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <div className="d-flex flex-column justify-content-center w-100 bg-light rounded border border-dark shadow p-4 pt-3" style={{maxWidth:"900px"}}>
                            <div className="d-flex justify-content-end">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={closeCar} width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" style={{cursor: "pointer"}}>
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>
                            </div>
                            {
                                sliderAuction.increment !== 0 ?
                                <div className="mb-2">
                                    <label>Bidding Amount: </label>
                                    <input type="number" value={`${sliderAuction.increment+sliderAuction.currentVal}`} className="text-black w-100 form-control border bg-light border-dark" name="amount" disabled required />
                                </div>:
                                <div className="mb-2">
                                    <label>Bidding Amount: </label>
                                    <input type="number" onChange={(e) => setcurrentVal(e.target.value)} className="text-black w-100 form-control border bg-light border-dark" name="amount" required />
                                </div>
                            }
                            <button type="Submit" className="btn btn-danger col-5 mx-auto mt-3 mb-4">Confirm Bid</button>
                        </div>
                    </form>
                </div>
            </div>


            <div className="position-fixed start-0 top-0" id="comments" style={boxingStyle}>
                <div className="position-fixed start-50 top-50 translate-middle col-5">
                    <form onSubmit={addComment} className="w-100 d-flex flex-column justify-content-center align-items-center">
                        <div className="d-flex flex-column justify-content-center w-100 bg-light rounded border border-dark shadow p-4 pt-3" style={{maxWidth:"900px"}}>
                            <div className="d-flex justify-content-end">
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={closecomments} width="20" height="20" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16" style={{cursor: "pointer"}}>
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                </svg>
                            </div>
                                <div className="mb-2">
                                    <label>Comment: </label>
                                    <input type="text" onChange={(e) => setcommentsval(e.target.value)} className="text-black w-100 form-control border bg-light border-dark" name="amount" required />
                                </div>
                            <button type="Submit" className="btn btn-danger col-5 mx-auto mt-3 mb-4">Comment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
