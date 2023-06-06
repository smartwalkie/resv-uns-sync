const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.UNSCollections = require("./uns-collection.model.js")(mongoose);
db.SoldItems = require("./sold-items.model.js")(mongoose);
db.Timestamp = require("./timestamp.model.js")(mongoose);
db.connectDatabase = async (onConnect) => {
    try {
        const cons = await mongoose.connect(process.env.DATABASE, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected db to: ', cons.connection.host);
        onConnect();
    } catch (error) {
        console.log('Failed connected DB', error);
    }
};

module.exports = db;

