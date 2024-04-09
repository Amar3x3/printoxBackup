const express =require('express');
const Vendor = require('../Models/Vendor');
const router = express.Router();
const mongoose= require('mongoose')
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'Printox';

function generateToken(username) {
  const payload = { username };
  const options = { expiresIn: '1h' }; // Set an expiration time for the token

  return jwt.sign(payload, secretKey, options);
}

function authenticateToken(req, res, next){
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log("secretkey="+secretKey)
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Token is valid, store the decoded information in the request object
    req.user = decoded;
    // Proceed to the next middleware or route handler
    next();
  });
};

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  function hash24To6(input) {
    const hash = crypto.createHash('sha256').update(input).digest('hex');
    const result = hash.substring(0,6).split('').map((char)=>{
        if (Math.random() < 0.3) {
            return char.toUpperCase();
          }
          return char;
        }).join('');
    return result;
  }
  // function genPeerId(){
  //   const input=generateRandomString(24)
  //   const hash = crypto.createHash('sha256').update(input).digest('hex');
  //   const result = hash.substring(0,24).split('').map((char)=>{
  //     if (Math.random() < 0.3) {
  //         return char.toUpperCase();
  //       }
  //       return char;
  //     }).join('');
  // return result;

  // }
  // const upload = multer({ dest: 'uploads/' });
  // ,upload.single('file')
router.post('/NewVendor',(req,res)=>{
    const id =new mongoose.Types.ObjectId();
    const randomString = generateRandomString(18);
    const combinedInput = id + randomString;
    const code =hash24To6(combinedInput);
    const pcsids=[];
    for(let i=0;i<parseInt(req.body.noofpcs);i++){
      console.log("added");
      pcsids.push({
        status : false
      });
    };

    // const file = req.file;
    // fs.ensureDirSync(`ProfilePictures/${id}`);
    // console.log(file.originalname);
    // const targetPath = path.join(`ProfilePictures/${id}`, file.originalname);
    // fs.moveSync(file.path, targetPath);

    const newVendor = new Vendor({
        _id : id,
        code: code,
        peerid : id,
        basicinfo:{
          vendorname : req.body.name,
          storename : req.body.storename,
          mobile : req.body.mobile,
          email : req.body.email,
          address : req.body.address,
          noofpcs : req.body.noofpcs,
          pcids : pcsids,
          upiid : req.body.upiid,
          // profilepicture : file.originalname
        },
        credentials : {
          email : req.body.email,
          password : req.body.password
        },
        costconfig :{
          blackandwhite : req.body.blackandwhite,
          colour : req.body.colour
        }
        
    });
    newVendor.save().then((result)=>{
        res.send(result);
    }).catch((err)=>{
        console.log(err);
    });
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Find all users with the provided email
    const user= await Vendor.findOne({ 'credentials.email': email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Compare the password with the hashed passwords stored in the database
    let foundUser = null;
    console.log(password, user.credentials.password);
     const isMatch= await bcrypt.compare(password, user.credentials.password);
      console.log(isMatch);
        if (isMatch) {
          foundUser = user;
          console.log("1")
        }
      console.log("2")
    if (foundUser) {
      console.log("3")
      // Password is correct
      // Generate a JWT token using email
      const token = generateToken(email);
      let pcid="";
      let pcidx=0;
      // Send the token back to the client

      foundUser.basicinfo.pcids.forEach((ele,idx)=>{
        if(ele.status===false){
          pcid=ele._id;
          pcidx=idx;
          return;
        };
      });
      res.json({ token, pcid ,pcidx, ...foundUser});
     await Vendor.findByIdAndUpdate(
        foundUser._id,
        { $set: { [`basicinfo.pcids.${pcidx}.status`]: true } },
        { new: true }
      )
    } else {
      // Password is incorrect
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/SetPeerFree',async(req,res)=>{
  const pcidx = req.body.pcidx;
  const id = req.body.id;
  console.log("setting peer free");
  await Vendor.findByIdAndUpdate(
    id,
    { $set: { [`basicinfo.pcids.${pcidx}.status`]: false } },
    { new: true }
  )
});

router.post('/SetAllPeersFree',(req,res)=>{
  const id = req.body.id;
  console.log("All peers free");
  Vendor.findByIdAndUpdate(
    id,
    { $set: { [`basicinfo.pcids.$[].status`]: false } },
    { new: true }
  ).then(()=>{
    res.sendStatus(200);
  }).catch((err)=>{
    console.log(err);
  })
});

router.post('/SetConnections',(req,res)=>{
  const today = new Date().toLocaleDateString();
  Vendor.findById(req.body.id)
  .then(async(vendor)=>{
    if(vendor.connections.length===0){
      console.log("first date")
      await Vendor.findByIdAndUpdate(vendor._id,{$push : {'connections':{count:1,date:today,filecount:req.body.filecount}}},{new:true});
      return;
    }
    const lidx = vendor.connections.length - 1;
    if(today===vendor.connections[lidx].date){
      console.log("same date")
      const newconn = {
        count : vendor.connections[lidx].count + 1,
        date : today,
        filecount : vendor.connections[lidx].filecount + parseInt(req.body.filecount)
      };
      console.log(vendor.connections[lidx])
      await Vendor.findByIdAndUpdate(vendor._id,{$set:{[`connections.${lidx}`]:newconn}},{new:true})
    }
    if(today!==vendor.connections[lidx].date){
      console.log("diff date")
      await Vendor.findByIdAndUpdate(vendor._id,{$push : {'connections':{count:1,date:today,filecount:req.body.filecount}}},{new:true});
    }
  })
  .catch((err)=>{
    console.log(err);
  })

});

router.put('/changeData',(req,res)=>{
  const newData = req.body.changedata;
  Vendor.findByIdAndUpdate(req.body.id,
    {$set:{basicinfo:newData,['credentials.email']:newData.email}}
    ,{
    new: true, // Return the updated document
   // runValidators: true, // Run model validators to ensure data integrity
  }).then((response)=>{
    res.send(response);
  }).
  catch((err)=>{
    console.log(err);
  })
});

router.post('/getVendor',(req,res)=>{
  Vendor.findById(req.body.id)
  .then((response)=>{
    res.send(response);
  })
  .catch((err)=>{
    console.log(err);
  })
});


module.exports=router;