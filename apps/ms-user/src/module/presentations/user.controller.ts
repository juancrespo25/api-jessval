import type { Request, Response } from "express";
import { User, UserApplication } from "../applications";
import { plainToInstance } from "class-transformer";
import {
  UserCreateDTO,
  UserCodeDTO,
  UserDeleteDTO,
  UserUpdateDTO,
  UserStatusDTO,
} from "./dto";
import { validate } from "class-validator";
import { UserService } from "./user.service";

export class UserController {
  constructor(private readonly application: UserApplication) {}

  async create(req: Request, res: Response) {
    const userDTO = plainToInstance(UserCreateDTO, req.body);
    const error = await validate(userDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const user = new User({
        ...userDTO,
        codigo: UserService.generateCode(),
        password: await UserService.crypt(req.body.password),
      });
      const userCreated = await this.application.create(user);
      return res.status(201).json({
        status: 201,
        success: true,
        message: "User created successfully",
        data: userCreated,
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const statusParam = req.query.status as string;
    const status =
      statusParam === "true"
        ? true
        : statusParam === "false"
          ? false
          : undefined;

    const userStatusDTO = plainToInstance(UserStatusDTO, { status });
    const error = await validate(userStatusDTO);

    if (error.length > 0 || status === undefined) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors:
          "Invalid status query parameter. It should be 'true' or 'false'.",
      });
    } else {
      const users = await this.application.findAll(status);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    }
  }

  async findById(req: Request, res: Response) {
    const userCodeDTO = plainToInstance(UserCodeDTO, req.params);
    console.log(userCodeDTO);
    const error = await validate(userCodeDTO);
    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const user = await this.application.findById(userCodeDTO.code);
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    }
  }

  async delete(req: Request, res: Response) {
    const userDeleteDTO = plainToInstance(UserDeleteDTO, req.body);
    const error = await validate(userDeleteDTO);
    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const result = await this.application.delete(
        userDeleteDTO.code,
        userDeleteDTO.userDelete,
      );
      if (!result) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User deleted successfully",
      });
    }
  }

  async update(req: Request, res: Response) {
    const userDTO = plainToInstance(UserUpdateDTO, req.body);
    const error = await validate(userDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const user = new User({
        ...userDTO,
        password: await UserService.crypt(userDTO.password),
      });
      const updatedUser = await this.application.update(user);

      if (!updatedUser) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    }
  }
}
