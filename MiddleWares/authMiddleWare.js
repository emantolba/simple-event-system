const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    let token,decodedToken;
    try{
        token = req.headers.authorization.split(" ")[1];
        decodedToken = jwt.verify(token,'secret');
        req.userData = {
            email: decodedToken.email,
            role: decodedToken.role
        };
        
    }
    catch(err){
        let error = new Error('Not authenticated!');
        error.statusCode = 401;
        next(error);
    }
    req.role = decodedToken.role;
    next();
}