import type { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { DocAdjunto, DocAdjuntoApplication, GuiaNoEncontradaError } from '../../applications/docadjunto';
import { DocAdjuntoCreateDTO } from './dtos';

export class DocAdjuntoController {
  constructor(private readonly docAdjuntoApplication: DocAdjuntoApplication) {}

  async save(req: Request, res: Response) {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ status: 400, success: false, message: 'Validation failed' });
    }

    const dto = plainToInstance(DocAdjuntoCreateDTO, req.body);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      return res.status(400).json({ status: 400, success: false, message: 'Validation failed', errors });
    }

    try {
      const docAdjunto = await this.docAdjuntoApplication.save(new DocAdjunto(dto));
      return res.status(201).json({
        status: 201,
        success: true,
        message: 'Documento adjunto creado',
        data: docAdjunto.properties(),
      });
    } catch (error) {
      if (error instanceof GuiaNoEncontradaError) {
        return res.status(404).json({ status: 404, success: false, message: error.message });
      }
      throw error;
    }
  }
}
