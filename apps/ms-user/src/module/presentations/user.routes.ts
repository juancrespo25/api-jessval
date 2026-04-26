import express from "express";
import { UserController } from "./user.controller";
import { UserApplication } from "../applications";
import { UserAdapter } from "../adapters";
import { IUserPort } from "../ports";

class UserRoutes {
  readonly router = express.Router();

  constructor(private readonly controller: UserController) {
    this.mountRoutes();
  }

  private mountRoutes() {
    this.router.post("/", this.controller.create.bind(this.controller));
    this.router.get('/', this.controller.findAll.bind(this.controller));
    this.router.get('/:code', this.controller.findById.bind(this.controller));
    this.router.get('/username/:user_name', this.controller.findByUsername.bind(this.controller));
    this.router.delete('/', this.controller.delete.bind(this.controller));
    this.router.patch('/', this.controller.update.bind(this.controller));
  }
}

const port: IUserPort = new UserAdapter();
const application = new UserApplication(port);
const controller = new UserController(application);
export const userRoutes = new UserRoutes(controller).router;
