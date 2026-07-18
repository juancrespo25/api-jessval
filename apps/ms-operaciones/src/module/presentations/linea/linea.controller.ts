import type { Request, Response } from 'express';
import { LineaApplication, Linea } from '../../applications/linea';
import { plainToInstance } from 'class-transformer';
import { LineaStatusDto, LineaCreateDto } from './dtos';
import { validate } from 'class-validator';

export class LineaController {
  constructor(private readonly lineaApplication: LineaApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

    const lineaStatusDto = plainToInstance(LineaStatusDto, { status });
    const errors = await validate(lineaStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const lineas = await this.lineaApplication.findAll(lineaStatusDto.status);
    if (!lineas || lineas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Linea not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Linea retrieved successfully',
      data: lineas,
    });
  }

  async save(req: Request, res: Response) {
    const lineaCreateDto = plainToInstance(LineaCreateDto, req.body);
    const errors = await validate(lineaCreateDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const linea = new Linea(lineaCreateDto);
    const saved = await this.lineaApplication.save(linea);
    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating linea',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Linea created successfully',
      data: saved,
    });
  }
}
