import { Request, Response } from 'express';
import { ProvinceGatewayApplication } from '../../applications/province.application';
import { plainToInstance } from 'class-transformer';
import { ProvinceStatusDto } from './dtos';
import { validate } from 'class-validator';

export class ProvinceGatewayController {
  constructor(private readonly application: ProvinceGatewayApplication) {}

  async findByAll(request: Request, response: Response) {
    const status= request.query.status as string;
    const provinceStatusDto = plainToInstance(ProvinceStatusDto, { status: status });
    const error = await validate(provinceStatusDto);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: 'Validation failed', errors: error });
    } else {
      const provinces = await this.application.findByAll(provinceStatusDto.status);
      if (!provinces) {
        return response.status(404).json({ status: 404, message: 'Provinces not found' });
      } else {
        return response.status(200).json({
          status: 200,
          message: 'Provinces retrieved successfully',
          data: provinces.data,
        });
      }
    }
  }
}
