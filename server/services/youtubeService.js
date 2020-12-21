const { configModel } = require('../models/config-model');
const { videoModel } = require('../models/video-model');
const axios = require('axios');

const logger = require('./log-handler');



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
      let updatedVideos=  await videoModel.updateRankAndDateCheckedVideos(userVideos);
      return updatedVideos;
    },
    updateVideoName:async(videoId,VideoName)=>{
          await videoModel.updateVideoName(videoId,VideoName);
        
    },
    deleteKeyWordsFromVideo:async(videoFromDb,videoFromClient)=>{

          const dbKeyWords=youTubeService.createDto(videoFromDb);
          const clientKeyWords=videoFromClient.keyWords;
          

         let keyWordsToDelete= dbKeyWords[0].keyWords.filter(v=>!clientKeyWords.find(g=>g.name==v.name));

          for(let keyWord of keyWordsToDelete){
            await videoModel.deleteVideoKeyWords(keyWord);
          }
      
         
    },
    addNewKeyWordsToVideos:async(videoFromDb,videoFromClient,userId)=>{
         
        const dbKeyWords=youTubeService.createDto(videoFromDb)[0];
          const clientKeyWords=videoFromClient.keyWords;
          

         let keyWordsToAdd=clientKeyWords.filter(v=>!dbKeyWords.keyWords.find(g=>g.name==v.name));
          
            await  youTubeService.addVideoAndKeyWords(dbKeyWords.videoId,dbKeyWords.videoName,keyWordsToAdd,userId);
         
    },
    addVideoAndKeyWords:async(videoId,videoName ,keyWords, userId)=>{

        let newAddedVideos = await youTubeService.addVideo(videoId,videoName ,keyWords, userId); 

        let rankedVideos=await youTubeService.rankVideos(newAddedVideos);
      
       let updatedVideos= await youTubeService.updateVideos(rankedVideos);

       return updatedVideos;
    },
    deleteVideo:async(videoId)=>{

        await videoModel.deleteVideo(videoId);

    },
    rankVideos: async (videosPerKeyWord) => {


        for (let video of videosPerKeyWord) {
            let videosArr = await youTubeService.search(video.keyWord);
            let rank = videosArr.findIndex(x => x.id.videoId == video.videoId);
            
            video.rank = rank + 1;
            video.dateChecked =new Date();// moment().format('DD/MM/yyyy').toDate();
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
    getVideoById:async(videoId)=>{
        try {
            let videos = await videoModel.findById(videoId);

            return videos;

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
                        rank: kw.rank,
                        id:kw._id
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