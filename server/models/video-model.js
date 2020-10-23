var mongoose = require('mongoose');
const dbConfig = require('../config/db');
const logger = require('../services/log-handler');
const mongooseService = require('../services/mongooseService.js')

let Video = mongoose.model('Video', {

    videoId: String,
    userId: String,
    dateChecked: String,
    rank: String,
    keyWord: String


});

let videoModel = {
    addVideo: async (videoId, keyWord, userId, rank, dateChecked) => {
        try {

            const col = await mongooseService.collection('videos');

            let _video = await col.findOne({ videoId: videoId, keyWord: keyWord });

            if (!_video) {
                console.log('new  _video :', _video);
                _video = new Video();
                _video.videoId = videoId;
                _video.userId = userId;
                _video.dateChecked = dateChecked;
                _video.keyWord = keyWord;
                _video.rank = rank;

                let response = await col.insertOne(_video);

                return response.ops[0];
            }
            else {
                // console.log('els video already exist:', _video);
                return _video;

            }
        } catch (err) {

            logger.debug(err);
            throw err;
        }
    },
    updateVideos: async (userVideos) => {

        try {
            const videoCol = await mongooseService.collection('videos');
           
            for (let v of userVideos) {
                videoCol.updateOne({ _id: v._id }, {$set:{ rank: v.rank ,dateChecked: v.dateChecked }});
            }
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