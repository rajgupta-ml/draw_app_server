import express from "express";
import cors from "cors"
import shareRouter from "./route/v1";
import { config } from "./config/config";
import websocketManger from "./manager/websocketManger";
import {Server} from "http"
const app = express();


const server = new Server(app);
app.use(express.json());
app.use(cors())

app.use("/api/v1", shareRouter)
const port = parseInt(config.PORT)



server.listen(port, () => {
    const {error} = websocketManger.init(server)

    if(error) {
        console.log("websocket could not be initialized");
        process.exit(1);
    }
    websocketManger.startConnection();
    console.log(`The app and websocket is running on port ${port}`)
})