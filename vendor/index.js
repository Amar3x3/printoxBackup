const { app, BrowserWindow, ipcMain,shell } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const Store = require('electron-store');
const axios = require('axios');

let mainWindow;
let configwindow;
let vendorData={};
let pricingData=[];
const store = new Store();


async function setPeerFree() {
  try {
    const id = vendorData._doc._id;
    const pcidx = vendorData.pcidx;
    await axios.post('http://127.0.0.1:8081/VendorContent/SetPeerFree', { pcidx, id });
    console.log('Request successfully processed.');
  } catch (err) {
    console.error('Error:', err);
  }
}
async function setAllPeersFree() {
  try {
    console.log("setting all peers free");
    const id = vendorData._doc._id;
    await axios.post('http://127.0.0.1:8081/VendorContent/SetAllPeersFree', { id });
    console.log('Request successfully processed.');
    
  } catch (err) {
    console.error('Error:', err);
  }
}

ipcMain.on('send-creds',(event,data)=>{
  // const cipher = crypto.createCipheriv(algorithm,encryptionKey, iv);
  // let encryptedCredentials = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  // encryptedCredentials += cipher.final('hex');

  store.set('credentials',data);
  console.log("saved successfully");
});

ipcMain.on('get-creds', (event, key) => {
      
  const data = store.get('credentials');
  
  // Send the data back to the renderer process
  if(data){
  event.sender.send('get-creds-data', data);
  }else{
  event.sender.send('get-creds-data', {email:"",password:""});
  }
});

ipcMain.on('login-successful',(event,data)=>{
  vendorData=data;
  console.log("logged in successfully");
  mainWindow.webContents.send('login-successful',vendorData);

});
ipcMain.on('getlogindata',(event,data)=>{
  console.log("sending login data");
  mainWindow.webContents.send('getlogindata',vendorData);

});
ipcMain.on("signup-successful",(event,data)=>{
  vendorData=data;
  console.log("signedup successfully");
  mainWindow.webContents.send('signup-successful',data);
});

ipcMain.on('SetAllPeersFree',async (event,key)=>{
  await setAllPeersFree();
  mainWindow.close();
});

ipcMain.on("setPricingData",(event,data)=>{
  store.set('pricingdata',data);
  pricingData=data;
  console.log("setting new price ele");
  
});

ipcMain.on('getPricingData',(event,key)=>{
  const data = store.get('pricingdata');
  pricingData=data;
  console.log("sending pricing data",data);

  mainWindow.webContents.send('getPricingData',pricingData);

});

ipcMain.on('open-file-in-folder', (event, filePath) => {
  const folderPath = path.dirname(filePath);
  shell.openPath(folderPath); 
});

ipcMain.on("openfilelocation",(event,data)=>{
  console.log(data);
shell.openPath(data);
});

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    mainWindow.loadURL('http://localhost:3000/');
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed',async function () {
      if(vendorData){
      await setPeerFree();
      }
      mainWindow = null;
    });
  
});

app.on('window-all-closed',async  function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });



