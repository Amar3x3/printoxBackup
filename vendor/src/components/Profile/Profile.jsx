import React, { useState,useEffect } from 'react'

import { Link } from 'react-router-dom';
import axios from 'axios';
const { ipcRenderer } = window.require('electron');
export default function Profile() {
  const [isAccount,setIsAccount]=useState(true);
  const [vendorData,setVendorData]=useState(null);
  const [accountData,setAccountData]=useState({vendorname:"",storename:"",email:"",mobile:"",address:"",upiid:"",pcids:[],noofpcs:0});
  const [passwordData,setPasswordData]=useState({oldpassword:"",newpassword:""});
  const [isPasswordEqual,setIsEqualPassword]=useState(false);
  const [storeCode,setStoreCode]=useState();
  useEffect(()=>{
    ipcRenderer.send('getlogindata')
    ipcRenderer.on('getlogindata',(event,data)=>{
        setVendorData(data);
        //setPeer(new Peer(vendorData.pcid));
        console.log(data);

    });},[]);
    useEffect(() => {
      if (vendorData) {
        ipcRenderer.send("login-successful",vendorData);
        setData();
      }
    }, [vendorData]);

  const setData=()=>{
    console.log(vendorData)
    if (vendorData) {
      setAccountData({
        vendorname: vendorData._doc.basicinfo.vendorname,
        storename: vendorData._doc.basicinfo.storename,
        email: vendorData._doc.basicinfo.email,
        mobile: vendorData._doc.basicinfo.mobile,
        address: vendorData._doc.basicinfo.address,
        upiid: vendorData._doc.basicinfo.upiid,
        pcids: vendorData._doc.basicinfo.pcids,
        noofpcs: vendorData._doc.basicinfo.noofpcs
      });
      setStoreCode(vendorData._doc.code);
    } 
  };

  const openAccount = ()=>{
    setIsAccount(true);
  };
  const openPassword = ()=>{
    setIsAccount(false);
  };
  const changeData = (event)=>{
    event.preventDefault();
    axios.put('http://127.0.0.1:8081/VendorContent/changeData',{
      changedata : accountData,
      id : vendorData._doc._id
    }).then((response)=>{
      
      if(response.status===200){
        console.log(response);
        setVendorData((prev)=>({...prev,_doc:response.data}));
      };
    }).catch((err)=>{
      console.log(err);
    })
  };
  const handlePassword=(event)=>{
    if(event.target.value===passwordData.newpassword){
      setIsEqualPassword(true);
    }
  }
  return (
    <>
    <div>
      <button onClick={openAccount}>Account</button>
      <br />
      <button onClick={openPassword}>Change Password</button>
      <br />
      <button>Logout</button>
      {
        (isAccount)?
        <div>
          <h2>Account</h2>
          <div>Store Code :- {storeCode}</div>
              <form action="">
                <label htmlFor="">Name :- <input type="text" value={accountData.vendorname} onChange={(event)=>{setAccountData((prev)=>({...prev,vendorname:event.target.value}))}}/></label>
                <br />
                <label htmlFor="">Store Name :- <input type="text" value={accountData.storename} onChange={(event)=>{setAccountData((prev)=>({...prev,storename:event.target.value}))}}/></label>
                <br />
                <label htmlFor="">Email :- <input type="text" value={accountData.email} onChange={(event)=>{setAccountData((prev)=>({...prev,email:event.target.value}))}} /></label>
                <br />
                <label htmlFor="">Mobile :- <input type="text" value={accountData.mobile} onChange={(event)=>{setAccountData((prev)=>({...prev,mobile:event.target.value}))}}/></label>
                <br />
                <label htmlFor="">Address :- <input type="text" value={accountData.address} onChange={(event)=>{setAccountData((prev)=>({...prev,address:event.target.value}))}}/></label>
                <br />
                <label htmlFor="">UPI ID :- <input type="text" value={accountData.upiid} onChange={(event)=>{setAccountData((prev)=>({...prev,upiid:event.target.value}))}}/></label>
                <br />
                <button onClick={changeData}>Save</button>
              </form>
              <div>
                <Link to={"/qrcode"}></Link>
              </div>
        </div>
        :
        <div>
          <h2>Password</h2>
          <form action="">
            <label htmlFor="">Current Password :- <input type="text" onChange={(event)=>{setPasswordData((prev)=>({...prev,oldpassword:event.target.value}))}}/></label>
            <br />
            <label htmlFor="">New Password :- <input type="text" onChange={(event)=>{setPasswordData((prev)=>({...prev,newpassword:event.target.value}))}}/></label>
            <br />
            <label htmlFor="">Re-enter New Password :- <input type="text" onChange={handlePassword} /></label>
            <br />
            {!isPasswordEqual && <p>Password does not match</p>}
            <br />
            <button>Done</button>
          </form>
        </div>
      }
    </div>
    </>
  )
}
