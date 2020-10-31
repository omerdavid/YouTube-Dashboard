var mongoose = require('mongoose');
const dbConfig = require('../config/db');

let mongooseService = {

  connect: async () => {

    await mongoose.connect(dbConfig.url + dbConfig.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },
  collection: async (colName) => {
    await mongooseService.connect();
    const col = mongoose.connection.collection(colName);
    return col;
  },
  close: () => {
    mongoose.connection.close();
  }

}
module.exports = mongooseService;