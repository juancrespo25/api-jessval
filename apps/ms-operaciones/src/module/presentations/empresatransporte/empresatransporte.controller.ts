import type { Request, Response } from 'express';
import { EmpresaTransporteApplication } from '../../applications/empresatransporte';
import { EmpresaTransporteStatusDto } from './dtos';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export class EmpresaTransporteController {
  constructor(private empresaTransporteApplication: EmpresaTransporteApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const tipoEnvioParam = req.query.tipo_envio as string;
    const tipo_envio = tipoEnvioParam ? parseInt(tipoEnvioParam, 10) : undefined;

    const status =
      statusParam === 'true'
        ? true
        : statusParam === 'false'
        ? false
        : undefined;

    const empresaTransporteStatusDto = plainToInstance(EmpresaTransporteStatusDto, {
      status,
      tipo_envio,
    });
    const errors = await validate(empresaTransporteStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }
    const empresasTransporte = await this.empresaTransporteApplication.findAllStatus(
      empresaTransporteStatusDto.status,
      empresaTransporteStatusDto.tipo_envio,
    );
    if (!empresasTransporte || empresasTransporte.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'EmpresaTransporte not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'EmpresaTransporte retrieved successfully',
      data: empresasTransporte,
    });
  }
}