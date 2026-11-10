import type { Request, Response } from 'express';
import { GuiaDespacho, GuiaDespachoApplication } from '../../applications/guiadespacho';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GuiaDespachoCreateDto, GuiaDespachoValidate } from './dtos';

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

  async validateGuia(req: Request, res: Response) {
    const { guia } = req.params;
    const guiaParam = Array.isArray(guia) ? guia[0] : guia;
    const guiaDespacho = plainToInstance(GuiaDespachoValidate, {
      id_guia: parseInt(guiaParam ?? '', 10),
    });

    const errores = await validate(guiaDespacho, {
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

    try {
      const validatedGuiaDespacho = await this.guiaDespachoApplication.validate(guiaDespacho.id_guia);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guía de despacho validada exitosamente',
        data: validatedGuiaDespacho,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error al validar la guía de despacho',
      });
    }
  }

}
