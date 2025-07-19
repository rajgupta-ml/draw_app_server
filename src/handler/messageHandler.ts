import type WebSocket from "ws";
import RoomManger, { type RoomMemberTypes } from "../manager/RoomManger";
import { MessageType } from "../zod/schema.sharelink";

export type MessageDispactarType = {
    type : MessageType,
    name : string,
    roomId : string
    message? : string ,
    ws : WebSocket
}

export class MessageHandler {
    static dispatchMessage (args : MessageDispactarType){
        const {type} = args

        switch (type) {
            case MessageType.JOIN_ROOM :
                return this.handleJoinRoom(args)

            default :
                return {
                    result : null,
                    error : false
                }
        }


    }


    private static handleJoinRoom (args : MessageDispactarType) {
        const{name, ws, roomId}  = args;
        const newRoomMember : RoomMemberTypes = {
            name,
            ws,
        }
        return RoomManger.addRoomMember(roomId, newRoomMember)
    }
}