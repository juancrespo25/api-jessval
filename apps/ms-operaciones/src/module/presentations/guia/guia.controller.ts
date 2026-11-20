import type { Request, Response } from 'express';
import { Guia, GuiaApplication } from '../../applications/guia';
import { plainToInstance } from 'class-transformer';
import { GuiaCreateDTO } from './dtos';
import { validate } from 'class-validator';
import { GuiaValidate } from './dtos/guia-validate';
import { GuiaDetalleDTO } from './dtos/guia-detalle.dto';

export class GuiaController {
  constructor(private readonly guiaApplication: GuiaApplication) {}

  async verGuia(req: Request, res: Response) {
    const dto = plainToInstance(GuiaDetalleDTO, { id_guia: req.params.id_guia });
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    try {
      const guia = await this.guiaApplication.verGuia(dto.id_guia);
      if (!guia) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: 'Guia not found',
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Guia retrieved successfully',
        data: guia,
      });
    } catch (error) {
      console.error('Error retrieving guia:', error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error retrieving guia',
      });
    }
  }

  async create(req: Request, res: Response) {
    const guiaCreateDTO = plainToInstance(GuiaCreateDTO, req.body);
    const error = await validate(guiaCreateDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }else{
      const guia = new Guia(guiaCreateDTO);
      const guiaCreated = await this.guiaApplication.save(guia);
      if(guiaCreated){
        return res.status(200).json({
          status: 201,
          success: true,
          message: "Guia created",
          data: guiaCreated,
        });
      }else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Guia not created",
        });
      }

    }

  }

  async validateGuia(req: Request, res: Response) {

    const guia = plainToInstance(GuiaValidate, { id_guia: Number(req.params.id_guia) });
    const error = await validate(guia);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }else{
      const guiaValidated = await this.guiaApplication.validateGuia(guia.id_guia);
      if(guiaValidated){
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Guia validated",
          data: guiaValidated,
        });
      }else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Guia not validated",
        });
      }
    }
  }

    async validateGuiaProvincia(req: Request, res: Response) {

    const guia = plainToInstance(GuiaValidate, { id_guia: Number(req.params.id_guia) });
    const error = await validate(guia);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    }else{
      const guiaValidated = await this.guiaApplication.validateGuiaProvincia(guia.id_guia);
      if(guiaValidated){
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Guia validated",
          data: guiaValidated,
        });
      }else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Guia not validated",
        });
      }
    }
  }

}
