const mongoose = require("mongoose");
require('dotenv').config({path: '../.env'})

const connectDb = async () => {
    let url = `mongodb://${process.env.MongoHost}:${process.env.MongoPort}/${process.env.MongoDB}`;
    try {
        const connect = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(
            "Database connected ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
module.exports = connectDb;