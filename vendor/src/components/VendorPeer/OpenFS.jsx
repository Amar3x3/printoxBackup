import React, { useEffect, useState } from 'react'
import PrintFile from '../Print/PrintFile';
import path, { dirname } from 'path';
import { useSelector } from 'react-redux';
const { ipcRenderer } = window.require('electron');

export default function OpenFS(props) {
  const peer = useSelector(state => state.vendorPeer.peer);
  const [isconfig,setIsConfig] = useState(new Array(props.filepaths.filesPath.length).fill(false));
  const [config,setConfig] = useState(new Array(props.filepaths.filesPath.length).fill({}));

  useEffect(()=>{
    ipcRenderer.send("show_config",props.filepaths);
    console.log(props);
    console.log(isconfig);
    console.log(config);
  }, [isconfig]);
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
  const openFolder = () =>{
    ipcRenderer.send('open-file-in-folder', path.join(process.cwd(),props.filepaths.filesPath[0].filepath));
    console.log(path.join(process.cwd(),props.filepaths.filesPath[0].filepath));

  }
  const showConfig = (idx,conf)=>{
    var newisconfig = [...isconfig];
    newisconfig[idx] = !newisconfig[idx];
    setIsConfig(newisconfig);
    var newconfig = [...config];
    newconfig[idx] = conf;
    setConfig(newconfig);

    console.log(conf);
    console.log(isconfig)
  }

  const openFile = (pathstr)=>{
    pathstr= path.resolve(pathstr);
    ipcRenderer.send("openfilelocation",pathstr);
  }
    
  return (
    <>
      <div className='close-btn-right-corner' onClick={props.onClose}><img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1710425287/PrintOx/zondicons_close-solid_bz9kan.png" alt="" /></div>
      <div className='display-flex-between mp-up-2rem'>
      <h3>{props.name}</h3>
      <button className='folder-btn' onClick={openFolder}> <img src="https://res.cloudinary.com/dn07sxmaf/image/upload/v1710774040/PrintOx/material-symbols_folder-open_r4uphj.png" alt="" /></button>
      </div>
      {
        props.filepaths.filesPath.map((ele, idx) => (
          <div
            key={idx}>
           <div className="display-flex-between">
           <p> {ele.filename}</p>
            <button className='transitionBtn' onClick={() => {
              const message = {
                type: "Files_Status",
                status: "Files_Printing"
              }
            
              sendStatus(message, props.peerId)
              //PrintFile(ele.filepath)
              openFile(ele.filepath)
            }}>Open File</button>
            <button onClick={()=>showConfig(idx,ele.configuration)}>
              ShowConfig
            </button>
           </div>
            <div key={idx}>
            {/* JSON.stringify(config[idx]) */}
              { isconfig[idx] ? 
              <div key={isconfig} className='display-flex-between files-config'>
               
             </div> : null}
            </div>
            {isconfig[idx] &&
              <div className='display-flex-between files-config'>
                <div>Color: {config[idx].color ? 'Yes' : 'No'}</div>
                <div>Copies: {config[idx].copies}</div>
                <div>Layout: {config[idx].layout}</div>
                <div>Page Size: {config[idx].pageSize}</div>
                <div>Pages Per Sheet: {config[idx].pagesPerSheet}</div>
              </div>
            }
          </div>
        ))
      }
      
    </>
  );
};
