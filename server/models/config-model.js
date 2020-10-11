

var mongoose = require('mongoose');
const dbConfig = require('../config/db');
var bcrypt = require('bcrypt');
let Config= mongoose.model('Config',{
        key: String,
    value: String,
    
});
let configModel={
 findKey:async ({key})=>{

    await mongoose.connect(dbConfig.url+dbConfig.DB,{ useNewUrlParser: true,useUnifiedTopology:true });
  
    try{
      
    const db=await mongoose.connection;
 
  let res= await  mongoose.connection.collection('config').findOne({key:key});
  return res;
    }
    catch(ex){
 console.log(ex);
    }finally {
   mongoose.connection.close();
    
    }
}
}
 module.exports ={configModel:configModel,Config:Config};