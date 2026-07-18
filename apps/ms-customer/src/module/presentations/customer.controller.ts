import type { Request, Response } from "express";
import { Customer, CustomerApplication } from "../applications";
import { plainToInstance } from "class-transformer";
import {
  CustomerCreateDTO,
  CustomerCodeDTO,
  CustomerUpdateDTO,
  CustomerStatusDTO,
  CustomerUpdateBodyDTO,
  CustomerRucDto,
} from "./dto";
import { validate } from "class-validator";
import { CustomerService } from "./customer.service";
import { CustomerNameDTO } from "./dto/customer-name.dto";

export class CustomerController {
  constructor(private readonly application: CustomerApplication) {}

  async create(req: Request, res: Response) {
    const customerDTO = plainToInstance(CustomerCreateDTO, req.body);
    const error = await validate(customerDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const customer = new Customer({
        ...customerDTO,
        codigo: CustomerService.generateCode(),
        password: await CustomerService.crypt(req.body.password),
      });
      const customerCreated = await this.application.create(customer);
      return res.status(201).json({
        status: 201,
        success: true,
        message: "Customer created successfully",
        data: customerCreated,
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

    const customerStatusDTO = plainToInstance(CustomerStatusDTO, { status });

    const error = await validate(customerStatusDTO);

    if (error.length > 0 || status === undefined) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors:
          "Invalid status query parameter. It should be 'true' or 'false'.",
      });
    } else {
      const customers = await this.application.findAll(status);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Customers retrieved successfully",
        data: customers,
      });
    }
  }

  async findById(req: Request, res: Response) {
    const customerCodeDTO = plainToInstance(CustomerCodeDTO, req.params);
    const error = await validate(customerCodeDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const customer = await this.application.findById(customerCodeDTO.code);
      if (!customer) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Customer retrieved successfully",
        data: customer,
      });
    }
  }

  async findByName(req: Request, res: Response) {
    const customerNameDTO = plainToInstance(CustomerNameDTO, req.params);
    const error = await validate(customerNameDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const customer = await this.application.findByName(customerNameDTO.name);
      if (!customer) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Customer retrieved successfully",
        data: customer,
      });
    }
  }

  async findRuc(req: Request, res: Response) {
    const rucDto = plainToInstance(CustomerRucDto, req.params);
    const error = await validate(rucDto);
    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const result = await this.application.findRuc(rucDto.ruc);
      if (!result) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "RUC not found",
        });
      } else {
        return res.status(200).json({
          status: 200,
          success: true,
          message: "RUC found",
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    const customerDTO = plainToInstance(CustomerUpdateDTO, req.body);
    const error = await validate(customerDTO);

    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      const result = await this.application.delete(
        customerDTO.code,
        customerDTO.userUpdated,
      );
      if (!result) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Customer deleted successfully",
      });
    }
  }

  async update(req: Request, res: Response) {
    const customerDTO = plainToInstance(CustomerUpdateBodyDTO, req.body);
    const error = await validate(customerDTO);
    console.log(customerDTO);
    if (error.length > 0) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Validation failed",
        errors: error,
      });
    } else {
      console.log("actualizando");
      const customer = new Customer({
        ...customerDTO,
        password: await CustomerService.crypt(req.body.password),
      })
      const updateCustomer = await this.application.update(customer);
      if (!updateCustomer) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Customer not found",
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Customer updated successfully",
        data: updateCustomer,
      });
    }
  }
}
