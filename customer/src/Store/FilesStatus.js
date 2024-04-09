const setStatusSent = "Set_Status_Sent";
const setStatusFilesReceived = "Set_Status_Files_Received";
const setStatusFilesOpened = "Set_Status_Files_Opened";
const setStatusPrinting = "Set_Status_Printing";
const setStatusBillGeneration = "Set_Status_Bill_Generation";
const setError = "Set_Error";

export function statusSent(status) {
    return {
        type: setStatusSent,
        payload: status
    }
};
export function statusFilesReceived(status) {
    return {
        type: setStatusFilesReceived,
        payload: status
    }
};
export function statusFilesOpened(status) {
    return {
        type: setStatusFilesOpened,
        payload: status
    }
};
export function statusPrinting(status) {
    return {
        type: setStatusPrinting,
        payload: status
    }
};
export function statusBillGeneration(status) {
    return {
        type: setStatusBillGeneration,
        payload: status
    }
};
export function statusError(error) {
    return {
        type: setError,
        payload: error
    }
};


function fileStatusReducer(
    state = {
        status: "Files Not Sent",
        error: ""
    },
    action
) {
    switch (action.type) {
        case "Set_Status_Sent":
            return { ...state, status: action.payload }
        case "Set_Status_Files_Received":
            return { ...state, status: action.payload }
        case "Set_Status_Files_Opened":
            return { ...state, status: action.payload }
        case "Set_Status_Printing":
            return { ...state, status: action.payload }
        case "Set_Status_Bill_Generation":
            return { ...state, status: action.payload }
        case "Set_Error":
            return { ...state, error: action.payload }
        default:
            return state
    };
};

export default fileStatusReducer;