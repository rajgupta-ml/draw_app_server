import express from "express";
import cors from "cors"
import shareRouter from "./route/v1";
import { config } from "./config/config";
const app = express();
app.use(express.json());
app.use(cors())

app.use("/api/v1", shareRouter)
const port = parseInt(config.PORT)
app.listen(port, () => {
    console.log(`The app is running o port ${port}`)
})