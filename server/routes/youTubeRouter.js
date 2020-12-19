const express = require('express');
const router = express.Router();
let youTubeService = require('../services/youTubeService.js');
const logger=require('../services/log-handler');

router.route('/').get(async (req, res) => {

 try {
   
    let user = req.user;
   
    let userVideos = await youTubeService.getUserVideos(user.id);
    
    let userVideo=  youTubeService.createDto(userVideos);
   
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

router.route('/editVideo').post(async (req, res) => {
  try {
     
     const videoFromClient=req.body.video;
    
    let videoFromDb = await youTubeService.getVideoById(videoFromClient.videoId); 

    if(!videoFromDb||videoFromDb.length==0)
    {
      res.status(200).json({ "statusCode": 201, "res": "did not find matched video" });
    }
    //If video name was changed update the new name

      if(videoFromDb[0].videoName!=videoFromClient.videoName){
    await youTubeService.updateVideoName(videoFromClient.videoId,videoFromClient.videoName);
  }
      await youTubeService.deleteKeyWordsFromVideo(videoFromDb,videoFromClient);

      await youTubeService.addNewKeyWordsToVideos(videoFromDb,videoFromClient);
  
    //let userVideo=  youTubeService.createDto(updatedVideos);
    
   
    res.status(200).json({ "statusCode": 200, "res": videoFromDb });
  }

  catch (err) { logger.debug(err); }
});

module.exports = router;