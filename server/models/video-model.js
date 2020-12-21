var mongoose = require('mongoose');
const logger = require('../services/log-handler');
const mongooseService = require('../services/mongooseService.js');


let Video = mongoose.model('Video', new mongoose.Schema({

    videoId: String,
    videoName:String,
    userId: String,
    dateChecked: Date,
    rank: String,
    keyWord: String,
    updatedOn:Date,
    isDeleted:Boolean


}));

let videoModel = {
    addVideo: async (videoId, videoName,keyWord, userId, rank, dateChecked) => {
        try {

            const col = await mongooseService.collection('videos');
         //   let x = await Video.findOne({ videoId: videoId, keyWord: keyWord });
           
            let _video = await col.findOne({ videoId: videoId, keyWord: keyWord });
            
            if (!_video || _video.length == 0) {

                const newVideo = {
                    videoId: videoId,
                    userId: userId,
                    videoName:videoName,
                    dateChecked: dateChecked,
                    keyWord: keyWord,
                    rank: rank,
                  updatedOn:new Date(),
                    isDeleted:false
                };

                let response = await col.insertOne(newVideo);

                return response.ops[0];
            }
            else {
              
                return _video;

            }
        } catch (err) {
          logger.log();
            logger.debug(err);
            throw err;
        }
    },
    updateRankAndDateCheckedVideos: async (userVideos) => {

        try {
            const videoCol = await mongooseService.collection('videos');
            
            for (let v of userVideos) {
              
                await videoCol.updateOne({ _id: v._id }, { $set: { rank: v.rank, dateChecked: v.dateChecked } });
            }
            return userVideos;
        } catch (err) {
            logger.debug(err);
            logger.log(err);
        }
     
    },
    updateVideoName:async(videoId,_videoName)=>{
        await Video.updateMany({ videoId: videoId}, { $set: { videoName:_videoName } });
    },
    
    deleteVideoKeyWords:async(keyWord)=>{
        
        
        try {
            const videoCol = await mongooseService.collection('videos');
            
            for (let v of keyWord.data) {
              
                await videoCol.updateOne({ _id: v.id }, { $set: { isDeleted: true} });
            }
          
        } catch (err) {
            logger.debug(err);
            logger.log(err);
        }

    },
    deleteVideo:async(videoId)=>{
        try {
            const videoCol = await mongooseService.collection('videos');
              
                await videoCol.updateMany({ videoId: videoId}, { $set: { isDeleted: true} });
          
          
        } catch (err) {
            logger.debug(err);
            logger.log(err);
        }
    },
    addNewKeyWordsToVideos:async(keyWord)=>{
        try {
            const videoCol = await mongooseService.collection('videos');
            
            for (let v of keyWord.data) {
              
                await videoCol.insertOne({ _id: v.id }, { $set: { isDeleted: true} });
            }
          
        } catch (err) {
            logger.debug(err);
            logger.log(err);
        }
    },
    findVideosByUserId: async (userId) => {

        try {

            const videoCol = await mongooseService.collection('videos');
            let userVideos = await videoCol.find({$and:[{$or:[{isDeleted:{$exists:false}},{isDeleted:false}]},{'userId': userId}]  }).toArray();
            return userVideos;
        } catch (err) {
            logger.debug(err);
        }

    },

    findById:async (_videoId) => {
        try {
            const videoCol = await mongooseService.collection('videos');


            let videos = await videoCol.find({ 'videoId': _videoId }).toArray();
            return videos;
        } catch (err) { logger.debug(err); }
    }
}

module.exports = { videoModel: videoModel, Video: Video };