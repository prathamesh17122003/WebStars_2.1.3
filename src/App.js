import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Landing from "./Pages/Landing";
import CreateAuction from "./Pages/CreateAuction";
import AuctionPage from "./Pages/AuctionPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/home" element={<Landing/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route index path="/Login" element={<Login/>} />
          <Route path="/createAuction" element={<CreateAuction/>} />
          <Route path="/AuctionPage" element={<AuctionPage/>} />
        </Routes>
      </Router>
  );
}

export default App;
