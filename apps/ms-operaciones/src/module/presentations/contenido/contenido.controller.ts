import type { Request, Response } from 'express';
import { ContenidoApplication, Contenido } from '../../applications/contenido';
import { plainToInstance } from 'class-transformer';
import { ContenidoStatusDto, ContenidoCreateDto, ContenidoUpdateDto } from './dtos';
import { validate } from 'class-validator';

export class ContenidoController {
  constructor(private readonly contenidoApplication: ContenidoApplication) {}
  async findAll(req: Request, res: Response) {

    const statusParam = req.query.status as string;
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
          ? false
          : undefined;

    const contenidoStatusDto = plainToInstance(ContenidoStatusDto, { status});
    const errors = await validate(contenidoStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    } else {
      const contenido = await this.contenidoApplication.findAll(contenidoStatusDto.status);
      if (!contenido || contenido.length === 0) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Contenido not found',
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Contenido retrieved successfully',
        data: contenido,
      });
    }
  }

  async save(req: Request, res: Response) {
    const contenidoCreateDto = plainToInstance(ContenidoCreateDto, req.body);
    const errors = await validate(contenidoCreateDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const contenido = new Contenido(contenidoCreateDto);
    const saved = await this.contenidoApplication.save(contenido);
    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating contenido',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Contenido created successfully',
      data: saved,
    });
  }

  async update(req: Request, res: Response) {
    const contenidoUpdateDto = plainToInstance(ContenidoUpdateDto, req.body);
    const errors = await validate(contenidoUpdateDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const contenido = new Contenido(contenidoUpdateDto);
    const updated = await this.contenidoApplication.update(contenido);
    if (!updated) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Contenido not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Contenido updated successfully',
      data: updated,
    });
  }
}
