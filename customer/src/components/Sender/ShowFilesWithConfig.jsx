import React, { useState } from "react";
import styles from "./SenderPeer.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Color, PageRange, PageSize, PagesPerSheet, Layout, Copies } from "./Configuration";
import { removeFile, sendFile } from "../../Store/UserFiles";

function ShowFilesWithConfig() {
  const files = useSelector(state => state.customer.files);
  const dispatch = useDispatch();
  const [expandedFileIndex, setExpandedFileIndex] = useState(null);

  function handleToggleConfig(index) {
    if (expandedFileIndex === index) {
      setExpandedFileIndex(null)
    } else {
      setExpandedFileIndex(index);
    }
  };
  const handleRemoveFile = (index) => {
    dispatch(removeFile(index));
  };
  const handleSendFile=()=>{
    dispatch(sendFile());
  }

  return (
    <>
    <ul className={styles.layout}>
      {files.map((fileObj, index) => (
        <div className={styles.cardContainer}>
          <button className={styles.abs_settingBtn} onClick={() => handleToggleConfig(index)}>
            {expandedFileIndex === index ? "Close" : "Setting"}
          </button>
          <li key={index} className={styles.list}>
            <h1 className={styles.filesTitle}>{fileObj.name}</h1>
            <hr />
            <Color index={index} fileObj={fileObj} />

            <div className={styles.grid2options}>
              <Layout index={index} fileObj={fileObj} />
             <div className={styles.left_mg_1rem}> <PagesPerSheet index={index} fileObj={fileObj} /></div>
            </div>


           <div className={styles.grid2options}>
           <PageSize index={index} fileObj={fileObj} />
            <div className={`${styles.left_mg_1rem} ${styles.copies}`}><Copies index={index} fileObj={fileObj} /></div>
           </div>
            {expandedFileIndex === index && (


              <div className={styles.grid2options}>
                <PageRange index={index} fileObj={fileObj} />
                <div className={styles.left_mg_1rem}><PageSize index={index} fileObj={fileObj} /></div>
              </div>

            )}
            <br />
            <button className={styles.removeBtn} onClick={() => handleRemoveFile(index)}>Remove File</button>
            {/* <button onClick={()=> handleSendFile()}>Send</button> */}
          </li>
          </div>
       
      ))}
        </ul>
    </>
  )
}

export default ShowFilesWithConfig;