import type { Request, Response } from 'express';
import { GuiaDescarga, GuiaDescargaApplication } from '../../applications/guiadescarga';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GuiaDescargaCreate, GuiaDescargaSearch } from './dtos';
import { GuiaSearchByIdDto } from './dtos/guia-search-by-id.dto';

export class GuiaDescargaController {
  constructor(private readonly guiaDescargaApplication: GuiaDescargaApplication) {}

  async save(req: Request, res: Response) {
    const guiaDescargaCreate = plainToInstance(GuiaDescargaCreate, req.body);
    const errores = await validate(guiaDescargaCreate, {
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
      const guiaDescarga = new GuiaDescarga({
        id_guia: guiaDescargaCreate.id_guia,
        estado: guiaDescargaCreate.estado,
        tipo: guiaDescargaCreate.tipo,
        recibido: guiaDescargaCreate.recibido ?? null,
        parentesco: guiaDescargaCreate.parentesco ?? null,
        documento: guiaDescargaCreate.documento ?? null,
        motivo: guiaDescargaCreate.motivo ?? null,
        puerta: guiaDescargaCreate.puerta ?? null,
        colorpuerta: guiaDescargaCreate.colorpuerta ?? null,
        suministro: guiaDescargaCreate.suministro ?? null,
        fecha_descarga: guiaDescargaCreate.fecha_descarga
          ? guiaDescargaCreate.fecha_descarga.toISOString().split('T')[0]
          : null,
        hora_descarga: guiaDescargaCreate.hora_descarga,
        userCreated: guiaDescargaCreate.userCreated
      });

      const createdGuiaDescarga = await this.guiaDescargaApplication.save(guiaDescarga);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guía de descarga creada exitosamente',
        data: createdGuiaDescarga,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  async update(req: Request, res: Response) {
    const guiaDescargaCreate = plainToInstance(GuiaDescargaCreate, req.body);
    const errores = await validate(guiaDescargaCreate, {
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
      const guiaDescarga = new GuiaDescarga({
        id_guia: guiaDescargaCreate.id_guia,
        estado: guiaDescargaCreate.estado,
        tipo: guiaDescargaCreate.tipo,
        recibido: guiaDescargaCreate.recibido ?? null,
        parentesco: guiaDescargaCreate.parentesco ?? null,
        documento: guiaDescargaCreate.documento ?? null,
        motivo: guiaDescargaCreate.motivo ?? null,
        puerta: guiaDescargaCreate.puerta ?? null,
        colorpuerta: guiaDescargaCreate.colorpuerta ?? null,
        suministro: guiaDescargaCreate.suministro ?? null,
        fecha_descarga: guiaDescargaCreate.fecha_descarga
          ? guiaDescargaCreate.fecha_descarga.toISOString().split('T')[0]
          : null,
        hora_descarga: guiaDescargaCreate.hora_descarga,
        userCreated: guiaDescargaCreate.userCreated
      });

      const updatedGuiaDescarga = await this.guiaDescargaApplication.update(guiaDescarga);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guía de descarga actualizada exitosamente',
        data: updatedGuiaDescarga,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error interno del servidor',
      });
    }
  }

  async getById(req: Request, res: Response) {
    const guiaSearchById = plainToInstance(GuiaSearchByIdDto, req.params);
    const errores = await validate(guiaSearchById);
    if (errores.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Error en los datos proporcionados',
        errores,
      });
    }

    try {
      const guia = await this.guiaDescargaApplication.getById(guiaSearchById.id_guia);
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guía de descarga retrieved successfully',
        data: guia,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error,
      });
    }
  }

  async getAllType(req: Request, res: Response) {
    const guiaDescargaSearch = plainToInstance(GuiaDescargaSearch, req.params);
    const errores = await validate(guiaDescargaSearch);
    if (errores.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Error en los datos proporcionados',
        errores,
      });
    }

    try{

      const guias = await this.guiaDescargaApplication.getAllType(guiaDescargaSearch.tipo);

      return  res.status(200).json({
        status: 200,
        success: true,
        message: 'Manifiestos retrieved successfully',
        data: guias,
      })

    }catch(error){
      return res.status(500).json({
        status: 500,
        success: false,
        message: error
      });
    }
  }

}
