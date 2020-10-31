const { configModel } = require('../models/config-model');
const { videoModel } = require('../models/video-model');
const axios = require('axios');

const logger = require('./log-handler');

const moment = require('moment');

const { groupBy } = require('lodash');

const youTubeService = {

    search: async (keyWord) => {
        try {
            let apiUrl = await configModel.findKey({
                key: 'youTubeUrl'
            });
            let apiKey = await configModel.findKey({
                key: 'googleApiKey'
            });


            apiUrl.value += `&q=${keyWord}&key=${apiKey.value}`;
            const _url = new URL(apiUrl.value);


            let res = await axios({
                method: 'get',
                url: _url.toString()
            });
            return res.data.items;
        } catch (err) {
            logger.debug(err);
        }
    },
    addVideo: async (videoId, videoName,keyWords, userId, rank, dateChecked) => {
        try {
            const newAddedVideos = [];

            for (let keyWord of keyWords) {

                let newVideo = await videoModel.addVideo(videoId,videoName, keyWord.name, userId, rank, dateChecked);
                newAddedVideos.push(newVideo);

            }
            return newAddedVideos;

        } catch (err) {
            logger.debug(err);
        }
    },
    updateVideos: async (userVideos) => {
        await videoModel.updateVideos(userVideos);
    },
    rankVideos: async (videosPerKeyWord) => {


        for (let video of videosPerKeyWord) {
            let videosArr = await youTubeService.search(video.keyWord);
            let rank = videosArr.findIndex(x => x.id.videoId == video.videoId);
            video.rank = rank + 1;
            video.dateChecked = moment().format('DD/MM/yyyy');
        }
        return videosPerKeyWord;
    },
    getUserVideos: async (userId) => {
        try {
            let userVideos = await videoModel.findVideosByUserId(userId);

            return userVideos;

        } catch (err) {
            logger.debug(err);
        }
    },
    createDto: (userVideo) => {
        const gr = groupBy(userVideo, 'videoId');
        let arr = [];
    
        for (let g in gr) {
            const newObj = {};
            newObj.videoId = g;
           newObj.videoName=gr[g][0].videoName;
            const keyWords = groupBy(gr[g], 'keyWord');
            let videsoKeyWords = [];
            for (let k in keyWords) {

                let x = keyWords[k].map(kw => {

                    return {
                        dateChecked: kw.dateChecked,
                        rank: kw.rank
                    };
                });
                videsoKeyWords.push({
                    name: k,
                    data: x
                });
            }
            newObj.keyWords = videsoKeyWords;
            arr.push(newObj);


        }

        return arr;
    }
}
module.exports = youTubeService;