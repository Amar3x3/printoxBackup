
import './App.css';
import React,{ useState } from 'react';
import VendoorPeer from './components/VendorPeer/VendorPeer';
import LoginSignup from './components/LoginSignup/LoginSignup';
import { HashRouter,Route,Routes} from 'react-router-dom';
import QRCodePage from './components/QRCode/QRCodePage';
import Navbar from './components/Navbar/Navbar';
import Profile from './components/Profile/Profile';
import Setting from './components/Settings/Setting';

const { ipcRenderer } = window.require("electron");

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = () => {
    setIsLoggedIn(true);
  };
  return (
    <>
      {/* <VendoorPeer></VendoorPeer> */}

      {(isLoggedIn)?
      (<HashRouter>
        <Navbar/>
      <Routes>
        <Route path='/' exact={true} Component={VendoorPeer}></Route>
        <Route path='/qrcode' exact={true} Component={QRCodePage}></Route>
        <Route path='/profile' exact={true} Component={Profile}></Route>
        <Route path='/setting' exact={true} Component={Setting}></Route>

      </Routes>
      </HashRouter>):
      (<LoginSignup onLogin={handleLogin}/>)
}
    </>
  );
}

export default App;
