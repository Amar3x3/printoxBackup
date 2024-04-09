import React, { useEffect, useState } from "react";
import axios from "axios";
const { ipcRenderer } = window.require('electron');


export default function LoginSignup(props) {
  const [loginForm, setLoginForm] = useState({ email: "", password: "", rememberme: false });
  const [singupForm, setSignupForm] = useState({ name: "", storename: "", mobile: "", email: "", password: "", address: "", noofpcs: 0, upiid: "" });
  const [panelTransitionFlag, setPanelTransitionFlag] = useState(false);

  useEffect(() => {
    ipcRenderer.send('get-creds', 'credentials')
    ipcRenderer.on('get-creds-data', (event, data) => {
      console.log(data);
      setLoginForm({ email: data.email, password: data.password });
    });
  }, [])

  const onLogin = (event) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8081/VendorContent/Login', loginForm)
      .then((response) => {
        console.log(response.data);
        if (loginForm.rememberme) {
          ipcRenderer.send('send-creds', loginForm);
        }
        props.onLogin();
        ipcRenderer.send("login-successful", response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const onSignup = (event) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8081/VendorContent/NewVendor', singupForm)
      .then((response) => {
        console.log(response.data);
        ipcRenderer.send("signup-successful", response.data);
        props.onLogin();
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleTransition=()=>{
    console.log('transition trig')
    setPanelTransitionFlag(!panelTransitionFlag)
  }

  return (
    <>
    <div className="fixed-logo logo">
      <img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425020/PrintOx/Group_1_wefwfd.png" alt="" />
    </div>
      <div className="container-loginSignup">
        <div className={`Login-container ${panelTransitionFlag ? 'big-cont-panel':'small-cont-panel'}`}>
          {panelTransitionFlag ? <div className="main-form">
            <h2 className="panel-title">Login</h2>
            <form id="loginform">
              <label for=""><input id="logemail" value={loginForm.email} placeholder="Email" name="email" onChange={(event) => { setLoginForm((prev) => ({ ...prev, email: event.target.value })) }} required /></label>
              <br />
              <label for=""><input id="logpassword" value={loginForm.password} placeholder="Password" name="password" onChange={(event) => { setLoginForm((prev) => ({ ...prev, password: event.target.value })) }} required /></label>
              <br />
              <label for="">Remember me <input type="checkbox" id="remembercheck" onChange={(event) => { setLoginForm((prev) => ({ ...prev, rememberme: !prev.rememberme })) }} /></label>
              <br />
              <button className="transitionBtn" id="loginbtn" onClick={onLogin}>Login</button>
            </form>
          </div>
            :
            <div>
              <h1>Have an Account</h1>
              <button className="transitionBtn" onClick={handleTransition}>Login</button>
            </div>
          }


        </div>


        <div className={`Signup-container ${panelTransitionFlag ? 'small-cont-panel':'big-cont-panel'}`}>
          {panelTransitionFlag ? <div>
            <h1>Create new Account</h1>
            <button className="transitionBtn green-back" onClick={handleTransition}>Sign Up</button>
          </div> 
        :
        <div className="main-form">
            <h2 className="panel-title">Sign Up</h2>
            <form id="signupform">
              <label for=""><input className="" type="text" placeholder="Full Name" name="name" onChange={(event) => { setSignupForm((prev) => ({ ...prev, name: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="text" placeholder="Store's Name" name="storename" onChange={(event) => { setSignupForm((prev) => ({ ...prev, storename: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="text" placeholder="Mobile Number" name="mobile" onChange={(event) => { setSignupForm((prev) => ({ ...prev, mobile: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="email" placeholder="Email" name="email" onChange={(event) => { setSignupForm((prev) => ({ ...prev, email: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="password" placeholder="Password" name="password" onChange={(event) => { setSignupForm((prev) => ({ ...prev, password: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="text" placeholder="Address" name="address" onChange={(event) => { setSignupForm((prev) => ({ ...prev, address: event.target.value })) }} required /></label>
              <br />
              <label for=""><input type="number" placeholder="No. of PCs" name="noofpcs" onChange={(event) => { setSignupForm((prev) => ({ ...prev, noofpcs: event.target.value })) }} required /></label>
              <br />
              <button className="transitionBtn green-back" id="signupbtn" onClick={onSignup}>Sign Up</button>
            </form>
          </div>  
        }
          
        </div>


      </div>
    </>
  )
}

