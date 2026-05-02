import { Request, Response } from "express";
import { UserGatewayApplication } from "../../applications/user.application/";
import { plainToInstance } from "class-transformer";
import {
  UserCodeDTO,
  UserCreateDTO,
  UserStatusDTO,
  UserDeleteDTO,
  UserUpdateDTO,
} from "./dtos";
import { validate } from "class-validator";

export class UserGatewayController {
  constructor(private readonly application: UserGatewayApplication) {}

  async create(request: Request, response: Response) {
    const userCreateDto = plainToInstance(UserCreateDTO, request.body);
    const error = await validate(userCreateDto);
    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const userCreated = await this.application.create(
        userCreateDto.nombres,
        userCreateDto.apellidos,
        userCreateDto.email,
        userCreateDto.telefono,
        userCreateDto.status,
        userCreateDto.area,
        userCreateDto.user_name,
        userCreateDto.password,
        userCreateDto.userCreated,
      );

      if (userCreated.status === 201) {
        return response.status(200).json({
          status: 201,
          message: "User created successfully",
          data: userCreated.data,
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

    const userStatusDTO = plainToInstance(UserStatusDTO, { status });
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
    const userCodeDTO = plainToInstance(UserCodeDTO, request.params);
    const error = await validate(userCodeDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const user = await this.application.findById(userCodeDTO.code);

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

  async delete(request: Request, response: Response) {
    const userDeleteDTO = plainToInstance(UserDeleteDTO, request.body);
    const error = await validate(userDeleteDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const result = await this.application.delete(
        userDeleteDTO.code,
        userDeleteDTO.userDeleted,
      );

      if (!result) {
        return response.status(404).json({
          status: 404,
          success: false,
          message: "User not found",
        });
      } else {
        return response.status(200).json({
          status: 200,
          success: true,
          message: "User deleted successfully",
        });
      }
    }
  }

  async update(request: Request, response: Response) {
    const userUpdateDTO = plainToInstance(UserUpdateDTO, request.body);
    const error = await validate(userUpdateDTO);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const user = await this.application.update(
        userUpdateDTO.codigo,
        userUpdateDTO.nombres,
        userUpdateDTO.apellidos,
        userUpdateDTO.email,
        userUpdateDTO.telefono,
        userUpdateDTO.status,
        userUpdateDTO.area,
        userUpdateDTO.user_name,
        userUpdateDTO.password,
        userUpdateDTO.userUpdated,
      );

      if (!user) {
        return response.status(404).json({
          status: 404,
          success: false,
          message: "User not found",
        });
      } else {
        return response.status(200).json({
          status: 200,
          success: true,
          message: "User updated successfully",
          data: user.data,
        });
      }
    }
  }
}
