import express from 'express';
import cors from 'cors';
import { userRoutes } from './module/presentations/user.routes';

class App {

    readonly app = express();

    constructor(){
        this.mountMiddlewaresCommon();
        this.mountRoutes();
    }

    private mountMiddlewaresCommon() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private mountRoutes(){

        this.app.get("/health", (req, res) => {
            res.status(200).json({ status: "ok" });
        });

        this.app.get("/", (req, res) => {
            res.status(200).json("Welcome to the User Service API");
        });

        this.app.use('/user', userRoutes);
    }
}

export default new App().app;