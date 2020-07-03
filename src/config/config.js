const dotenv = require('dotenv');
dotenv.config();
const config = {
    PORT: process.env.PORT,
    JWTSECRET: process.env.JWTSECRET,
    MONGODB: {
        MONGODBURL: process.env.MONGODBURL,
        TESTDB: process.env.TESTDB
    },
    ACCESSTYPE: {
        USER: 'auth'
    },
    RABBITMQ: {
        RABBIT_HOST: process.env.RABBIT_HOST,
        RABBIT_PORT: process.env.RABBIT_PORT || 5672,
        RABBIT_USERNAME: process.env.RABBIT_USERNAME,
        RABBIT_PASSWORD: process.env.RABBIT_PASSWORD
    },
    email: {
        NODEMAILER_USER: process.env.NODEMAILER_USER,
        NODEMAILER_PORT: process.env.NODEMAILER_PORT,
        NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
        NODEMAILER_HOST: process.env.NODEMAILER_HOST,
        NODEMAILER_SERVICE: process.env.NODEMAILER_SERVICE
    }
};
module.exports = config;


const mongoose = require('mongoose');
const config = require('../config/index');
let url = '';
process.env.NODE_ENV === 'test'
    ? (url = config.MONGODB.TESTDB)
    : (url = config.MONGODB.MONGODBURL);
console.log(url);

mongoose

    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(res => {
        console.log('database connected', url);
    })
    .catch(e => {
        console.log(e);
    });
module.exports = mongoose;