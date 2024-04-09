const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const VendorSchema = new Schema(
    {
        _id: {
            type: mongoose.Types.ObjectId,
            default: mongoose.Types.ObjectId 
        },
        basicinfo:{ 
            vendorname:{
                type : String
            },
            storename:{
                type : String
            },
            mobile:{
                type : String
            },
            email:{
                type : String
            },
            address:{
                type : String
            },
            noofpcs : {
                type  : String 
            },
            pcids : [
                {  
                    status:{
                        type : Boolean
                    }
                }
            ],
            upiid:{
                type : String
            },
        },
        credentials:{
            email:{
                type: String
            },
            password:{
                type: String
            }
        },
        code :{
            type: String
        },
        peerid :{
            type : String
        },
        connections:[
            {
            count:{
                type : Number
            },
            date :{
                type : String
            },
            filecount:{
                type : Number
            }
        }
        ]

    },{timestamps : true}
)

const Vendor = mongoose.model('Vendorlist',VendorSchema);

module.exports = Vendor;