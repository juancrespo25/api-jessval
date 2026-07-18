import express from 'express';
import cors from 'cors';
import { gatewayRoutes } from './module/presentations/auth.presentation';
import { userGatewayRoutes} from './module/presentations/user.presentation';
import { customerGatewayRoutes } from './module/presentations/customer.presentation';
import { centerCostGatewayRoutes } from './module/presentations/centercost.presentation';
import { ubigeoGatewayRoutes } from './module/presentations/ubigeo.presentation';
import { provinceGatewayRoutes } from './module/presentations/province.presentation';

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
            res.status(200).json("Welcome to the Gateway Service API");
        });

        this.app.use('/api', gatewayRoutes);
        this.app.use('/api', userGatewayRoutes);
        this.app.use('/api', customerGatewayRoutes);
        this.app.use('/api', centerCostGatewayRoutes);
        this.app.use('/api', ubigeoGatewayRoutes);
        this.app.use('/api', provinceGatewayRoutes);
    }
}

export default new App().app;