var mongoose = require('mongoose');
const dbConfig = require('../config/db');
const logger = require('../services/log-handler');
const mongooseService = require('../services/mongooseService.js')

let Video = mongoose.model('Video', new mongoose.Schema({

    videoId: String,
    videoName:String,
    userId: String,
    dateChecked: String,
    rank: String,
    keyWord: String


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
                    rank: rank
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
    updateVideos: async (userVideos) => {

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
        // videoCol.updateMany(
        // { _id: { $in: _ids } },
        // { $set: { rank : 'rank' }},
        // { $set: { dateChecked : 'rank' }}
        // );

        // const col=  await mongooseService.collection('videos');
        //col.updateMany();
    },
    findVideosByUserId: async (userId) => {

        try {

            const videoCol = await mongooseService.collection('videos');
            let userVideos = await videoCol.find({ 'userId': userId }).toArray();
            return userVideos;
        } catch (err) {
            logger.debug(err);
        }

    },

    findById: (_videoId, cb) => {
        try {
            mongoose.connect(dbConfig.url + dbConfig.DB, { useNewUrlParser: true, useUnifiedTopology: true });


            const db = mongoose.connection;

            db.collection('videos').findOne({ videoId: _videoId })
                .then((_video) => {
                    cb(_video);
                }).catch((err) => {
                    logger.debug(err);
                });
        } catch (err) { logger.debug(err); }
    }
}

module.exports = { videoModel: videoModel, Video: Video };