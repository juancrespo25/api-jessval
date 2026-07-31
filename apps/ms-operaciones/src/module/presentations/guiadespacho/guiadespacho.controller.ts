import type { Request, Response } from 'express';
import { GuiaDespacho, GuiaDespachoApplication } from '../../applications/guiadespacho';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GuiaDespachoCreateDto } from './dtos';

export class GuiaDespachoController {
  constructor(private readonly guiaDespachoApplication: GuiaDespachoApplication) {}

  async addGuia(req: Request, res: Response) {
    const despachoCreateDto = plainToInstance(GuiaDespachoCreateDto, req.body);
    const errores = await validate(despachoCreateDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errores.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Error en los datos proporcionados',
        errores,
      });
    }

    //validar si

    try {
      const guiaDespacho = new GuiaDespacho({
        despacho: despachoCreateDto.despacho_id,
        id_guia: despachoCreateDto.id_guia,
        estado: despachoCreateDto.estado,
        userCreated: despachoCreateDto.userCreated,
      });

      const createdGuiaDespacho = await this.guiaDespachoApplication.addGuia(guiaDespacho);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guía de despacho creada exitosamente',
        data: createdGuiaDespacho,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error al crear la guía de despacho',
      });
    }
  }

}
