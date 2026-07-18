import type { Request, Response } from 'express';
import { Destinatario, DestinatarioApplication } from '../../applications/destinatario';
import { plainToInstance } from 'class-transformer';
import { DestinatarioSearchDto } from './dtos';
import { validate } from 'class-validator';

export class DestinatarioController {
  constructor(private readonly destinatarioApplication: DestinatarioApplication) {}

  async findByName(req: Request, res: Response) {
    const destinatarioSearchDto = plainToInstance(DestinatarioSearchDto, req.body);
    const errors = await validate(destinatarioSearchDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }else {
      const destinatario = await this.destinatarioApplication.findByName(destinatarioSearchDto.nombre, destinatarioSearchDto.customer, destinatarioSearchDto.ccosto);
      if (!destinatario) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Destinatario not found",
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Destinatario retrieved successfully",
        data: destinatario,
      });
    }
  }
}