const { configModel } = require('../models/config-model');
const { videoModel } = require('../models/video-model');
const axios = require('axios');
const logger = require('./log-handler');
const moment=require('moment');

const  youTubeService= {
   
    search:  async (keyWord)=> {
        try {
            let apiUrl = await configModel.findKey({ key: 'youTubeUrl' });
            let apiKey = await configModel.findKey({ key: 'googleApiKey' });

            logger.debug('test logger');
            apiUrl.value += `&q=${keyWord}&key=${apiKey.value}`;
            const _url = new URL(apiUrl.value);


            let res = await axios({
                method: 'get',
                url: _url.toString()
            });
            return res.data.items;
        } catch (err) { logger.debug(err); }
    },
    addVideo: async (videoId, keyWords, userId, rank, dateChecked) =>{
        try {
            logger.debug('test addVideo');
            for (const keyWord of keyWords) {

                await videoModel.addVideo(videoId, keyWord, userId, rank, dateChecked);

            }
           // return userVideos;

        } catch (err) { logger.debug(err); }
    },
    updateVideos:async (userVideos)=> {

    },
    rankVideos:  async (videosPerKeyWord)=> {
   
      
        for (let video of videosPerKeyWord) {
            let videosArr = await youTubeService.search(video.keyWord);
            let rank = videosArr.findIndex(x => x.id.videoId == video.videoId);
            video.rank = rank;
            video.dateChecked =moment().format('DD/MM/yyyy');;
        }
        return videosPerKeyWord;
    },
    getUserVideos:  async (userId)=> {
        try {
            let userVideos = await videoModel.findVideosByUserId(userId);
           
            return userVideos;
        } catch (err) { logger.debug(err); }
    }
}
module.exports = youTubeService;