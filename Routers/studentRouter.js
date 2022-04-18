const express = require('express');
const {body,param,query} = require('express-validator');
const authMW = require('./../MiddleWares/authMiddleWare');
const router = express.Router();
const studentController = require('../Controllers/studentController');

router.use(authMW);

router.route('/students/:id')
    .get(studentController.getStudentById)
    .post([body('id').isInt().withMessage('id must be an integer')],studentController.updateStudent)
    .delete([body('id').isInt().withMessage('id must be an integer')],studentController.deleteStudent);

router.route('/students')
    .get(studentController.getAllStudents)
    .post([body('id').isInt().withMessage('id must be an integer'),
    body('email').isEmail().withMessage('email must be an email'),
    body('password').isLength({min:5}).withMessage('password must be at least 5 characters long')],
    studentController.createStudent);

module.exports = router;