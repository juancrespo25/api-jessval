import type { Request, Response } from 'express';
import { GuiaManifiesto, GuiaManifiestoApplication } from '../../applications/guiamanifiesto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GuiaManifiestoValidateDto } from './dtos';

export class GuiaManifiestoController {
  constructor(private readonly guiaManifiestoApplication: GuiaManifiestoApplication) { }

  async validate(req: Request, res: Response) {
    const guiaManifiestoValidateDto = plainToInstance(GuiaManifiestoValidateDto, req.params);
    const errores = await validate(guiaManifiestoValidateDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errores.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errores,
      });
    }

    try {
      const guiaManifiesto = await this.guiaManifiestoApplication.validateGuia(guiaManifiestoValidateDto.id_guia);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'GuiaManifiesto validated successfully',
        data: guiaManifiesto,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error validating guiaManifiesto',
      });
    }
  }
}