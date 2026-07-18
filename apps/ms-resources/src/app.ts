import express from 'express';
import cors from 'cors';
import { ubigeoRoutes } from './module/presentations/ubigeo';
import { provinceRoutes } from './module/presentations/province';

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
            res.status(200).json("Welcome to the Area Service API");
        });

        this.app.use("/recursos/ubigeo", ubigeoRoutes);
        this.app.use("/recursos/provincia", provinceRoutes);
    }
}

export default new App().app;