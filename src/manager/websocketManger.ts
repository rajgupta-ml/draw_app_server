import Websocket, { WebSocketServer } from "ws"
import { config } from "../config/config";
import type { Express } from "express";
import type { Server } from "http";
import { safeFnCallSync, type safeResultType } from "../utils/safeFnCall";
import { buffer } from "stream/consumers";
import { safeParse } from "zod";
import { messageSchema, MessageType } from "../zod/schema.sharelink";
import RoomManger from "./RoomManger";
import { MessageHandler, type MessageDispactarType } from "../handler/messageHandler";
import { Console } from "console";


class WebsocketManager {
    wss : WebSocketServer | null = null;

    init (app : Server) : safeResultType<WebSocketServer, Error> {

        if(!this.wss){
            const context = safeFnCallSync<WebSocketServer, Error>(() => new WebSocketServer({server : app}))
            this.wss = context.result
            return {result : context.result, error : context.error};
        }

        return {result : this.wss, error : null}
    
    }

    startConnection () {
        if(!this.wss){
            console.error("Websocket is not created");
            return
        }

        this.wss.on("connection", (ws : Websocket) => {
            console.log("Connection Created");

            ws.on("message", async (bufferMessage : Websocket.RawData) => {
                const message = bufferMessage.toString()
                console.log(message)
                    const {data, error} = messageSchema.safeParse(JSON.parse(message));

                    if(error){
                        ws.send("Wrong Format of message")
                    }else{

                        const {message, name, roomId, type} = data
                        const args : MessageDispactarType = {
                            message,
                            name,
                            roomId,
                            type,
                            ws
                        }
                        const result = await MessageHandler.dispatchMessage(args);
                        ws.send(JSON.stringify(result))                      
                        
                    }


            })      
        })
    }


   
}
export default new WebsocketManager();