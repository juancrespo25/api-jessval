import type { Request, Response } from 'express';
import { TipoEnvioApplication, TipoEnvio } from '../../applications/tipoenvio';
import { plainToInstance } from 'class-transformer';
import { TipoEnvioStatusDto, TipoEnvioCreateDto } from './dtos';
import { validate } from 'class-validator';

export class TipoEnvioController {
  constructor(private readonly tipoEnvioApplication: TipoEnvioApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const lineaParam = req.query.linea as string  ;
    const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;
    const linea = lineaParam ? parseInt(lineaParam, 10) : undefined;

    const tipoEnvioStatusDto = plainToInstance(TipoEnvioStatusDto, { status, linea });
    const errors = await validate(tipoEnvioStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const tiposEnvio = await this.tipoEnvioApplication.findAll(tipoEnvioStatusDto.status, tipoEnvioStatusDto.linea);
    if (!tiposEnvio || tiposEnvio.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'TipoEnvio not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'TipoEnvio retrieved successfully',
      data: tiposEnvio,
    });
  }

  async save(req: Request, res: Response) {
    const tipoEnvioCreateDto = plainToInstance(TipoEnvioCreateDto, req.body);
    const errors = await validate(tipoEnvioCreateDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const tipoEnvio = new TipoEnvio(tipoEnvioCreateDto);
    const saved = await this.tipoEnvioApplication.save(tipoEnvio);
    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating tipoEnvio',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'TipoEnvio created successfully',
      data: saved,
    });
  }
}
