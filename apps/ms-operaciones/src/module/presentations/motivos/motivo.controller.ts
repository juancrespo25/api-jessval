import type { Request, Response } from 'express';
import { MotivoApplication, Motivo } from '../../applications/motivos';
import { plainToInstance } from 'class-transformer';
import { MotivoStatusDto, MotivoCreateDto } from './dtos';
import { validate } from 'class-validator';

export class MotivoController {
  constructor(private readonly motivoApplication: MotivoApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const tipo = req.query.tipo ? parseInt(req.query.tipo as string, 10) : undefined;
    const status =
      statusParam === 'true'
        ? true
        : statusParam === 'false'
          ? false
          : undefined;

    const motivoStatusDto = plainToInstance(MotivoStatusDto, { status, tipo });
    const errors = await validate(motivoStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

      const motivos = await this.motivoApplication.findAll(motivoStatusDto.status, motivoStatusDto.tipo);

      if (motivos.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Motivos not found',
        });
      }else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: 'Motivos retrieved successfully',
          data: motivos,
        });
      }
  }

  async save(req: Request, res: Response) {
    const motivoCreateDto = plainToInstance(MotivoCreateDto, req.body);
    const errors = await validate(motivoCreateDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const motivo = new Motivo(motivoCreateDto);

    const saved = await this.motivoApplication.save(motivo);

    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating motivo',
      });
    }else{
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Motivo created successfully',
        data: saved,
      });
    }
  }

}