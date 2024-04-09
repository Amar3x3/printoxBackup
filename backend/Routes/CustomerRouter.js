const express =require('express');
const Vendor = require('../Models/Vendor');
const Customer = require('../Models/Customer');
const router = express.Router();
const mongoose=require('mongoose')
//For QR code
router.post('/GetVendor/:code',(req,res)=>{
    const vendorCode=req.params.code;
    let pcid;
    let pcidx;
    Vendor.findOne({ code: vendorCode })
      .then((vendor) => {
       
        if (!vendor) {
          return res.status(404).send('Vendor not found');
        }
        let randvend=[]
        vendor.basicinfo.pcids.forEach((ele,idx)=>{
          if(ele.status){

            randvend.push(idx);
          }
        });
        pcidx=randvend[Math.floor(Math.random() * randvend.length)]
        pcid=vendor.basicinfo.pcids[pcidx]._id
        if(pcid){
        const newCustomer = new Customer({
          name: req.body.name,
          vendor: vendor._id,
          pcid: pcid,
          pcidx:pcidx
        });
  
        newCustomer.save()
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send('Error saving Customer');
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error finding vendor');
      });   
});




module.exports=router;