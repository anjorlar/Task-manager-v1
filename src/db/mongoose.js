require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, {
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