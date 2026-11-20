import type { Request, Response } from 'express';
import { Orden, OrdenApplication } from '../../applications/orden';
import { plainToInstance } from 'class-transformer';
import { OrdenNumberDTO } from './dtos/orden-number.dto';
import { OrdenCodeDTO } from './dtos/orden-code.dto';
import { OrdenQueryDTO } from './dtos/orden-query.dto';
import { OrdenCreateDTO } from './dtos/orden-create.dto';
import { OrdenGuiasImpresionDTO } from './dtos/orden-guias-impresion.dto';
import { generarGuiasPdf } from './orden-impresion.pdf';
import { generarEtiquetasBarraPdf } from './orden-etiquetas-barra.pdf';
import { GuiaImpresion } from '../../ports/orden';
import { validate } from 'class-validator';

export class OrdenController {
  constructor(private readonly application: OrdenApplication) {}

  async findById(req: Request, res: Response) {
    const ordenNumberDto = plainToInstance(OrdenNumberDTO, req.params);
    const error = await validate(ordenNumberDto);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors: error,
      });
    }

    const orden = await this.application.findById(ordenNumberDto.numero);
    if (!orden) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Orden not found',
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Orden retrieved successfully',
      data: orden,
    });
  }

  async getOrdenByCode(req: Request, res: Response) {
    const dto = plainToInstance(OrdenCodeDTO, { numero: req.params.numero });
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const orden = await this.application.getOrdenByCode(dto.numero);
    if (!orden) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Orden not found',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Orden retrieved successfully',
      data: orden,
    });
  }

  async queryOrden(req: Request, res: Response) {
    const dto = plainToInstance(OrdenQueryDTO, req.query);
    const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    if (dto.fecha_inicial > dto.fecha_final) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'fecha_inicial must be less than or equal to fecha_final',
      });
    }
    let resultados;
    try {
      resultados = await this.application.queryOrden(dto);
    } catch (error) {
      console.error('Error querying ordenes:', error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error querying ordenes',
      });
    }
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Ordenes retrieved successfully',
      data: resultados,
    });
  }

  async create(req: Request, res: Response) {
    const ordenCreateDto = plainToInstance(OrdenCreateDTO, req.body);
    const errors = await validate(ordenCreateDto, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    const ordenProps = {
      ...ordenCreateDto,
      guias: ordenCreateDto.guias.map((guia) => {
        const { imagen, imagen2, imagen3, ecuenta, dcliente, ...guiaProps } = guia as any;
        return {
          ...guiaProps,
          orden: String(ordenCreateDto.numero),
        };
      }),
    };

    const orden = new Orden(ordenProps);

    const savedOrden = await this.application.save(orden);

    if (!savedOrden) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: 'Error creating orden',
      });
    }else {
      return res.status(200).json({
        status: 200,
        success: true,
        message: 'Orden created successfully',
        data: savedOrden,
      });
    }
  }

  async getToday(req: Request, res: Response) {
    const ordenes = await this.application.getOrdenToday();
    return res.status(200).json({
      status: 200,
      success: true,
      message: 'Ordenes retrieved successfully',
      data: ordenes,
    });
  }

  async getGuiasImpresion(req: Request, res: Response) {
    return this.imprimir(req, res, generarGuiasPdf, 'guias');
  }

  async getEtiquetasBarraImpresion(req: Request, res: Response) {
    return this.imprimir(req, res, generarEtiquetasBarraPdf, 'etiquetas');
  }

  private async imprimir(
    req: Request,
    res: Response,
    generarPdf: (guias: GuiaImpresion[]) => Promise<Buffer>,
    nombre: string,
  ) {
    const dto = plainToInstance(OrdenGuiasImpresionDTO, {
      numero: req.params.numero,
      itemDesde: req.query.itemDesde,
      itemHasta: req.query.itemHasta,
    });
    const errors = await validate(dto);
    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'numero and provided item limits must be non-negative integers',
        errors,
      });
    }

    if ((dto.itemDesde === undefined) !== (dto.itemHasta === undefined)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'itemDesde and itemHasta must be provided together',
      });
    }

    if (dto.itemDesde !== undefined && dto.itemHasta !== undefined && dto.itemDesde > dto.itemHasta) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'itemDesde must be less than or equal to itemHasta',
      });
    }

    const guias = await this.application.getGuiasImpresion(dto.numero, dto.itemDesde, dto.itemHasta);
    if (guias.length === 0) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'No guides found for the requested order and range',
      });
    }

    const pdf = await generarPdf(guias);
    return res.status(200)
      .type('application/pdf')
      .set('Content-Disposition', `inline; filename="${nombre}-orden-${dto.numero}.pdf"`)
      .send(pdf);
  }
}
