const { ipcRenderer } = window.require("electron");



export function setPeer(peer) {
    console.log("In setPeer", peer);
    return {
        type: "Set_Peer",
        payload: peer
    }
};
export function setConnectedPeers(connectedPeers) {
    console.log("In Set Connected Peers", connectedPeers);
    return {
        type: "Set_Connected_Peers",
        payload: connectedPeers
    }
};


function VendorPeerReducer(
    state = {
        peer: null,
        connectedPeers: []
    },
    action
) {
    switch (action.type) {
        case "Set_Peer":
            return { ...state, peer: action.payload }
        case "Set_Connected_Peers":
            return { ...state, connectedPeers: action.payload }
        default:
            return state
    }
}

export default VendorPeerReducer