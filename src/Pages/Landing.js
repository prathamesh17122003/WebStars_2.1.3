import React, { useEffect , useState} from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios';
import {Link} from "react-router-dom";

export default function Landing() {
    const [login, setLogin] = useState(false);
    const[sliderAuction, setsliderAuction] = useState([]);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5000/api/protected').then((response) => {
            if (response.data.login === "success") {
                setLogin(true)
            }
        })

    }, [])
    useEffect(() => {
        axios.get('http://localhost:5000/api/getLiveSlider').then((response) => {
            let result = response.data
            // result = result[0]
            setsliderAuction(response.data);
            console.log(response.data)
        });
    }, []);
    return (
        <div className='bg-dark'>
            {login && <Navbar login="success" />}
            {!login && <Navbar login="denied" />}
            
            <div className='d-flex'>
                <div className='text-white w-100'>
                    <div className='d-flex justify-content-evenly'>
                        <div className='p-5 col-7'>
                            <div id="carouselExampleCaptions" className="carousel slide rounded-4 overflow-hidden">
                                <div className="carousel-indicators">
                                    {sliderAuction.map((element, index) => (
                                        <button key={index} type="button" data-bs-target="#carouselExampleCaptions" className={index === 0 ? "active": ""} aria-current={index === 0 ? "true": ""} data-bs-slide-to={index} aria-label={index}></button>
                                    ))}
                                    
                                </div>
                                <div className="carousel-inner">
                                    {
                                        sliderAuction.map((element, index) => (
                                            <Link key={element.id} to={`/AuctionPage?id=${element.id}`} className={index === 0 ? "carousel-item active": "carousel-item"}>
                                                <img src={`http://localhost:5000/images/${element.image}`} className="d-block w-100" alt="..." />
                                                <div className="carousel-caption d-none d-md-block z-1">
                                                    <h5>{element.title}</h5>
                                                    <p>{element.description}</p>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                                <hr className='m-0' style={{boxShadow: "black 15px 20px 137px 300px", opacity: "1", position:"sticky"}}/>
                            </div>
                        </div>
                        {/* <div className='p-4'>
                            <div className='d-flex rounded-4 overflow-hidden'>
                                <hr className='m-0' style={{boxShadow: "black 0px 0px 250px 300px", zIndex: "1", opacity: "1"}}/>
                                <img className='w-100' src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" alt="" />

                            </div>
                        </div> */}
                        <div className='col-3 py-4 pe-2 d-flex flex-column justify-content-evenly'>
                            <Link to="https://youtube.com" className='p-3 my-4 btn btn-secondary d-flex'>
                                <div>
                                    <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className='rounded' style={{height: "70px"}} alt="" />
                                </div>
                                <div>Title of the auction</div>
                            </Link>
                            <Link to="https://youtube.com" className='p-3 my-4 btn btn-secondary d-flex'>
                                <div>
                                    <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className='rounded' style={{height: "70px"}} alt="" />
                                </div>
                                <div>Title of the auction</div>
                            </Link>
                            <Link to="https://youtube.com" className='p-3 my-4 btn btn-secondary d-flex'>
                                <div>
                                    <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className='rounded' style={{height: "70px"}} alt="" />
                                </div>
                                <div>Title of the auction</div>
                            </Link>
                            <Link to="https://youtube.com" className='p-3 my-4 btn btn-secondary d-flex'>
                                <div>
                                    <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className='rounded' style={{height: "70px"}} alt="" />
                                </div>
                                <div>Title of the auction</div>
                            </Link>
                        </div>
                    </div>
                    <div className='my-5 px-4'>
                        <hr />
                        <h3>New Auction</h3>
                        <div className='d-flex justify-content-evenly my-4'>
                            {/* one card  */}
                            <div className="card bg-dark border border-0 m-4" style={{width: "20rem"}}>
                                <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text text-secondary my-0">25 Bids</p>
                                    <p className="card-text text-secondary">Max Bid: Rs.100000/-</p>
                                    <Link to="https://youtube.com" className="btn btn-primary">Apply Bid</Link>
                                </div>
                            </div>
                            <div className="card bg-dark border border-0 m-4" style={{width: "20rem"}}>
                                <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text text-secondary my-0">25 Bids</p>
                                    <p className="card-text text-secondary">Max Bid: Rs.100000/-</p>
                                    <Link to="https://youtube.com" className="btn btn-primary">Apply Bid</Link>
                                </div>
                            </div>
                            <div className="card bg-dark border border-0 m-4" style={{width: "20rem"}}>
                                <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text text-secondary my-0">25 Bids</p>
                                    <p className="card-text text-secondary">Max Bid: Rs.100000/-</p>
                                    <Link to="https://youtube.com" className="btn btn-primary">Apply Bid</Link>
                                </div>
                            </div>
                            {/* <div className="card bg-dark border border-0 m-4" style={{width: "18rem"}}>
                                <img src="https://www.elegantthemes.com/blog/wp-content/uploads/2020/10/featured-domain-name-auction.png" className="card-img-top" alt="..."/>
                                <div className="card-body">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text text-secondary my-0">25 Bids</p>
                                    <p className="card-text text-secondary">Max Bid: Rs.100000/-</p>
                                    <a href="#" className="btn btn-primary">Apply Bid</a>
                                </div>
                            </div> */}
                        </div>
                        <hr />
                    </div>
                </div>
            </div>
        </div>
    )
}
