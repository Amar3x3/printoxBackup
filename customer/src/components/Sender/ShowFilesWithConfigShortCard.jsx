import React, { useState } from "react";
import styles from "./SenderPeer.module.css";
import { useSelector, useDispatch } from "react-redux";
import { removeFile, sendFile } from "../../Store/UserFiles";


function ShowFilesWithConfigShortCard() {
    const files = useSelector(state => state.customer.files);
    const [expandedFileIndex, setExpandedFileIndex] = useState(null);
    const dispatch = useDispatch();

    function handleToggleConfig(index) {
        if (expandedFileIndex === index) {
            setExpandedFileIndex(null)
        } else {
            setExpandedFileIndex(index);
        }
    };
    function handleRemoveFile(index) {
        dispatch(removeFile(index));    
    }

    return (
        <ul className={styles.layout}>
            {files.map((fileObj, index) => (
                <li key={index} className={styles.listShort}>
                    <div className={styles.grid2ShortCard}>
                        <h1 className={styles.filesTitle}>{fileObj.name}</h1>
                        <div onClick={() => handleRemoveFile(index)} className={styles.crossClose}>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default ShowFilesWithConfigShortCard;