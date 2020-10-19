const express = require('express');
const router=express.Router();
let YouTubeService = require('../services/youTubeService.js');


router.route('/').get(async (req, res) => {
  try{
      const youTubeService=new YouTubeService();
      let searchText=req.query.searchText;
   let res1= await  youTubeService.search(searchText);
   
  
  res.status(200).json({"statusCode" : 200 ,"res1" : res1});
  }
  catch(err){console.log(err)}
});
router.route('/addVideo').post(async (req, res) => {
  try{
    console.log('addVideo');
    const youTubeService=new YouTubeService();

 console.log(req.user);
 
 let videoId=req.body.videoId; 
 let keyWords=req.body.keyWords; 
  let user=req.user;
 
 
 
 let videosPerKeyWord= await   youTubeService.addVideo(videoId,keyWords,user.id);

 videosPerKeyWord.forEach(async (video)=>{
       let videosArr= await youTubeService.search(video.keyWord);       
     let rank=  videosArr.findIndex(x=>x.videoId==video.videoId);
     video.rank=rank;
     let dateNow=Date.now();
     video.dateChecked=dateNow.getDate()+'/'+dateNow.getMonth()+1+'/'+dateNow.getYear();

     
 });
 await youTubeService.updateVideos(videosPerKeyWord);

  res.status(200).json({"statusCode" : 200 ,"res" : videosPerKeyWord});
  }
  catch(err){console.log(err)}
});
//});

module.exports=router;