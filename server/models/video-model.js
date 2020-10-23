var mongoose = require('mongoose');
const dbConfig = require('../config/db');
const mongooseService = require('../services/mongooseService.js')

let Video = mongoose.model('Video', {

    videoId: String,
    userId: String,
    dateChecked: String,
    rank: String,
    keyWord:String


});

let videoModel = {
    addVideo:async (videoId, keyWord,userId,rank,dateChecked) => {
    try{ 
     
        const col=await mongooseService.collection('videos');

        
      //  let userVideos=  await col.find({'userId':userId});
     //   console.log(userVideos);

  let _video= await  col.findOne({ videoId: videoId,keyWord:keyWord });
         
                if (!_video) {
                    console.log('new  _video :', _video);
                    _video = new Video();
                    _video.videoId = videoId;
                    _video.userId = userId;
                    _video.dateChecked = dateChecked;
                    _video.keyWord=keyWord;
                    _video.rank=rank;
                    
                 let response=await   col.insertOne(_video);
                
                 return response.ops[0];
                }
                else {
                    // console.log('els video already exist:', _video);
                    return _video;
                 
                }
            }catch(err){

                console.log(err);
                throw err;
            }
    },
    updateVideos:async(userVideos)=>{
        Video.updateMany('videoId', {'$set': {
            'rank': rank,
      }},function(docs){
          console.log(docs);
      })
     // const col=  await mongooseService.collection('videos');
      //col.updateMany();
    },
   findVideosByUserId:async(userId)=>{

    

    const videoCol=await mongooseService.collection('videos');
  let userVideos=  await videoCol.find({'userId':userId}).toArray();
  return userVideos;

   },

    findById: (_videoId, cb) => {

        mongoose.connect(dbConfig.url + dbConfig.DB, { useNewUrlParser: true, useUnifiedTopology: true });


        const db = mongoose.connection;

        db.collection('videos').findOne({ videoId: _videoId })
            .then((_video) => {
                cb(_video);
            });
    }
}

module.exports = { videoModel: videoModel, Video: Video };