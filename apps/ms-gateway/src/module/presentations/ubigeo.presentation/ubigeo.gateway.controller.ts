import { Request, Response } from 'express';
import { UbigeoGatewayApplication } from '../../applications/ubigeo.application';
import { plainToInstance } from 'class-transformer';
import { UbigeoCodeDTO, UbigeoNameDto } from './dtos';
import { validate } from 'class-validator';

export class UbigeoGatewayController {
  constructor(private readonly application: UbigeoGatewayApplication) {}

  async findByName(request: Request, response: Response) {
    const ubigeoNameDto = plainToInstance(UbigeoNameDto, request.params);
    const error = await validate(ubigeoNameDto);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: 'Validation failed', errors: error });
    } else {
      const ubigeos = await this.application.findByName(ubigeoNameDto.name);

      if (!ubigeos) {
        return response.status(404).json({ status: 404, message: 'Ubigeo not found' });
      } else {
        return response.status(200).json({
          status: 200,
          message: 'Ubigeos retrieved successfully',
          data: ubigeos.data,
        });
      }
    }
  }

  async findByCode(request: Request, response: Response) {
    const ubigeoCodeDto = plainToInstance(UbigeoCodeDTO, request.params);
    const error = await validate(ubigeoCodeDto);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: 'Validation failed', errors: error });
    } else {
      const ubigeo = await this.application.findByCode(ubigeoCodeDto.code);

      if (!ubigeo) {
        return response.status(404).json({ status: 404, message: 'Ubigeo not found' });
      } else {
        return response.status(200).json({
          status: 200,
          message: 'Ubigeo retrieved successfully',
          data: ubigeo.data,
        });
      }
    }
  }
}
