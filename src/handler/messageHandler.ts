import type WebSocket from "ws";
import RoomManger, { type RoomMemberTypes } from "../manager/RoomManger";
import { MessageType } from "../zod/schema.sharelink";
import connectToRedis from "../config/redis";
import { compressToBase64 } from "lz-string";
import { handleCompression } from "../utils/lz";

export type MessageDispactarType = {
    type : MessageType,
    name : string,
    roomId : string
    message? : string ,
    ws : WebSocket
}

export class MessageHandler {

    private static redis = connectToRedis();
    static async dispatchMessage (args : MessageDispactarType){
        const {type} = args
        switch (type) {
            case MessageType.JOIN_ROOM :
                await this.handleJoinRoom(args)
                break;
                case  MessageType.SESSION_UPDATED:
            case MessageType.SESSION_CREATED:
            case MessageType.SESSION_DELETED:
                this.handleShareDrawState(args)
                break;
            case MessageType.SAVE_DRAW_STATE:
                await this.handleSaveDrawState(args)
                break
            default :
                return {
                    type : "unknow",
                    result : null,
                    error : true
                }
        }
    }


    private static async handleJoinRoom (args : MessageDispactarType) {
        const{name, ws, roomId}  = args;
        const newRoomMember : RoomMemberTypes = {
            name,
            ws,
        }
        const roomResult = RoomManger.addRoomMember(roomId, newRoomMember);
        const state = await this.redis.get(roomId);
        if(!state){
            this.redis.set(roomId, "");
        }

        ws.send(JSON.stringify({...roomResult, type : MessageType.JOIN_ROOM}))
        // return {...roomResult, type : MessageType.JOIN_ROOM};
    }


    private static async handleShareDrawState(args : MessageDispactarType) {
        

        try {
            const { ws : SenderWs, roomId, message} = args
            if(!message){
                return 
            }
        
            const roomMembers = RoomManger.getRoomMembers(roomId)!
            for(let i = 0; i < roomMembers.length; i++) {
                const roomMember = roomMembers[i]!;
                const {ws} = roomMember;
                if(ws === SenderWs){
                    continue;
                }
                const newMessage = {
                    type : "shape-data",
                    message : JSON.parse(message)
                }
    
                ws.send(JSON.stringify(newMessage));
            }
        } catch (error) {
            console.log(error);    
        }
    }

    private static async handleSaveDrawState(args : MessageDispactarType) {
        // Check if the redis latest state is similar to old state if so don't do anything else save the state

        const {message, roomId} = args;
        if(!message){
            return
        }
        const state = await this.redis.get(roomId)

        if(state){
            const {result, error } = handleCompression(message)
            if(error){
                return;
            }
            if(result){
                this.redis.set(roomId, result)
            }
        }

    }
}