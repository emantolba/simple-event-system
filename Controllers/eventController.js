const {validationResult}=require("express-validator");
const Event = require('./../Models/eventModel');


module.exports.getAllEvents = (req, res,next) => {
    console.log(req.role);
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Event.find({})
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
    })
        .then(result => {
            if(result.matchedCount==0)
                throw new Error('Event not found!');

            res.status(200).json({
                message: 'Event updated successfully!',
                event: result
            });
            result.save()
        })
        .catch(err => {
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
