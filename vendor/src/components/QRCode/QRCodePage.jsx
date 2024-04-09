import React,{useEffect} from 'react'
import QRCode from 'qrcode.react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

export default function QRCodePage() {

  const [vendorData,setVendorData]=useEffect({});

  
  ipcRenderer.on("signup-successful",(event,data)=>{
      setVendorData(data);
    });
 

  return (
    <>
    <h1>
        Printox
    </h1>
    <br />
    <Link to={"/profile"}>Back</Link>
    <br />
    <QRCode value={vendorData.code}></QRCode>
    </>
  )
}
