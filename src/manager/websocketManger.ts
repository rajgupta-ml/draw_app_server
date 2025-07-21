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
                const raw = bufferMessage.toString()
                if(!raw){
                    return
                }
                const parsedData = JSON.parse(raw);
                const args = {...parsedData, ws} as MessageDispactarType
                // console.log("parsedData:", parsedData)
                // const {data, error} = messageSchema.safeParse(parsedData);
                
                        
               
                        // const args : MessageDispactarType = {
                        //     message,
                        //     name,
                        //     roomId,
                        //     type,
                        //     ws
                        // }
                        await MessageHandler.dispatchMessage(args);                      
            })      
        })
    }


   
}
export default new WebsocketManager();