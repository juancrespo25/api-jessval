import type { Request, Response } from 'express';
import { ZonasApplication, Zonas } from '../../applications/zonas';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ZonasCreateDto, ZonasStatusDto } from './dtos';
import { ZonasService } from './zonas.service';

export class ZonasController {
  constructor(private readonly zonasApplication: ZonasApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

    const zonasStatusDto = plainToInstance(ZonasStatusDto, { status });
    const errors = await validate(zonasStatusDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const zonas = await this.zonasApplication.findAll(zonasStatusDto.status);
    if (!zonas || zonas.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Zonas not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Zonas retrieved successfully',
      data: zonas,
    });
  }

  async save(req: Request, res: Response) {
    const zonasCreateDto = plainToInstance(ZonasCreateDto, req.body);
    const errors = await validate(zonasCreateDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const zonas = new Zonas({
      codigo: ZonasService.generateCode(),
      descripcion: zonasCreateDto.descripcion,
      estado: true
    })
    const saved = await this.zonasApplication.save(zonas);
    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating zonas',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Zonas created successfully',
      data: saved,
    });
  }
}
