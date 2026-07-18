import type { Request, Response } from "express";
import { GatewayApplication } from "../../applications/auth.application";
import { plainToInstance } from "class-transformer";
import { LoginDTO } from "./dtos";
import { validate } from "class-validator";

export class GatewayController {
  constructor(private readonly application: GatewayApplication) {}

  async login(request: Request, response: Response) {
    const loginDto = plainToInstance(LoginDTO, request.body);
    const error = await validate(loginDto);

    if (error.length > 0) {
      return response
        .status(400)
        .json({ status: 400, message: "Validation failed", errors: error });
    } else {
      const authLogin = await this.application.login(
        loginDto.user_name,
        loginDto.password,
      );

      if (authLogin.status === 200) {
        return response
          .status(200)
          .json({
            status: 200,
            message: "Login successful",
            token: authLogin.token,
          });
      } else {
        return response
          .status(401)
          .json({ status: 401, message: "Invalid credentials" });
      }
    }
  }
}
