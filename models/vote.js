const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const voteSchema=new Schema({
    os: {
        type: String,
        required: true
    },
    points: {
        type: String,
        default:1,
        required: true
    }
});

module.exports=new mongoose.model('Vote',voteSchema)