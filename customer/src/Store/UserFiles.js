import { statusSent } from "./FilesStatus";

const setCustomerName = "Set_Customer_Name";
const setFiles = "Set_Files";
const setBill = "Set_Bill"

export function settingCustomerName(name) {
    return {
        type: setCustomerName,
        payload: name
    }
};
export function settingCustomerBill(bill) {
    console.log("In settting Customer bill", bill)
    return {
        type: setBill,
        payload: bill
    }
};

export const removeFile = (index) => {
    return {
      type: 'REMOVE_FILE',
      payload: index,
    };
  };

export function addFiles(files) {
    console.log("In add files", files)
    return {
        type: setFiles,
        payload: files
    }
};

export function updateFiles(fileInputRef) {
    return async (dispatch, getstate) => {
        const array = Array.from(fileInputRef.current.files);

        const fileReadPromises = array.map((file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();

                fileReader.readAsArrayBuffer(file);

                fileReader.onloadend = () => {
                    const fileObj = {
                        type: "file",
                        name: file.name,
                        file: fileReader.result,
                        configuration: {
                            color: false,
                            pageSize: "A4",
                            pagesPerSheet: "1",
                            layout: "Portrait",
                            pages: {
                                type: "All",
                                range: ""
                            },
                            copies: 1
                        }
                    };
                    resolve(fileObj);
                };

                fileReader.onerror = () => {
                    reject(new Error("Error reading file: " + file.name));
                };
            });
        });

        Promise.all(fileReadPromises)
            .then((filesArray) => {
                console.log("Files array:- ", filesArray);
                let files = getstate().customer.files;
                let final_files = files.concat(filesArray);
                dispatch(addFiles(final_files));
            })
            .catch((error) => {
                console.error("File reading error:", error);
            });
    }
};

  
export function handleName(e) {
    return async (dispatch, getState) => {
        dispatch(settingCustomerName(e.target.value));
    }
};

export function changePageType(e, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                pages: {
                    ...tempfiles[index].configuration.pages,
                    type: e.target.value,
                    range: e.target.value === "Customer" ? tempfiles[index].configuration.pages.range : "" 
                }
            }
        };
        dispatch(addFiles(tempfiles));
    }
}
export function noOfCopies(e, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                copies: parseInt(e)
            }
        };
        dispatch(addFiles(tempfiles));
    }
};

export function changePageRange(range, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                pages: {
                    ...tempfiles[index].configuration.pages,
                    range: range
                }
            }
        };
        dispatch(addFiles(tempfiles));
    }
}

export function sendFile() {
    return async (dispatch, getState) => {
        console.log("In sendfiles")
        const customer = getState().customer;
        const connection = getState().SenderPeer.connection;
        console.log("Data to be sended:- ", customer);
        if (connection) {
            connection.send(customer);
            dispatch(statusSent("Files_Sent"))
        }
    }
};
  


export function pageSizeChange(e, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                pageSize: e.target.value,
            }
        };
        console.log(tempfiles);
        dispatch(addFiles(tempfiles));
    }
};

export function layoutChange(layout, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                layout: layout
            }
        };
        dispatch(addFiles(tempfiles));
    }
}

export function pagesPerSheet(pages, index) {
    return async (dispatch, getState) => {
        const files = getState().customer.files;
        const tempfiles = [...files];
        tempfiles[index] = {
            ...tempfiles[index],
            configuration: {
                ...tempfiles[index].configuration,
                pagesPerSheet: pages
            }
        };
        dispatch(addFiles(tempfiles));
    }
}

export function colorChange(e, index) {
    return async (dispatch, getState) => {
        const { name, value } = e.target;
        console.log({ name, value }, index);
        const files = getState().customer.files;
        const tempFiles = [...files];
        if (value === "color") {
            tempFiles[index] = {
                ...tempFiles[index],// Assuming the value of color radio is "color" and B/W is "bw"
                configuration: {
                    ...tempFiles[index].configuration,
                    color: true,
                }
            };
        } else {
            tempFiles[index] = {
                ...tempFiles[index],
                configuration: {
                    ...tempFiles[index].configuration,
                    color: false,
                }
            };
        }
        // console.log("Files before setting form data", files);
        console.log(tempFiles);
        dispatch(addFiles(tempFiles));
    }
  };

function userFilesReducer(
    state = {
        name: "",
        files: [],
        bill: null
    },
    action
) {
    switch (action.type) {
        case "Set_Customer_Name":
            return { ...state, name: action.payload }
        case "Set_Files":
            return { ...state, files: action.payload }
        case 'REMOVE_FILE':
            const index = action.payload;
            const updatedFiles = [...state.files.slice(0, index), ...state.files.slice(index + 1)];
            return { ...state, files: updatedFiles }
        case "Set_Bill":
            return {...state, bill: action.payload}
        default:
            return state
    }
};

export default userFilesReducer;