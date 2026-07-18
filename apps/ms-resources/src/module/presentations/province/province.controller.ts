import type { Request, Response } from "express";
import { ProvinceApplication } from "../../applications/province";
import { plainToInstance } from "class-transformer";
import { ProvinceStatusDTO } from "./dtos";
import { validate } from "class-validator";

export class ProvinceController {
    constructor(private readonly application: ProvinceApplication){}

    async findByAll(req: Request, res: Response) {
      const status = req.query.status as string;
      const provinceStatusDTO = plainToInstance(ProvinceStatusDTO, { status: status });
      const error = await validate(provinceStatusDTO);

      if (error.length > 0) {
          return res.status(400).json({
              status: 400,
              success: false,
              message: "Validation failed",
              errors: error,
          });
      }else{
          const provinces = await this.application.findByAll(provinceStatusDTO.status);

          if(!provinces || provinces.length === 0) {
              return res.status(404).json({
                  status: 404,
                  success: false,
                  message: "No provinces found",
              });
          }

          return res.status(200).json({
              status: 200,
              success: true,
              message: "Provinces found",
              data: provinces,
          });
      }
    }
    
}