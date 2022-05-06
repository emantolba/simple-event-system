const Speaker = require('../Models/speakerModel');
const {validationResult}=require("express-validator");
const { default: mongoose } = require('mongoose');
const mongooose = require('mongoose');
const Cryptr = require('cryptr');
const Crypto = new Cryptr('myTotalySecretKey');

module.exports.getAllSpeakers = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Speaker.find({})
        .then(speakers => {
            res.status(200).json({
                message: 'Speakers fetched successfully!',
                speakers: speakers
            });
        })
        .catch(err => {
            next(err);
        });
};

module.exports.createSpeaker = (req, res,next) => {
        
        let result = validationResult(req);
        if (!result.isEmpty()) {
            let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
            let error = new Error(message);
            error.statusCode = 422;
            throw error;
        }
        let speaker = new Speaker({
            _id: mongoose.Types.ObjectId(),
            email: req.body.email,
            password: Crypto.encrypt(req.body.password),
            userName: req.body.userName,
            Address: req.body.Address
        });
        speaker.save()
            .then(result => {
                res.status(201).json({
                    message: 'Speaker created successfully!',
                    speaker: result
                });
            })
            .catch(err => {
                next(err);
            });
    };

    module.exports.deleteSpeaker = (req, res,next) => {
        if(req.role != 'admin'){
            let error = new Error('You are not authorized to perform this action!');
            error.statusCode = 401;
            throw error;
        }
        Speaker.findByIdAndRemove(req.body.id)
            .then(result => {
                if(result.deletedCount==0)
                    throw new Error('Speaker not found!');

                res.status(200).json({
                    message: 'Speaker deleted successfully!',
                });
            })
            .catch(err => {
                next(err);
            });
    };
module.exports.updateSpeaker = (req, res,next) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
        let error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    if(req.role == 'admin'){
    Speaker.findByIdAndUpdate(req.body.id,{
        email: req.body.email,
        Address: req.body.Address
    })
        .then(result => {
            res.status(200).json({
                message: 'Speaker updated successfully!',
                speaker: result
            });
        })
        .catch(err => {
            next(err);
        });
    }
    else if (req.role == 'speaker'){
        Speaker.findByIdAndUpdate(req.body.id,{
            email: req.body.email,
            userName: req.body.userName,
            password: Crypto.encrypt(req.body.password) ,
            Address: req.body.Address
        })
            .then(result => {
                res.status(200).json({
                    message: 'Speaker updated successfully!',
                    speaker: result
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

module.exports.getSpeakerById = (req, res,next) => { 
    Speaker.findById(req.params.id)
        .then(speaker => {
            if(!speaker)
                throw new Error('Speaker not found!');
            speaker.password = Crypto.decrypt(speaker.password);
            res.status(200).json({
                message: 'Speaker fetched successfully!',
                speaker: speaker
            });
        })
        .catch(err => {
            next(err);
        });
}