require('dotenv').config()
const mongoose = require('mongoose')
let uri;

if (process.env.NODE_ENV == 'test') {
    uri = process.env.MONGODB_URL_TEST
} else {
    uri = process.env.MONGODB_URL
}

console.log('uri uri', uri)

// process.env.NODE_ENV === 'test'
//     ? (url = config.MONGODB.TESTDB)
//     : (url = config.MONGODB.MONGODBURL);
// console.log(url);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((res) => {
    const connectionString = res.connections[0].client.s.url;
    console.log(`connected to database with connectionString: ${connectionString} successfully`)
}).catch((err) => {
    console.log('error connecting to database', err)
    process.exit(1)
})