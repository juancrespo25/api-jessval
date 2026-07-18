import { Request, Response } from "express";
import { CustomerGatewayApplication } from "../../applications/customer.application";
import { plainToInstance } from "class-transformer";
import {
  CustomerCodeDTO,
  CustomerCreateDTO,
  CustomerRucDto,
  CustomerStatusDTO,
  CustomerUpdateBodyDTO,
  CustomerUpdateDTO,
} from "./dtos";
import { validate } from "class-validator";
import { CustomerNameDto } from "./dtos/customer-name.dto";

export class CustomerGatewayController {
  constructor(private readonly application: CustomerGatewayApplication) {}

  async create(request: Request, response: Response) {
    const customerCreateDto = plainToInstance(CustomerCreateDTO, request.body);
    const error = await validate(customerCreateDto);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const customerCreated = await this.application.create(
        customerCreateDto.descripcion,
        customerCreateDto.ruc,
        customerCreateDto.direccion,
        customerCreateDto.ubigeo,
        customerCreateDto.contacto,
        customerCreateDto.email,
        customerCreateDto.telefono,
        customerCreateDto.status,
        customerCreateDto.user,
        customerCreateDto.password,
        customerCreateDto.userCreated,
      );

      if (customerCreated.status === 201) {
        return response.status(200).json({
          status: 201,
          message: "Customer created successfully",
          data: customerCreated.data,
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

    const userStatusDTO = plainToInstance(CustomerStatusDTO, { status });
    const error = await validate(userStatusDTO);
    if (error.length > 0 || status === undefined) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const users = await this.application.findAll(status);
      if (users.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "Users retrieved successfully",
          data: users.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async findById(request: Request, response: Response) {
    const customerCodeDTO = plainToInstance(CustomerCodeDTO, request.params);
    const error = await validate(customerCodeDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const user = await this.application.findById(customerCodeDTO.code);

      if (!user) {
        return response
          .status(404)
          .json({ status: 404, message: "User not found" });
      } else {
        return response.status(200).json({
          status: 200,
          message: "User retrieved successfully",
          data: user.data,
        });
      }
    }
  }

  async findByName(request: Request, response: Response) {
    const userNameDTO = plainToInstance(CustomerNameDto, request.params);
    const error = await validate(userNameDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    }else {
      const user = await this.application.findByName(userNameDTO.name);

      if (!user) {
        return response
          .status(404)
          .json({ status: 404, message: "User not found" });
      } else {
        return response.status(200).json({
          status: 200,
          message: "User retrieved successfully",
          data: user.data,
        });
      }
    }
  }

  async findByRuc(request: Request, response: Response) {
    const userRucDTO = plainToInstance(CustomerRucDto, request.params);
    const error = await validate(userRucDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const user = await this.application.findByRuc(userRucDTO.ruc);

      if (user.status === 404) {
        return response
          .status(404)
          .json({ status: 404, success: false });
      } else {
        return response.status(200).json({
          status: 200,
          message: "User retrieved successfully",
          success: true
        });
      }
    }
  }
  async delete(request: Request, response: Response) {
    const customerCodeDTO = plainToInstance(CustomerUpdateDTO, request.body);
    const error = await validate(customerCodeDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const customerDeleted = await this.application.delete(
        customerCodeDTO.codigo,
        customerCodeDTO.userUpdated,
      );
      console.log(customerDeleted.status)
      if (customerDeleted.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "Customer deleted successfully",
          data: customerDeleted.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }

  async update(request: Request, response: Response) {
    const customerUpdateDto = plainToInstance(CustomerUpdateBodyDTO, request.body);
    const error = await validate(customerUpdateDto);

    if(error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const customerUpdated = await this.application.update(
        customerUpdateDto.codigo,
        customerUpdateDto.descripcion,
        customerUpdateDto.ruc,
        customerUpdateDto.direccion,
        customerUpdateDto.ubigeo,
        customerUpdateDto.contacto,
        customerUpdateDto.email,
        customerUpdateDto.telefono,
        customerUpdateDto.status,
        customerUpdateDto.user,
        customerUpdateDto.password,
        customerUpdateDto.userUpdated,
      );
      if (customerUpdated.status === 200) {
        return response.status(200).json({
          status: 200,
          message: "Customer updated successfully",
          data: customerUpdated.data,
        });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }
}
