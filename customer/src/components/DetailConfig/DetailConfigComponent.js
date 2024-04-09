import React, { useRef, useEffect, useState } from "react";
import styles from "./DetailConfigComponent.module.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { establishConnection, setReceiverID } from "../../Store/Peer";
import { sendFile, handleName, updateFiles } from "../../Store/UserFiles";
// import ShowFilesWithConfig from "../Sender/ShowFilesWithConfig";
import { Color, PageRange, PageSize, PagesPerSheet, Layout } from "../Sender/Configuration";
import ShowFilesWithConfig from "../Sender/ShowFilesWithConfig";




const DetailConfigComponent = () => {
    const dispatch = useDispatch();
    const name = useSelector(state => state.customer.name);
    const files = useSelector(state => state.customer.files);


    const handleSendFile=()=>{
        dispatch(sendFile());
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
                    <h3>{name}</h3>
                    {/* <br /> */}
                    <ShowFilesWithConfig></ShowFilesWithConfig>
                    <button className={styles.sendBtn} onClick={handleSendFile}>Send All</button>
                    {/* <br /> */}
                </div>
                {/* <br /> */}

            </div>
            
        </>
    );
};

export default DetailConfigComponent;
