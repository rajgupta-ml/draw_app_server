import WebSocket from "ws";
import type { safeResultType } from "../utils/safeFnCall";


export type RoomMemberTypes = {
    ws : WebSocket,
    name : string
}
class RoomManger {
    private rooms : Map<string, RoomMemberTypes[]>;

    constructor() {
        this.rooms = new Map();
    }

    addRoomMember =  (roomId : string,  newRoomMember? : RoomMemberTypes) : safeResultType<string, string> => {
        if(!newRoomMember && !this.rooms.has(roomId)){
            this.rooms.set(roomId, [])
            return{
                result : "Room has beeen created with no user in the room",
                error : null
            }
        }

        if(!this.rooms.has(roomId)){
            return {
                error : `There are no room with id ${roomId}`,
                result : null,
            }
        }

        const existingRoomMember = this.rooms.get(roomId)!;
        const doesThisMemberAlreadyExist = existingRoomMember.find(roomMember => JSON.stringify(roomMember) === JSON.stringify(newRoomMember))
        if(doesThisMemberAlreadyExist){
            return {
                error : "Member Already Exist",
                result : null
            }
        }
        existingRoomMember.push(newRoomMember!)
        this.rooms.set(roomId, existingRoomMember);


        return {
            error : null,
            result : `${newRoomMember?.name} has been added to the ${roomId}`
        }

    }

    removeRoomMemeber = (roomId : string, roomMemeberToBeRemoved : WebSocket) => {
        if(!this.rooms.has(roomId)){
            console.log(`No room found with this ${roomId}`)
        }
        const existingRoomMember = this.rooms.get(roomId);
        const newRoomMembers = existingRoomMember!.filter(ws => ws.ws !== roomMemeberToBeRemoved)
        this.rooms.set(roomId, newRoomMembers);
    }

    deleteTheRoom = (roomId : string) => {
        if(!this.rooms.has(roomId)){
            console.log(`No room found with this ${roomId}`)
        }
        this.rooms.delete(roomId);
        console.log("Room has been deleted")
    }

    getRoomMembers = (roomId : string) => {
        return this.rooms.get(roomId)
    }
}

export default new RoomManger();