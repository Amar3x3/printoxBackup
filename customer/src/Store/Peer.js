import Peer from "peerjs";
import axios from "axios";
import { statusBillGeneration, statusError, statusFilesOpened, statusFilesReceived, statusPrinting } from "./FilesStatus";
import { settingCustomerBill } from "./UserFiles";

const setReceiverId = "Set_Receiver_ID";
const connectionInfo = "Connection_Info";
const addCustomers = "Add_Customers";
const setConnectionStatus = "Set_Connection_Status"

export function setCustomers(customers) {
    // console.log("Adding customers:- ", customers);
    return {
        type: addCustomers,
        payload: customers
    }
};

export function setPeerConnectionStatus(status) {
    console.log("Connection Status:- ", status);
    return {
        type: setConnectionStatus,
        payload: status
    }
}

export function setReceiverID(code) {
    return {
        type: setReceiverId,
        payload: code
    }
};

export function setConnection(connection) {
    return {
        type: connectionInfo,
        payload: connection
    }
}

export function establishConnection() {
    return function (dispatch, getState) {
        const { receiverId, peer } = getState().SenderPeer;
        const name = getState().customer.name
        axios
      .post(`http://127.0.0.1:8081/CustomerContent/GetVendor/${receiverId}`, {
        name: name,
      })
      .then((response) => {
          console.log(response.data);
          dispatch(setPeerConnectionStatus("Connecting...."));
        const conn = peer.connect(response.data.pcid);
        conn.on("open", () => {
            console.log("Connected to peer");
            dispatch(setPeerConnectionStatus("Connected to Vendor"))
            dispatch(setConnection(conn));
        });
      })
      .catch((err) => {
        console.log(err);
      });
        peer.on("connection", (connection) => {
            connection.on("data", (data) => {
                console.log("Received data from vendor:- ", data);
                console.log("File Status:- ", getState().print.status);
                if (data.type === "Connected_Customer_List") {
                    dispatch(setCustomers(data.message))
                }
                if (data.type === "Files_Status") {
                    if (data.status === "Files_Received") {
                        dispatch(statusFilesOpened(data.status));
                    }
                    if (data.status === "Files_Opened") {
                        dispatch(statusFilesReceived(data.status));
                    }
                    if (data.status === "Files_Printing") {
                        dispatch(statusPrinting(data.status));
                    }
                    if (data.status === "Bill_Generated") {
                        dispatch(settingCustomerBill(data.bill));
                        dispatch(statusBillGeneration(data.status));
                    }
                }
            });
        });
    }
};

function peerReducer(
    state = {
        peer: new Peer(),
        receiverId: "",
        connection: null,
        connectionStatus: "Not Connected",
        customers: []
    },
    action
) {
    switch (action.type) {
        case "Set_Connection_Status":
            return { ...state, connectionStatus: action.payload }
        
        case "Set_Receiver_ID":
            return { ...state, receiverId: action.payload }
        
        case "Connection_Info":
            return { ...state, connection: action.payload }
        
        case "Add_Customers":
            return {...state, customers: action.payload}
        default:
            return state
    }
};

export default peerReducer;