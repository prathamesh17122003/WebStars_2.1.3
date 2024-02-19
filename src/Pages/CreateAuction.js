import React, { useEffect , useState} from 'react'
import Navbar from '../Components/Navbar'
import axios from 'axios';
import AuctionForm from '../Components/AuctionForm'

export default function CreateAuction() {
    const [login, setLogin] = useState(false);
    const [userId, setUserId] = useState('');

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get('http://localhost:5000/api/protected').then((response) => {
            if (response.data.login === "success") {
                setLogin(true)
                setUserId(response.data.userId)
            }
            console.log(response)
        })

    })
    return (
        <div>
            {login && <Navbar login="success" userId={userId} />}
            {!login && <Navbar login="denied" />}
            {login && <AuctionForm login="success" userId={userId} />}
            {!login && <AuctionForm login="denied" />}
        </div>
    )
}
