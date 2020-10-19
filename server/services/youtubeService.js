const {configModel} = require('../models/config-model');
const {videoModel}=require('../models/video-model');
const axios = require('axios');

 class YouTubeService{ 
     constructor(){

     }
    async search (keyWord){

        let apiUrl=await configModel.findKey({key:'youTubeUrl'});
        let apiKey=  await configModel.findKey({key:'googleApiKey'});

     
       apiUrl.value+=`&q=${keyWord}&key=${apiKey.value}`;
      const _url=new URL(apiUrl.value);
      
      
       let res=await axios({
          method: 'get',
          url: _url.toString()
        });
        return res.data.items;
    };
    async addVideo(videoId,keyWord,userId,rank,dateChecked){
        console.log('addVideo');
        keyWord.forEach(async keyWord=>{
            let newVideo=  await videoModel.addVideo(videoId,keyWord,userId,rank,dateChecked);
        })
        let userVideos=await this.getUserVideos(userId);
        return userVideos;

    };
    async updateVideos(userVideos){
 
    };
    async getUserVideos(userId){
      // const videos= await mongoose.collection('videos');
    let userVideos=  await videoModel.findVideosByUserId(userId);
     userVideos.forEach((video)=>{
           
     });

    }
}
module.exports =YouTubeService;