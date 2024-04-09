import React, { useEffect, useState } from "react";
import Peer from "peerjs";
import axios from "axios";
import OpenFS from "./OpenFS";
import CalculateBill from "../Bill_Generation/CalculateBill";
import { useSelector, useDispatch } from "react-redux";
import { setConnectedPeers, setPeer } from "../../store/VendorPeer";
const { ipcRenderer } = window.require('electron');



const {
  createUserDirectory,
  saveArrayBufferToFile,
  deleteUserFolder,
} = require('../FileManager/FileManager')

function VendoorPeer() {

  // const [peer, setPeer] = useState(new Peer());
  // const [connectedPeers, setConnectedPeer] = useState([]);
  const connectedPeers = useSelector(state => state.vendorPeer.connectedPeers);
  const dispatch = useDispatch();
  const [vendorData, setVendorData] = useState(null);
  const [customerNames, setCustomerNames] = useState([]);
  const [userFiles, setUserFiles] = useState({});
  const [isopneFS, setIsOpenFS] = useState(false);
  const [openData, setOpenData] = useState({});
  // const [peer, setCurrentpeer] = useState("");
  const peer = useSelector(state => state.vendorPeer.peer);
  useEffect(() => {
    ipcRenderer.send('getlogindata')
    ipcRenderer.on('getlogindata', (event, data) => {
      setVendorData(data);
      //setPeer(new Peer(vendorData.pcid));
      console.log(data);
      //createPeer()
    });
  }, []);
  useEffect(() => {
    console.log("useEffect Peer", peer);
    connectionWithPeer()
  }, [peer]);

  useEffect(() => {
    console.log(vendorData);
    if (vendorData) {
      createPeer();
    }
  }, [vendorData]);

  function fileManagement(data, peer) {
    console.log(data);

    let userDirectory;

    if (userFiles[peer]) {
      userDirectory = {
        success: true,
        message: "Folder already exist",
        path: userFiles[peer].folder,

      }
    } else {
      userDirectory = createUserDirectory(data.name);
      userFiles[peer] = {
        folder: userDirectory.path,
        filesPath: [],

      };

    }
    console.log("user directory", userDirectory);
    // adding user folder path

    // if directory is created successfully
    if (userDirectory.success) {

      // Iterate over each file and put it into the folder
      for (let index = 0; index < data.files.length; index++) {
        // file buffer
        const file = data.files[index];
        // saveArrayBufferToFile converts array buffer to file and save it to the user folder and returns files path

        // now we save files path into the filesPath
        console.log(file.configuration);
        userFiles[peer].filesPath.push(
          {
            filepath: saveArrayBufferToFile(file.file, file.name, userDirectory.path),
            filename: file.name,
            configuration: file.configuration
          }
        );

      }

    }
    console.log(userDirectory.path);
    setUserFiles({
      ...userFiles
    });
    //to create div container element
  }

  const createPeer = () => {
    console.log(vendorData)

    const temppeer = new Peer(vendorData.pcid);
    // setCurrentpeer(temppeer);
    console.log("temppeer", temppeer)
    dispatch(setPeer(temppeer));

  }

  const connectionWithPeer = () => {
    console.log("peer", peer);
    if (peer) {
      console.log(peer);
      peer.on("open", (pid) => {
        console.log("My Peer Id:- " + pid);
        if (pid.length > 24) {

          ipcRenderer.send('SetAllPeersFree');
        }
      });
    }

    // Handle connection event
    const handleConnection = (connection) => {
      console.log("Connect to:- ", connection.peer);
      const customerPeer = peer.connect(connection.peer);
      customerPeer.on("open", () => {
        console.log("Now vendor is connected to customer");
        const data = {
          type: "Connected_Customer_List",
          message: customerNames
        }
        customerPeer.send(data);
      });

      connection.on("data", (data) => {
        console.log("In connection.on", customerPeer)
        axios
          .post("http://127.0.0.1:8081/VendorContent/SetConnections", {
            id: vendorData._doc._id,
            filecount: data.files.length,
          })
          .then(fileManagement(data, connection.peer));
        const message = {
          type: "Files_Status",
          status: "Files_Received"
        }
        customerPeer.send(message);
        //customerNames.push(data.name);
        setCustomerNames((names) => ([...names, data.name]));
        //addNewCustomer(data.name);
        const connectedPeer = {
          peer: connection.peer,
          name: data.name,
          nooffiles: data.files.length,
          time: new Date().toLocaleTimeString(),
          files: data.files,
          customerPeer: customerPeer
        };
        // Using the function form of setState to avoid state mutations
        let tempConnected = [...connectedPeers];
        tempConnected.push(connectedPeer);
        dispatch(setConnectedPeers(tempConnected));

        // console.log("Connected to Peer:- " + connection.peer);
        console.log("redux connected peers", connectedPeers);
      });

      connection.on("close", () => {
        // close connection with user
        console.log("Disconnected from " + connection.peer);

        // delete the folder
        if (userFiles[connection.peer]) {
          console.log(userFiles)
          deleteUserFolder(userFiles[connection.peer]);
          setUserFiles(prevFiles => {
            const newFiles = { ...prevFiles };
            delete newFiles[connection.peer];
            return newFiles;
          });
        }
        // let newConnectedPeer = []
        // connectedPeers.forEach((user) => {
        //   if (user.peer !== connection.peer) {
        //     console.log("userPeer:- " + user.peer)
        //     console.log("connectionPeer:- " + connection.peer)
        //     newConnectedPeer.push(user);
        //   }
        // })
        // setConnectedPeer(prevPeers => prevPeers.filter(user => user.peer !== connection.peer));
        // console.log("list of connected peer after closing connection", connectedPeers);
        let tempConnected = [...connectedPeers];
        tempConnected = tempConnected.filter(user => user.peer !== connection.peer);
        dispatch(setConnectedPeers(tempConnected));
        console.log("List of Connected Peers:- ", connectedPeers);

        // setConnectedPeer(newConnectedPeer);
      });



    };

    if (peer) {
      peer.on("connection", handleConnection);
    }

    // Cleanup event listeners on component unmount
    return () => {
      peer.off("connection", handleConnection);
    };

  }

  const sendStatus = (status, peerId) => {
    if (peer) {
      const customerPeer = peer.connect(peerId);
      customerPeer.on("open", () => {
        customerPeer.send(status);
      });
    } else {
      console.error("Peer is undefined");
    }
  };


  useEffect(() => {
    console.log("List of Connected Peers:- ", connectedPeers);
  }, [connectedPeers]);

  const openFS = (peer) => {
    console.log("pressed");
    setIsOpenFS(true);
    setOpenData(peer);
    console.log(peer.peer);
    const message = {
      type: "Files_Status",
      status: "Files_Opened"
    }
    sendStatus(message, peer.peer);
    // peer.send("Files OPened");
  };

  const onCloseFS = (peer) => {
    setIsOpenFS(false);
  }

  function getBill(peer) {
    CalculateBill(peer).then((data) => {
      const message = {
        type: "Files_Status",
        status: "Bill_Generated",
        bill: data
      }
      console.log(peer.peer);
      sendStatus(message, peer.peer);
      console.log(data);
    });

  }

  return (
    <>

     
          <div>

            {
              (connectedPeers.length === 0 ?
                <div className="center-no-users-img"> <img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425287/PrintOx/nousersConnected_w8shps.png" alt="" /> </div> :
                <ul>
                  {
                    connectedPeers.map((peer, idx) => (
                      <div className="card" key={idx}>

                        <p className="card-name"> {peer.name}</p> <p className="card-time">{peer.time}</p> <p className="card-no-of-files">{peer.nooffiles} FILES</p>
                        <button className="transitionBtn standardBtn open-btn" onClick={() => openFS(peer)}>Open</button>
                        <button className="transitionBtn green-back standardBtn bill-btn" onClick={() => getBill(peer)}>Bill</button>

                      </div>
                    ))
                  }
                </ul>
              )
            }
          </div> 
          {isopneFS ? 
          <div className="openFolder-cont"> 
          <OpenFS
            name={openData.name}
            onClose={onCloseFS}
            filepaths={userFiles[openData.peer]}
            peerId={openData.peer} />
            </div> : <div></div>}
          
         
      
    </>
  );
};

export default VendoorPeer;