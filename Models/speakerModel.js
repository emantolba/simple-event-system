const { default: mongoose } = require('mongoose');
const mongooose = require('mongoose');
let speakerSchema = new mongooose.Schema({
    _id:mongoose.ObjectId,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    userName:{type:String,required:true},
    Address:[{city:String,street:String,building:String}]});
    module.exports=mongooose.model('speakers',speakerSchema);