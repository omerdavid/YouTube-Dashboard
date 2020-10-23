const express = require('express');
const router = express.Router();
let youTubeService = require('../services/youTubeService.js');
const logger = require('pino')()

router.route('/').get(async (req, res) => {
  try {
   // const youTubeService = new YouTubeService();
//
    let searchText = req.query.searchText;

    let res1 = await youTubeService.search(searchText);


    res.status(200).json({ "statusCode": 200, "res1": res1 });
  }
  catch (err) { logger.debug(err); }
});
router.route('/addVideo').post(async (req, res) => {
  try {
   
  //  const youTubeService = new YouTubeService();



    let videoId = req.body.videoId;
    let keyWords = req.body.keyWords;
    let user = req.user;

   

    let videosPerKeyWord = await youTubeService.addVideo(videoId, keyWords, user.id); 

    let userVideos = await youTubeService.getUserVideos(user.id);

    let rankedVideos=await youTubeService.rankVideos(userVideos);
   
    await youTubeService.updateVideos(rankedVideos);

    res.status(200).json({ "statusCode": 200, "res": videosPerKeyWord });
  }

  catch (err) { logger.debug(err); }
});
//});

module.exports = router;