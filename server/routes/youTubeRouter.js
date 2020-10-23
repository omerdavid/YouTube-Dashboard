const express = require('express');
const router = express.Router();
let youTubeService = require('../services/youTubeService.js');
const logger=require('../services/log-handler');

router.route('/').get(async (req, res) => {
  try {
  
    let searchText = req.query.searchText;
    let user = req.user;
    let res = await youTubeService.getUserVideos(user.id);
    
    let userVideo=  youTubeService.createDto(res);
    
        
    res.status(200).json({ "statusCode": 200, "res1":userVideo });
  }
  catch (err) { logger.debug(err); }
});


router.route('/addVideo').post(async (req, res) => {
  try {
  
    let videoId = req.body.videoId;
    let keyWords = req.body.keyWords;
    let user = req.user;


    let newAddedVideos = await youTubeService.addVideo(videoId, keyWords, user.id); 

    //let userVideos = await youTubeService.getUserVideos(user.id);

    let rankedVideos=await youTubeService.rankVideos(newAddedVideos);
   
    await youTubeService.updateVideos(rankedVideos);

    res.status(200).json({ "statusCode": 200, "res": rankedVideos });
  }

  catch (err) { logger.debug(err); }
});


module.exports = router;