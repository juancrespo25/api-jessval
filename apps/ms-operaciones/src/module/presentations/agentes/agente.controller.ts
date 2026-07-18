import type { Request, Response } from 'express';
import { AgenteApplication, Agente } from '../../applications/agentes';
import { plainToInstance } from 'class-transformer';
import { AgenteStatusDto } from './dtos';
import { validate } from 'class-validator';

export class AgenteController {
  constructor(private readonly agenteApplication: AgenteApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
          ? false
          : undefined;

    const agenteStatusDto = plainToInstance(AgenteStatusDto, { status });
    const errors = await validate(agenteStatusDto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }
    const agentes = await this.agenteApplication.findAllStatus(agenteStatusDto.status);
    if (!agentes || agentes.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Agentes not found",
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Agentes retrieved successfully",
      data: agentes,
    });
  }
}