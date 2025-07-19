import { Router, type Request, type Response } from "express";
import { roomRequestSchema, ShapeDataSchema } from "../../zod/schema.sharelink";
import { handleCompression, handleDecompress } from "../../utils/lz";
import connectToRedis from "../../config/redis";
import RoomManger from "../../manager/RoomManger";

const shareRouter = Router();


shareRouter.post("/generate-share-link", (request: Request, response: Response) => {
        const {data, error} = ShapeDataSchema.safeParse(request.body);


    if(error){
        response.status(400).json({
            success : false,
            message : "Bad Request",
            error : error.cause,
        })
        return;
    }

    const {result, error : err} = handleCompression(data.json);
    if(err){
        response.status(500).json({
            success : false,
            message : "Internal Server Error",
            error,
        })
        return;
    }

    if(result){
        const redis = connectToRedis();
        redis.set(data.id, result);
    }
    response.status(200).json({
        success : true,
        message : "Success"
    })
})


shareRouter.get("/get-shape-data", async(request : Request, response : Response) => {
    // This id can be a roomId and share link id 
    const id  = request.query.id as string ;
    if(!id){
        response.status(400).json({
            success : false,
            message : "Bad Request",
            error : "Id is required",
        })
        return;
    }

    const redis = connectToRedis();
    const data = await redis.get(id);

    if(!data){
        response.status(400).json({
            success : false,
            message : "Shape data not available",
        })
        return
    }

    const {result, error} = handleDecompress(data);


    if(error){
        response.status(400).json({
            success : false,
            message : "Could not decompress the data",
        })
        return
    }

    response.status(200).json({
        success : true,
        json : result,        
    })
})


shareRouter.post("/create-room", async(request : Request, response : Response) => {
    const {data, error } = roomRequestSchema.safeParse(request.body);

    if(error){
        response.status(400).json({
            success : false,
            message : "Id and name is required",
        })
        return;
    }

    if(data) {
        // For scalable Architecture this should be redis atleast
        const result = RoomManger.addRoomMember(data.id)
        response.status(200).json({
            success : true,
            message : result
        })
    }

})







shareRouter.route
export default shareRouter