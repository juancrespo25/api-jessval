import type { Request, Response } from 'express';
import { DespachoApplication, Despacho } from '../../applications/despacho';
import { plainToInstance } from 'class-transformer';
import {
  DespachoCreateDto,
  DespachoSearchDto,
  DespachoSearchIdDto,
  DespachoUpdateDto,
  DespachoUpdateStatusDto,
} from './dtos';
import { validate } from 'class-validator';

export class DespachoController {
  constructor(private readonly despachoApplication: DespachoApplication) {}

  async findById(req: Request, res: Response) {
    const despachoSearchId = plainToInstance(DespachoSearchIdDto, req.params);
    const errors = await validate(despachoSearchId);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const despacho = await this.despachoApplication.findById(despachoSearchId.id);

    if (!despacho) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Despacho not found',
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho retrieved successfully',
        data: despacho,
      });
    }
  }
  async findAll(req: Request, res: Response) {
    const despachoSearchDto = plainToInstance(DespachoSearchDto, req.query);
    const errors = await validate(despachoSearchDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const despacho = await this.despachoApplication.findAll(
      despachoSearchDto.fecha_inicial,
      despachoSearchDto.fecha_final,
      despachoSearchDto.agente,
      despachoSearchDto.estado,
    );

    if (!despacho || despacho.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Despacho not found',
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho retrieved successfully',
        data: despacho,
      });
    }
  }

  async save(req: Request, res: Response) {
    const despachoCreateDto = plainToInstance(DespachoCreateDto, req.body);
    const errors = await validate(despachoCreateDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const despacho = new Despacho(despachoCreateDto);
    const saved = await this.despachoApplication.save(despacho);

    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating despacho',
      });
    } else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho created successfully',
        data: saved,
      });
    }
  }

  async confirmDespacho(req: Request, res: Response) {
    const despachoUpdateStatusDto = plainToInstance(DespachoUpdateStatusDto, req.body);
    const errors = await validate(despachoUpdateStatusDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    try {
      const updated = await this.despachoApplication.confirmDespacho(
        despachoUpdateStatusDto.id,
        despachoUpdateStatusDto.status,
        despachoUpdateStatusDto.userUpdated,
      );

      if (!updated) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Error confirming despacho',
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho confirmed successfully',
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateDespachoStatus(req: Request, res: Response) {
    const despachoUpdateStatusDto = plainToInstance(DespachoUpdateStatusDto, req.body);
    const errors = await validate(despachoUpdateStatusDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    try {
      const updated = await this.despachoApplication.updateDespachoStatus(
        despachoUpdateStatusDto.id,
        despachoUpdateStatusDto.status,
        despachoUpdateStatusDto.userUpdated,
      );

      if (!updated) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Error updating despacho status',
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho status updated successfully',
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async updateDespacho(req: Request, res: Response) {
    const payload = {
      ...req.body,
      guias: req.body.guias ?? req.body.guia,
    };

    const despachoUpdateDto = plainToInstance(DespachoUpdateDto, payload);
    const errors = await validate(despachoUpdateDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    try {
      const despachoProps = {
        ...despachoUpdateDto,
        guias: despachoUpdateDto.guias.map((guia) => {
          return {
            id_guia: Number(guia.id_guia),
            estado: guia.estado,
            userCreated: guia.userCreated,
          };
        }),
      };

      const despacho = new Despacho(despachoProps);

      const updated = await this.despachoApplication.updateDespacho(despacho);

      if (!updated) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Error updating despacho',
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despacho updated successfully',
        data: updated,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      });
    }
  }

  async generarDespachos(req: Request, res: Response) {
    try {
      const result = await this.despachoApplication.generarDespachos();

      if (!result) {
        return res.status(500).json({
          status: 500,
          success: false,
          message: 'Error generating despachos',
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Despachos generated successfully',
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
