import type { Request, Response } from "express";
import { CentroCosto, CentroCostoApplication } from "../applications";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CentroCostoService } from "./centrocosto.service";
import {
  CentroCostoCreateDTO,
  CentroCostoStatusDTO,
  CentroCostoCodeDTO,
  CentroCostoUpdateBodyDTO,
  CentroCostoUpdateDTO,
  CentroCostoNameDTO,
} from "./dto";

export class CentroCostoController {
  constructor(private readonly application: CentroCostoApplication) {}

  async create(req: Request, res: Response) {
    const centroCostoDTO = plainToInstance(CentroCostoCreateDTO, req.body);
    const error = await validate(centroCostoDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const centroCosto = new CentroCosto({
        ...centroCostoDTO,
        codigo: CentroCostoService.generateCode(),
      });

      const centroCostoCreated = await this.application.create(centroCosto);
      return res.status(201).json({
        status: 201,
        success: true,
        message: "CentroCosto created successfully",
        data: centroCostoCreated,
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const customer = req.query.customer as string;
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
          ? false
          : undefined;

    const centroCostoStatus = plainToInstance(CentroCostoStatusDTO, { customer, status });

    const error = await validate(centroCostoStatus);

    if (error.length > 0 || status === undefined) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors:
          "Invalid status query parameter. It should be 'true' or 'false'.",
      });
    } else {
      const centroCostos = await this.application.findAll(customer, status);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "CentroCostos retrieved successfully",
        data: centroCostos,
      });
    }
  }

  async findById(req: Request, res: Response) {
    const centroCostoCodeDTO = plainToInstance(CentroCostoCodeDTO, req.params);
    const error = await validate(centroCostoCodeDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const centroCosto = await this.application.findById(
        centroCostoCodeDTO.code,
      );
      if (!centroCosto) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "CentroCosto not found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "CentroCosto retrieved successfully",
          data: centroCosto,
        });
      }
    }
  }

  async findByName(req: Request, res: Response) {
    const centroCostoNameDTO = plainToInstance(CentroCostoNameDTO, req.body);
    const error = await validate(centroCostoNameDTO);
    console.log(centroCostoNameDTO);
    if (error.length > 1) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const centroCostos = await this.application.findByName(
        centroCostoNameDTO.name,
        centroCostoNameDTO.customer,
      );

      if (!centroCostos) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "CentroCostos not found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "CentroCostos retrieved successfully",
          data: centroCostos,
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    const centroCostoDTO = plainToInstance(CentroCostoUpdateDTO, req.body);
    const error = await validate(centroCostoDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const deleted = await this.application.delete(
        centroCostoDTO.code,
        centroCostoDTO.userDelete,
      );
      if (!deleted) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "CentroCosto not found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "CentroCosto deleted successfully",
        });
      }
    }
  }

  async update(req: Request, res: Response) {
    const centroCostoUpdateBodyDTO = plainToInstance(
      CentroCostoUpdateBodyDTO,
      req.body,
    );

    const error = await validate(centroCostoUpdateBodyDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const centocosto = await this.application.update(
        new CentroCosto(centroCostoUpdateBodyDTO),
      );

      if (!centocosto) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "CentroCosto not found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "CentroCosto updated successfully",
          data: centocosto,
        });
      }
    }
  }
}
