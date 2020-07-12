const rabbitMq = require('amqplib');
// const connection = await amqp.connect(`${config.rabbitMq.url}`);
const connection = rabbitMq.connect
const channel = await connection.createChannel();