const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
    {
        username:{
            type : String
        },
        vendor:{
            type : String
        },
        pcid:{
            type: String
        },
        pcidx:{
            type: String
        }
    },{timestamps : true}
)

const User = mongoose.model('Userlist',UserSchema);

module.exports = User;