const express = require('express');
const router=express.Router();
const  passport  =  require('passport');
const {configModel} = require('../models/config-model');
const axios = require('axios');


router.route('/').get(async (req, res) => {
  try{

    let apiUrl=await configModel.findKey({key:'youTubeUrl'});
  let apiKey=  await configModel.findKey({key:'googleApiKey'});
 let searchText=req.query.searchText;
 apiUrl.value+=`&q=${searchText}&key=${apiKey.value}`;
const _url=new URL(apiUrl.value);


 let res1=await axios({
    method: 'get',
    url: _url.toString()
  });
  
  res.status(200).json({"statusCode" : 200 ,"res1" : res1.data.items});
  }
  catch(err){console.log(err)}
});

//});

module.exports=router;