
const mongooose = require('mongoose');
let eventSchema = new mongooose.Schema({
    _id:Number,
    title:{type:String,required:true},
    eventDate:{type:String,required:true},
    mainSpeakerId:{type:mongooose.ObjectId,ref:'speakers'},
    otherSpeakersIds:[{type:mongooose.ObjectId,ref:'speakers'}],
    studentsIds:[{type:Number,ref:'students'}],
});
module.exports=mongooose.model('events',eventSchema);