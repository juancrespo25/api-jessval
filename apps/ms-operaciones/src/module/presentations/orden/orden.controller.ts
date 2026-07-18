import type { Request, Response } from 'express';
import { Orden, OrdenApplication } from '../../applications/orden';
import { plainToInstance } from 'class-transformer';
import { OrdenNumberDTO } from './dtos/orden-number.dto';
import { OrdenCreateDTO } from './dtos/orden-create.dto';
import { validate } from 'class-validator';

export class OrdenController {
  constructor(private readonly application: OrdenApplication) {}

  async findById(req: Request, res: Response) {
    const ordenNumberDto = plainToInstance(OrdenNumberDTO, req.params);
    const error = await validate(ordenNumberDto);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: error,
      });
    }

    const orden = await this.application.findById(ordenNumberDto.numero);
    if (!orden) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Orden not found',
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Orden retrieved successfully',
      data: orden,
    });
  }

  async create(req: Request, res: Response) {
    const ordenCreateDto = plainToInstance(OrdenCreateDTO, req.body);
    const errors = await validate(ordenCreateDto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const ordenProps = {
      ...ordenCreateDto,
      guias: ordenCreateDto.guias.map((guia) => {
        const { imagen, imagen2, imagen3, ecuenta, dcliente, ...guiaProps } = guia as any;
        return {
          ...guiaProps,
          orden: String(ordenCreateDto.numero),
        };
      }),
    };

    const orden = new Orden(ordenProps);

    const savedOrden = await this.application.save(orden);

    if (!savedOrden) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating orden',
      });
    }else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Orden created successfully',
        data: savedOrden,
      });
    }
  }

  async getToday(req: Request, res: Response) {
    const ordenes = await this.application.getOrdenToday();
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Ordenes retrieved successfully',
      data: ordenes,
    });
  }
}
