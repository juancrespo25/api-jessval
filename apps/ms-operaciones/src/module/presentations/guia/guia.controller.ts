import type { Request, Response } from 'express';
import { Guia, GuiaApplication } from '../../applications/guia';
import { plainToInstance } from 'class-transformer';
import { GuiaCreateDTO } from './dtos';
import { validate } from 'class-validator';
import { GuiaValidate } from './dtos/guia-validate';

export class GuiaController {
  constructor(private readonly guiaApplication: GuiaApplication) {}

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
}
