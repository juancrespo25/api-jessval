import type { Request, Response } from 'express';
import { ParentescoApplication, Parentesco } from '../../applications/parentesco';
import { plainToInstance } from 'class-transformer';
import { ParentescoCreateDto, ParentescoStatusDto } from './dtos';
import { validate } from 'class-validator';

export class ParentescoController {

  constructor(private readonly parentescoApplication: ParentescoApplication) {}

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const status = statusParam === 'true' ? true : statusParam === 'false' ? false : undefined;

    const parentescoStatusDto = plainToInstance(ParentescoStatusDto, { status });
    const errors = await validate(parentescoStatusDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const parentesco = await this.parentescoApplication.findAll(parentescoStatusDto.status);

    if (!parentesco || parentesco.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Parentesco not found',
      });
    }else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Parentesco retrieved successfully',
        data: parentesco,
      });
    }
  }

  async save(req: Request, res: Response) {
    const parentescoCreateDto = plainToInstance(ParentescoCreateDto, req.body);
    const errors = await validate(parentescoCreateDto);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const parentesco = new Parentesco(parentescoCreateDto);
    const saved = await this.parentescoApplication.save(parentesco);
    if (!saved) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating parentesco',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Parentesco created successfully',
      data: saved,
    });
  }
}
