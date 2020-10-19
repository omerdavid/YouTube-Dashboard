

var mongoose = require('mongoose');
const mongooseService = require('../services/mongooseService.js')

let Config = mongoose.model('Config', {
   key: String,
   value: String,

});
let configModel = {
   findKey: async ({ key }) => {

      try {
         
         const col = await mongooseService.collection('config');

         let res = await col.findOne({ key: key });

         return res;
      }
      catch (ex) {
         console.log(ex);
      } finally {
         mongooseService.close();

      }
   }
}
module.exports = { configModel: configModel, Config: Config };