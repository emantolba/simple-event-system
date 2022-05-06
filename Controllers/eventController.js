const {validationResult}=require("express-validator");
const Event = require('./../Models/eventModel');


module.exports.getAllEvents = (req, res,next) => {
    console.log(req.role);
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.find({}).populate({path:"mainSpeakerId"}).populate({path:"otherSpeakersIds"}).populate({path:"studentsIds"})
        .then(events => {
            res.status(200).json({
                message: 'Events fetched successfully!',
                events: events
            });
        })
        .catch(err => {
            next(err);
        });
};
module.exports.createEvent = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    let result = validationResult(req);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
        let error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    let event = new Event({
        _id: req.body.id,
        title: req.body.title,
        eventDate: req.body.eventDate,
        mainSpeakerId: req.body.mainSpeakerId,
        otherSpeakersIds: req.body.otherSpeakersIds,
        studentsIds: req.body.studentsIds
    });
    event.save()
        .then(result => {
            res.status(201).json({
                message: 'Event created successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });

     
}

module.exports.deleteEvent = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.findByIdAndRemove(req.body.id)
        .then(result => {
            if(result.deletedCount==0)
                throw new Error('Event not found!');

            res.status(200).json({
                message: 'Event deleted successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });
}
  
module.exports.updateEvent = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    let result = validationResult(req);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
        let error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    Event.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        eventDate: req.body.eventDate,
        mainSpeakerId: req.body.mainSpeakerId,
        otherSpeakersIds: req.body.otherSpeakersIds,
        studentsIds: req.body.studentsIds
    }).populate({path:"mainSpeakerId"}).populate({path:"otherSpeakersIds"}).populate({path:"studentsIds"})
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            // else if(result.matchedCount==null){
            //     throw new Error('null');
            // } 

            res.status(200).json({
                message: 'Event updated successfully!',
                event: result
            });
            result.save()
        })
        .catch(err => {
            // console.log(err);
            // throw err;
           next(err);
        });
}

module.exports.addStudentToEvent=(req,res,next)=>{
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.findById(req.body.id)
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            if(result.studentsIds.includes(req.body.studentId))
                throw new Error('Student already added to event!');
            result.studentsIds.push(req.body.studentId);
            result.save()
            res.status(200).json({
                message: 'Student added successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });
}

module.exports.addSpeakerToEvent=(req,res,next)=>{
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.findById(req.body.id)
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            if(result.otherSpeakersIds.includes(req.body.speakerId))
                throw new Error('Speaker already added to event!');
            if(result.mainSpeakerId==req.body.speakerId)
                throw new Error('Speaker already added as main speaker!');
            result.otherSpeakersIds.push(req.body.speakerId);
            result.save()
            res.status(200).json({
                message: 'Speaker added successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });
}

module.exports.getEventsForSpeaker=(req,res,next)=>{
   
    if(req.role == 'admin' || req.role == 'speaker'){
    Event.find({otherSpeakersIds:req.params.id})
        .then(result => {
            if(result.matchedCount==0)
               {
                   Event.find({mainSpeakerId:req.params.id})
                     .then(result=>{
                            res.status(200).json({
                                message: 'Events fetched successfully!',
                                events: result
                            });
                        })
                        .catch(err => {
                            err = new Error('Event not found!');
                            err.statusCode = 500;
                            throw err;
                        });
               }
            res.status(200).json({
                message: 'Events fetched successfully!',
                events: result
            });
        })
        .catch(err => {
            next(err);
        });
    }

}

module.exports.getEventsForStudent=(req,res,next)=>{
    
    if(req.role == 'admin' || req.role == 'student'){
    Event.find({studentsIds:req.params.id})
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            res.status(200).json({
                message: 'Events fetched successfully!',
                events: result
            });
        })
        .catch(err => {
            next(err);
        });
    }
    else{
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
}
module.exports.speakerDeclineEvent=(req,res,next)=>{
    if( req.role != 'speaker'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.findById(req.body.id)
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            if(result.otherSpeakersIds.includes(req.params.speakerId))
                { result.otherSpeakersIds.splice(result.otherSpeakersIds.indexOf(req.params.speakerId),1);}
            else if(result.mainSpeakerId==req.params.speakerId)
                { result.mainSpeakerId=null;}
            else{
                    throw new Error('Speaker not found!');
                }

            result.save()
            res.status(200).json({
                message: 'Speaker declined successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });
}

module.exports.getEventById=(req,res,next)=>{
    Event.findById(req.params.id).populate({path:"mainSpeakerId"}).populate({path:"otherSpeakersIds"}).populate({path:"studentsIds"})
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');
            res.status(200).json({
                message: 'Event fetched successfully!',
                event: result
            });
        })
        .catch(err => {
            next(err);
        });
}