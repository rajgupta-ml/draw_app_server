import Redis from "ioredis";


let REDIS_CLIENT : Redis | null = null;


const connectToRedis = (): Redis=> {
    if(!REDIS_CLIENT){
        REDIS_CLIENT = new Redis()
    }

    return REDIS_CLIENT
}

export default connectToRedis;