const express = require('express');
const router=express.Router();
const  passport  =  require('passport');




router.route('/').get((req, res) => {
    res.status(200).json({"statusCode" : 200 ,"message" : "hello youTubeAPi"});
});

module.exports=router;