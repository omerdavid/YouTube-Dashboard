const express = require('express');
const router=express.Router();
const  passport  =  require('passport');
const  authService= require('../services/authService');



router.route('/').get((req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "hello youTubeAPi"});
});

module.exports=router;