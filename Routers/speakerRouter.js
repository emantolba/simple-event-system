const express = require('express');
const {body,param,query} = require('express-validator');
const authMW = require('./../MiddleWares/authMiddleWare');

const router = express.Router();
const speakerController = require('./../Controllers/speakerController');
router.use(authMW);

router.route("/speakers")
    .get(speakerController.getAllSpeakers)
    .post([body('email').isEmail().withMessage('email must be an email'),
    body('password').isLength({min:6}).withMessage('password must be at least 6 characters long'),
    body('userName').isLength({min:3}).withMessage('userName must be at least 3 characters long'),
    body('Address.city').isLength({min:3}).withMessage('city must be at least 3 characters long'),
    body('Address.street').isLength({min:3}).withMessage('street must be at least 3 characters long'),
    body('Address.building').isLength({min:3}).withMessage('building must be at least 3 characters long')],
    speakerController.createSpeaker)
    .delete(speakerController.deleteSpeaker)
    .put(speakerController.updateSpeaker);

router.get('/speakers/:id',
[param('id').isMongoId().withMessage('id must be a valid mongo id')],
speakerController.getSpeakerById);

module.exports=router;

    