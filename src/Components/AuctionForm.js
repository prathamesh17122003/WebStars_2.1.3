import React, { useState } from 'react'
import "./AuctionForm.css";
import axios from 'axios';

export default function AuctionForm(props) {
    const[file, setFile] = useState('');
    const [formData, setFormData] = useState({
        uid: props.userId,
        title: '',
        description: '',
        category: '',
        startingPrice: 0,
        reservePrice: 0,
        maxBids: 0,
        auctionStarts: '',
        auctionEnds: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        // console.log(value)
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    async function handleCreateAuction(e) {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
            console.log(value)
        });
        
        console.log(file)

        try {
            axios.post('http://localhost:5000/api/createAuction', formDataToSend).then((response) => {
                console.log(response.data)
            })

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='Formbody px-4'>
            <h1>Create Auction</h1>
            <form onSubmit={handleCreateAuction} className='p-4 border rounded' encType="multipart/form-data">
                <label htmlFor="title">Auction Title:</label>
                <input type="text" id="title" onChange={handleChange} name="title" required />

                <label htmlFor="description">Description:</label>
                <textarea id="description" name="description" onChange={handleChange} rows="4" cols="50" required></textarea>

                <label htmlFor="category">Category:</label>
                <select id="category" name="category" onChange={handleChange} required>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="collectibles">Collectibles</option>
                </select>

                <label htmlFor="startingPrice">Starting Price:</label>
                <input type="number" id="startingPrice" onChange={handleChange} name="startingPrice" min="0" required />

                <label htmlFor="reservePrice">Reserve Price:</label>
                <input type="number" id="reservePrice" onChange={handleChange} name="reservePrice" min="0" />

                <label htmlFor="maxBids">Maximum bids per user:</label>
                <input type="number" id="maxBids" onChange={handleChange} name="maxBids" min="0" />

                <div className='d-flex justify-content-between mb-3'>
                    <div>
                        <label htmlFor="auctionStarts">Auction Starts:</label>
                        <input type="datetime-local" onChange={handleChange} id="auctionStarts" name="auctionStarts" required />
                    </div>
                    <div>
                        <label htmlFor="auctionEnds">Auction Ends:</label>
                        <input type="datetime-local" onChange={handleChange} id="auctionEnds" name="auctionEnds" required />
                    </div>
                </div>

                <label htmlFor="file">Images:</label>
                <input type="file" id="file" name="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*" required /><br />

                <button className='btn btn-success mt-3 w-100' type="submit" value="Create Auction" >Create Auction</button>
            </form>
        </div>
    )
}
