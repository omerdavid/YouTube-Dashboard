const express = require('express');
const router = express.Router();
let youTubeService = require('../services/youTubeService.js');
const logger=require('../services/log-handler');

router.route('/').get(async (req, res) => {

 try {
   
    let user = req.user;
   
    let userVideos = await youTubeService.getUserVideos(user.id);
    
    let userVideo=  youTubeService.createDto(userVideos);
    for(let s of userVideo){
      for (let k of s.keyWords)
      {
     logger.debug(k.data,' after add new  :');  
      }
    }
    res.status(200).json(userVideo);
 }
  catch (err) 
  { 
    logger.debug(err);
   }
});


router.route('/addVideo').post(async (req, res) => {
  try {
 
  
    let videoId = req.body.videoId;
    let keyWords = req.body.keyWords;
    let user = req.user;
    const videoName=req.body.videoName;

    
    let newAddedVideos = await youTubeService.addVideo(videoId,videoName ,keyWords, user.id); 

    //let userVideos = await youTubeService.getUserVideos(user.id);

    let rankedVideos=await youTubeService.rankVideos(newAddedVideos);
  
   let updatedVideos= await youTubeService.updateVideos(rankedVideos);
  
    let userVideo=  youTubeService.createDto(updatedVideos);
    
    for(let s of userVideo){
      for (let k of s.keyWords)
      {
     logger.debug(k.data,'userVideo :');  
      }
    }
    res.status(200).json({ "statusCode": 200, "res": userVideo });
  }

  catch (err) { logger.debug(err); }
});


module.exports = router;