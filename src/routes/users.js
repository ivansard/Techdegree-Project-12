const express = require('express');
const router = express.Router();

const User = require('../models').User;

router.post('/', (req, res, next) => {
    User.create(req.body, function(error, newUser){
        if(error){
            error.status = 400;
            return next(error);
        }
        return res.json(newUser); 
    })
})



module.exports = router;