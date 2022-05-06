const express = require('express');
const {body,param,query} = require('express-validator');
const authMW = require('./../MiddleWares/authMiddleWare');
const router = express.Router();
const eventController = require('../Controllers/eventController');

router.use(authMW);

router.route('/events')
    .get(eventController.getAllEvents)
    .post([body('id').isInt().withMessage('id must be an integer')],eventController.createEvent)
    .delete(eventController.deleteEvent)
    .put(eventController.updateEvent);


router.post('/events/addstudent',[body('id').isInt().withMessage('id must be an integer'),body('studentId').isInt().withMessage('studentId must be an integer')],eventController.addStudentToEvent);
router.get('/events/:id',eventController.getEventById);
router.post('/events/addspeaker',[body('id').isInt().withMessage('id must be an integer'),body('speakerId').isInt().withMessage('speakerId must be an integer')],eventController.addSpeakerToEvent);
router.get('/events/speakers/:id',eventController.getEventsForSpeaker);
router.get('/events/students/:id',eventController.getEventsForStudent);
router.put('/events/speakers/:speakerId',eventController.speakerDeclineEvent);
module.exports = router;