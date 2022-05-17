const {validationResult}=require("express-validator");
const Student = require('./../Models/studentModel');

module.exports.getAllStudents = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Student.find({})
        .then(students => {
            res.status(200).json({
                message: 'Students fetched successfully!',
                students: students
            });
        })
        .catch(err => {
            next(err);
        });
};

module.exports.createStudent = (req, res,next) => {
    
    let result = validationResult(req);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
        let error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    let student = new Student({
        _id: req.body.id,
        email: req.body.email,
        password: req.body.password
    });
    student.save()
        .then(result => {
            res.status(201).json({
                message: 'Student created successfully!',
                student: result
            });
        })
        .catch(err => {
            next(err);
        });
};

module.exports.deleteStudent = (req, res,next) => {
    if(req.role != 'admin'){
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }
    Student.findByIdAndRemove(req.body.id)
        .then(result => {
            if(result.deletedCount==0)
                throw new Error('Student not found!');

            res.status(200).json({
                message: 'Student deleted successfully!',
                student: result
            });
        })
        .catch(err => {
            next(err);
        });
};

module.exports.updateStudent = (req, res,next) => {
    let result = validationResult(req);
    if (!result.isEmpty()) {
        let message = result.array().reduce((current, error) => current + error.msg + '\n', '');
        let error = new Error(message);
        error.statusCode = 422;
        throw error;
    }
    if(req.role == 'admin'){
        Student.findByIdAndUpdate(req.body.id, {
            email: req.body.email
        })
            .then(result => {
                res.status(200).json({
                    message: 'Student updated successfully!',
                    student: result
                });
                result.save();
            })
            .catch(err => {
                next(err);
            });

    }
    else if(req.role == 'student'){
    Student.findByIdAndUpdate(req.body.id, {
        email: req.body.email,
        password: req.body.password
    })
        .then(result => {
            res.status(200).json({
                message: 'Student updated successfully!',
                student: result
            });
            result.save()
        })
        .catch(err => {
            next(err);
        });
    }
    else
    {
        let error = new Error('You are not authorized to perform this action!');
        error.statusCode = 401;
        throw error;
    }

}

module.exports.getStudentById = (req, res,next) => {
    Student.findById(req.params.id)
        .then(student => {
            if(!student)
                throw new Error('Student not found!');

            res.status(200).json({
                message: 'Student fetched successfully!',
                student: student
            });
        })
        .catch(err => {
            next(err);
        });
};
