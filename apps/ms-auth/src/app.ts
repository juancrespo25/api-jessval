import express from 'express';
import cors from 'cors';
import { authRoutes } from './module/presentations/auth.routes';

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

        this.app.use('/auth', authRoutes);

        this.app.get("/health", (req, res) => {
            res.status(200).json({ status: "ok" });
        });

        this.app.get("/", (req, res) => {
            res.status(200).json("Welcome to the Auth Service API");
        });
    }
}

export default new App().app;