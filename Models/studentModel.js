const mongooose = require('mongoose');
let studentSchema = new mongooose.Schema({
    _id:Number,
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true}});
    module.exports=mongooose.model('students',studentSchema);