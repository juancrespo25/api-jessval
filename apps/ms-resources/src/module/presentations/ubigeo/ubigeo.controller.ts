import type { Request, Response } from "express";
import { UbigeoApplication } from "../../applications/ubigeo";
import { plainToInstance } from "class-transformer";
import { UbigeoCodeDTO, UbigeoNameDTO } from "./dtos";
import { validate } from "class-validator";

export class UbigeoController {
    constructor(private readonly application: UbigeoApplication){}

    async findByName(req: Request, res: Response) {
        const ubigeoNameDTO = plainToInstance(UbigeoNameDTO, req.params);

        const error = await validate(ubigeoNameDTO);

        if (error.length > 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Validation failed",
                errors: error,
            });
        } else {
            const ubigeos = await this.application.findByName(ubigeoNameDTO.name);

            if(!ubigeos || ubigeos.length === 0) {
                return res.status(404).json({
                    status: 404,
                    success: false,
                    message: "No ubigeos found",
                    data: null,
                });
            }else {
                return res.status(200).json({
                    status: 200,
                    success: true,
                    message: "Ubigeos retrieved successfully",
                    data: ubigeos,
                });
            }
        }
    }

    async findByCode(req: Request, res: Response) {
        const ubigeoCodeDTO = plainToInstance(UbigeoCodeDTO, req.params);

        const error = await validate(ubigeoCodeDTO);

        if (error.length > 0) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Validation failed",
                errors: error,
            });
        }

        const ubigeo = await this.application.findByCode(ubigeoCodeDTO.code);

        if (!ubigeo) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Ubigeo not found",
                errors: null,
            });
        } else {
            return res.status(200).json({
                status: 200,
                success: true,
                message: "Ubigeo retrieved successfully",
                data: ubigeo,
            });
        }
    }
}