import type { Request, Response } from 'express';
import { Manifiesto, ManifiestoApplication } from '../../applications/manifiesto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  ManifiestoSearchDto,
  ManifiestoByCodeDto,
  ManifiestoCreateDto,
  ManifiestoUpdateDto,
} from './dtos';

export class ManifiestoController {
  constructor(private manifiestoApplication: ManifiestoApplication) {}

  async create(req: Request, res: Response) {
    const manifiestoCreateDto = plainToInstance(ManifiestoCreateDto, req.body);
    const errores = await validate(manifiestoCreateDto, {
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
      const manifiestoProps = {
        ...manifiestoCreateDto,
        guias: manifiestoCreateDto.guias.map((guia) => {
          return {
            id_guia: Number(guia.id_guia),
            ordenamiento: guia.ordenamiento,
            estado: guia.estado,
          };
        }),
      };

      const manifiesto = new Manifiesto(manifiestoProps);

      const manifiestoCreado = await this.manifiestoApplication.save(manifiesto);

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Manifiesto created successfully',
        data: manifiestoCreado,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async update(req: Request, res: Response) {
    const manifiestoUpdateDto = plainToInstance(ManifiestoUpdateDto, req.body);
    const errores = await validate(manifiestoUpdateDto, {
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
      const manifiestoProps = {
        ...manifiestoUpdateDto,
        userUpdated:
          typeof manifiestoUpdateDto.userUpdated === 'string'
            ? manifiestoUpdateDto.userUpdated
            : (manifiestoUpdateDto.userUpdated as any)?.toString(),
        guias: manifiestoUpdateDto.guias.map((guia) => {
          return {
            id_guia: Number(guia.id_guia),
            estado: guia.estado,
            recibido: guia.recibido,
            parentesco: guia.parentesco,
            documento: guia.documento,
            motivo: guia.motivo,
            colorpuerta: guia.colorpuerta,
            suministro: guia.suministro,
            fecha_descarga: guia.fecha_descarga,
            hora_descarga: guia.hora_descarga ? guia.hora_descarga : undefined,
          };
        }),
      };

      const manifiesto = new Manifiesto(manifiestoProps);
      const manifiestoUpdate = await this.manifiestoApplication.update(manifiesto);

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Manifiesto updated successfully',
        data: manifiestoUpdate,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const manifiestoSearchDto = plainToInstance(ManifiestoSearchDto, req.query);
    const errores = await validate(manifiestoSearchDto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    console.log(errores);

    if (errores.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errores,
      });
    }

    try {
      const manifiestos = await this.manifiestoApplication.findAll(
        manifiestoSearchDto.fecha_inicial,
        manifiestoSearchDto.fecha_final,
        manifiestoSearchDto.codigo,
        manifiestoSearchDto.estado,
        manifiestoSearchDto.courier,
        manifiestoSearchDto.zona,
      );
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Manifiestos retrieved successfully',
        data: manifiestos,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error,
      });
    }
  }

  async findByCodigo(req: Request, res: Response) {
    const manifiestoByCodeDto = plainToInstance(ManifiestoByCodeDto, req.params);
    const errores = await validate(manifiestoByCodeDto, {
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
      const { codigo } = manifiestoByCodeDto;
      const manifiesto = await this.manifiestoApplication.findByCodigo(codigo);

      if (!manifiesto) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Manifiesto not found',
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Manifiesto retrieved successfully',
        data: manifiesto,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }
}
