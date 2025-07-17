import express from "express";
import cors from "cors"
import { config } from "../config/config";
const app = express();
app.use(cors())

const port = parseInt(config.PORT)
app.listen(port, () => {
    console.log(`The app is running o port ${port}`)
})