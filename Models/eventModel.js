const mongooose = require('mongoose');
let eventSchema = new mongooose.Schema({
    _id:Number,
    title:{type:String,required:true},
    eventDate:{type:String,required:true},
    mainSpeakerId:{type:mongooose.ObjectId},
    otherSpeakersIds:[{type:mongooose.ObjectId}],
    studentsIds:[{type:Number}]
});
module.exports=mongooose.model('events',eventSchema);