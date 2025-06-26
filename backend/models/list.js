const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    item:{
        type:String,
        required:true
    },
    done:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});


const list = mongoose.model('listItem',listSchema);


module.exports = list;