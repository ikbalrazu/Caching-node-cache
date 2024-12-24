const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'lkl5nRQqk900oIUIuDEaj1zrkRCOgmi6',
    socket: {
        host: 'redis-16311.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16311
    }
});

const redisConnect = async() => {
    try {
        client.on('error', err => console.log('Redis Client Error', err));
        
        await client.connect();
        console.log("Connected to Redis");

    } catch (error) {
        console.log(error);
    }
}

module.exports = {client, redisConnect}





