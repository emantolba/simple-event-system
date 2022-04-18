const jwt = require('jsonwebtoken');
const Student = require('./../Models/studentModel');
const Speaker = require('./../Models/speakerModel');

module.exports.login = (req,res,next)=>{
    let token;
    if(req.body.email == "admin@gmail.com" && req.body.password == "123"){
        token = jwt.sign({
            _id:1,
            email: req.body.email,
            role: "admin"
        },
        'secret',
        {
            expiresIn: '1h'
        });
        res.status(200).json({message:"Admin login successfully!",token:token});
    }
    else{
        Speaker.findOne({email:req.body.email})
        .then(result=>{
            if(!result)
                throw new Error('Speaker not found!');
            if(result.password != req.body.password)
                throw new Error('Wrong password!');
            token = jwt.sign({
                _id:result._id,
                email: result.email,
                role: "speaker"
            },
            'secret',
            {
                expiresIn: '1h'
            });
            res.status(200).json({message:"Speaker login successfully!",token:token});
        })
        .catch(err=>{
            Student.findOne({email:req.body.email})
            .then(result=>{
                if(!result)
                    throw new Error('Student not found!');
                if(result.password != req.body.password)
                    throw new Error('Wrong password!');
                token = jwt.sign({
                    _id:result._id,
                    email: result.email,
                    role: "student"
                },
                'secret',
                {
                    expiresIn: '1h'
                });
                res.status(200).json({message:"Student login successfully!",token:token});
            })
            .catch(err=>{
                next(err);
            });
        });

        
    } 
}

