import React, { useRef, useEffect, useState } from "react";
import styles from "./SenderPeer.module.css";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { establishConnection, setPeerConnectionStatus, setReceiverID } from "../../Store/Peer";
import { sendFile, handleName, updateFiles } from "../../Store/UserFiles";
import ShowFilesWithConfig from "./ShowFilesWithConfig";
import ShowFilesWithConfigShortCard from "./ShowFilesWithConfigShortCard";
import BillComponent from "./Bill";
import Gpay from "../Payments/Gpay";

const SenderComponent = () => {
  const dispatch = useDispatch();
  const peer = useSelector((state) => state.SenderPeer.peer);
  const { code } = useParams();
  const receiverId = useSelector((state) => state.SenderPeer.receiverId);
  const fileInputRef = useRef(null);
  const files = useSelector(state => state.customer.files);
  const connectionStatus = useSelector(state => state.SenderPeer.connectionStatus)
  const filesStatus = useSelector(state => state.print.status);

  const customers = useSelector(state => state.SenderPeer.customers);
  const [isNotValidName, setIsNotValidName] = useState(false);
  const connection = useSelector(state => state.SenderPeer.connection)
  const bill = useSelector(state => state.customer.bill);

  useEffect(() => {
    if (code && code !== receiverId) {
      dispatch(setReceiverID(code));
    }
  }, [code, receiverId, dispatch]);

  useEffect(() => {
    peer.on("open", (pid) => {
      console.log("My Peer Id:- ", pid);

      if (receiverId !== "") {
        dispatch(establishConnection());
      }
    });
  }, [dispatch, peer, receiverId]);

  useEffect(() => {
    console.log("Updated files:- ", files);
  }, [files]);


  function handleNameChange(e) {
    dispatch(handleName(e));
    var flag = false;
    customers.forEach((ele) => {
      if (ele.name === e.target.value) {
        setIsNotValidName(true);
        flag = true
      }
    });
    if (!flag) {
      setIsNotValidName(false);
    }
  }

  function sendFilesToVendor() {
    dispatch(sendFile())
  }


  return (
    <>
      <div className={styles.container0}>
        <nav>
          <img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1699338162/samples/printox/Vector_gqltbz.png" alt="Logo"></img>
          <h1>PrintOX</h1>
        </nav>
        {/* <h1>User</h1> */}
        <div className={styles.container_name}>
          <label htmlFor="name" className={styles.label}>
            <input className={styles.inputFields} placeholder="Enter Your Name" type="text" name="name" onChange={handleNameChange} />
          </label>
          {isNotValidName && (<div className="NameAlert">
            <p>Name is already taken</p>
          </div>)}
          {/* <br /> */}
          {!code && (<label htmlFor="" className={styles.label}>
            <input
              className={styles.inputFields}
              type="text"
              placeholder="Enter Shop Id"
              onChange={(e) => dispatch(setReceiverID(e.target.value))}
            />
            <div>
              <button className={styles.connectBtn} onClick={() => dispatch(establishConnection())}>Connect</button>
              
            </div>
          </label>)}
          {/* <br /> */}
        </div>



        <div className={styles.container_Files}>
          <label className={styles.chooseFiles}>
            <img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1699341464/samples/printox/Upload_to_Cloud_yo5azk.png" className={styles.abs_browse}></img>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              onChange={() => {
                dispatch(updateFiles(fileInputRef));
              }}
              className={styles.labelFiles}
            />
            <div className={styles.abs_BrowseBtn}>Upload Files</div>
          </label>
        </div>


        <div className={styles.centerCont}>


          {files && <ShowFilesWithConfigShortCard />}
          {/* <br /> */}

          <div className={styles.btnsSubmitCloseGrid}>
            <div >
              <Link className={styles.nextBtn} to="/detailConfig">Next</Link>
            </div>
            <button
        onClick={() => {
          peer.destroy();
          dispatch(setPeerConnectionStatus("Not Connected"))
          console.log("Peer Disconnected");
        }}
      ></button>
            <Gpay></Gpay>
            <h2>Files Status:- {filesStatus}</h2>
            {
              (filesStatus === "Bill_Generated" ? <BillComponent bill={bill} /> : <></>)
            }
          </div>
        </div>
        </div>

      </>
      )
};

      export default SenderComponent;
