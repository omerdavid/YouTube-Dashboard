const { configModel } = require('../models/config-model');
const { videoModel } = require('../models/video-model');
const axios = require('axios');

const logger = require('./log-handler');

const moment = require('moment');

const {groupBy,map}=require('lodash');


const youTubeService = {

    search: async (keyWord) => {
        try {
            let apiUrl = await configModel.findKey({ key: 'youTubeUrl' });
            let apiKey = await configModel.findKey({ key: 'googleApiKey' });


            apiUrl.value += `&q=${keyWord}&key=${apiKey.value}`;
            const _url = new URL(apiUrl.value);


            let res = await axios({
                method: 'get',
                url: _url.toString()
            });
            return res.data.items;
        } catch (err) { logger.debug(err); }
    },
    addVideo: async (videoId, keyWords, userId, rank, dateChecked) => {
        try {
            const newAddedVideos = [];
            for (const keyWord of keyWords) {

                let newVideo = await videoModel.addVideo(videoId, keyWord, userId, rank, dateChecked);
                newAddedVideos.push(newVideo);

            }
            return newAddedVideos;

        } catch (err) { logger.debug(err); }
    },
    updateVideos: async (userVideos) => {
        await videoModel.updateVideos(userVideos);
    },
    rankVideos: async (videosPerKeyWord) => {


        for (let video of videosPerKeyWord) {
            let videosArr = await youTubeService.search(video.keyWord);
            let rank = videosArr.findIndex(x => x.id.videoId == video.videoId);
            video.rank = rank + 1;
            video.dateChecked = moment().format('DD/MM/yyyy');;
        }
        return videosPerKeyWord;
    },
    getUserVideos: async (userId) => {
        try {
            let userVideos = await videoModel.findVideosByUserId(userId);

            return userVideos;

        } catch (err) { logger.debug(err); }
    },
    createDto: (userVideo) => {
        const gr =groupBy(userVideo, 'videoId');

        logger.debug(gr);
        for (let g in gr) {
            logger.debug(gr[g]);

            gr[g]=groupBy(gr[g], 'keyWord');
            
            logger.debug(gr);
        } 

        


        return gr;
    }
}
module.exports = youTubeService;