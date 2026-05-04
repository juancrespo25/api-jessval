import { Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { CenterCostGatewayApplication } from "../../applications/centercost.application";
import {
  CentroCostoCreateDTO,
  CentroCostoStatusDTO,
  CentroCostoCodeDTO,
  CentroCostoUpdateBodyDTO,
  CentroCostoUpdateDTO,
} from "./dtos";
import { validate } from "class-validator";

export class CentroCostoGatewayController {
  constructor(private readonly application: CenterCostGatewayApplication) {}

  async create(request: Request, response: Response) {
    const centroCostoCreateDTO = plainToInstance(
      CentroCostoCreateDTO,
      request.body,
    );
    const error = await validate(centroCostoCreateDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const centroCostoCreated = await this.application.create(
        centroCostoCreateDTO.descripcion,
        centroCostoCreateDTO.cliente,
        centroCostoCreateDTO.status,
        centroCostoCreateDTO.contacto,
        centroCostoCreateDTO.email,
        centroCostoCreateDTO.telefono,
        centroCostoCreateDTO.userCreated,
      );
      if (centroCostoCreated.status === 201) {
        return response.status(200).json({
          status: 201,
          message: "CenterCosto created successfully",
          data: centroCostoCreated.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async findAll(request: Request, response: Response) {
    const statusParam = request.query.status as string;
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
          ? false
          : undefined;

    const centroCostoStatus = plainToInstance(CentroCostoStatusDTO, { status });
    const error = await validate(centroCostoStatus);

    if (error.length > 0 || status === undefined) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const centroCostos = await this.application.findAll(status);
      if (centroCostos.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "CentroCostos retrieved successfully",
          data: centroCostos.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async findById(request: Request, response: Response) {
    const centroCostoCodeDTO = plainToInstance(
      CentroCostoCodeDTO,
      request.params,
    );
    const error = await validate(centroCostoCodeDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const centroCosto = await this.application.findById(
        centroCostoCodeDTO.code,
      );
      if (centroCosto.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "CentroCosto retrieved successfully",
          data: centroCosto.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async delete(request: Request, response: Response) {
    const centroCostoUpdateDTO = plainToInstance(
      CentroCostoUpdateDTO,
      request.body,
    );

    const error = await validate(centroCostoUpdateDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const centroCostoDeleted = await this.application.delete(
        centroCostoUpdateDTO.code,
        centroCostoUpdateDTO.userUpdated,
      );
      if (centroCostoDeleted.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "CentroCosto deleted successfully",
          data: centroCostoDeleted.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async update(request: Request, response: Response) {
    const centroCostoUpdateBodyDTO = plainToInstance(
      CentroCostoUpdateBodyDTO,
      request.body,
    );
    const error = await validate(centroCostoUpdateBodyDTO);

    if(error.length> 0){
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    }else{
      const centroCostoUpdated = await this.application.update(
        centroCostoUpdateBodyDTO.descripcion,
        centroCostoUpdateBodyDTO.code,
        centroCostoUpdateBodyDTO.cliente,
        centroCostoUpdateBodyDTO.status,
        centroCostoUpdateBodyDTO.contacto,
        centroCostoUpdateBodyDTO.email,
        centroCostoUpdateBodyDTO.telefono,
        centroCostoUpdateBodyDTO.userUpdated
      );
      if (centroCostoUpdated.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "CentroCosto updated successfully",
          data: centroCostoUpdated.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }
}
