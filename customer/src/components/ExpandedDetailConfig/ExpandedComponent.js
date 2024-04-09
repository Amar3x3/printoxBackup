import React, { useRef, useEffect, useState } from "react";
import styles from "./DetailConfigComponent.module.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

const ExpandedDetailConfig = () => {
    const dispatch = useDispatch();
    const peer = useSelector((state) => state.SenderPeer.peer);
    const { code } = useParams();
    const receiverId = useSelector((state) => state.SenderPeer.receiverId);
    const fileInputRef = useRef(null);
    const files = useSelector(state => state.customer.files);

    const customers = useSelector(state => state.SenderPeer.customers);
    const [isNotValidName, setIsNotValidName] = useState(true);

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
              

                {files && <ShowFilesWithConfig />}


            </div>
        </>
    );
};

export default ExpandedDetailConfig;
