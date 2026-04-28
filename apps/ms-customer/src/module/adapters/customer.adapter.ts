import { DataBaseBootstrapp } from "../../bootstrapp";
import { ICustomerPort } from "../ports";
import { Customer } from "../applications";
import { CustomerEntity } from "./entities";
import { Repository } from "typeorm";

export class CustomerAdapter implements ICustomerPort {

  private repository: Repository<CustomerEntity> | null = null;

  private getRepository(): Repository<CustomerEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error("Database connection not initialized");
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    }
    return this.repository;
  }
  async create(customer: Customer): Promise<Customer> {

    const {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      status,
      userCreated,
    } = customer.properties;

    const entity = new CustomerEntity();
    Object.assign(entity, {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      status,
      userCreated,
    });

    const savedEntity = await this.getRepository().save(entity);
    return new Customer({ ...customer.properties, id: savedEntity.id, createdAt: savedEntity.createdAt });
  }

  async findAll(status?: boolean): Promise<Customer[]> {

    const whereClause = status !== undefined ? { status: status } : {};
    const customers = await this.getRepository().find({
      where: whereClause,
      select: {
        id: true,
        descripcion: true,
        codigo: true,
        ruc: true,
        direccion: true,
        ubigeo: true,
        contacto: true,
        email: true,
        telefono: true,
        status: true,
        userCreated: true,
        createdAt: true,
        userUpdated: true,
      },
    });
    if (!customers) return [];
    return customers.map((customer) => new Customer({
      id: customer.id,
      descripcion: customer.descripcion,
      codigo: customer.codigo,
      ruc: customer.ruc,
      direccion: customer.direccion,
      ubigeo: customer.ubigeo,
      contacto: customer.contacto,
      email: customer.email,
      telefono: customer.telefono,
      status: customer.status,
      userCreated: customer.userCreated,
      createdAt: customer.createdAt,
      userUpdated: customer.userUpdated,
      updatedAt: customer.updatedAt,
    }));
  }
  async findById(code: string): Promise<Customer | null> {

    const customer = await this.getRepository().findOne({
      select: {
        id: true,
        descripcion: true,
        codigo: true,
        ruc: true,
        direccion: true,
        ubigeo: true,
        contacto: true,
        email: true,
        telefono: true,
        status: true,
        userCreated: true,
        createdAt: true,
        userUpdated: true,
      },
      where: { codigo: code },
    });
    if (!customer) return null;
    return new Customer({
      id: customer.id,
      descripcion: customer.descripcion,
      codigo: customer.codigo,
      ruc: customer.ruc,
      direccion: customer.direccion,
      ubigeo: customer.ubigeo,
      contacto: customer.contacto,
      email: customer.email,
      telefono: customer.telefono,
      status: customer.status,
      userCreated: customer.userCreated,
      createdAt: customer.createdAt,
      userUpdated: customer.userUpdated,
      updatedAt: customer.updatedAt,
    });
  }

  async findByName(name: string): Promise<Customer[]> {

    const customers = await this.getRepository()
      .createQueryBuilder("customer")
      .select([
        "customer.id",
        "customer.descripcion",
        "customer.codigo",
        "customer.ruc",
        "customer.direccion",
        "customer.ubigeo",
        "customer.contacto",
        "customer.email",
        "customer.telefono",
        "customer.status",
        "customer.userCreated",
        "customer.createdAt",
        "customer.userUpdated",
      ])
      .where("UPPER(customer.descripcion) LIKE :name", {
        name: `%${name.toUpperCase()}%`,
      })
      .getMany();
    if (!customers || customers.length === 0) return [];
    return customers.map((customer) => new Customer({
      id: customer.id,
      descripcion: customer.descripcion,
      codigo: customer.codigo,
      ruc: customer.ruc,
      direccion: customer.direccion,
      ubigeo: customer.ubigeo,
      contacto: customer.contacto,
      email: customer.email,
      telefono: customer.telefono,
      status: customer.status,
      userCreated: customer.userCreated,
      createdAt: customer.createdAt,
      userUpdated: customer.userUpdated,
    }));
  }
  async update(customer: Customer): Promise<Customer> {

      const {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      status,
      userUpdated,
    } = customer.properties;
    const result = await this.getRepository().findOne({ where: { codigo: codigo } });
    if (!result) return null;

    Object.assign(result, {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      status,
      userUpdated,
      updatedAt: new Date(),
    });
    const updatedEntity = await this.getRepository().update({ id: result.id }, result);
    if (updatedEntity.affected === 0) {
      return null;
    }
    return new Customer({
      id: result.id,
      descripcion: result.descripcion,
      codigo: result.codigo,
      ruc: result.ruc,
      direccion: result.direccion,
      ubigeo: result.ubigeo,
      contacto: result.contacto,
      email: result.email,
      telefono: result.telefono,
      status: result.status,
      userUpdated: result.userUpdated,
      updatedAt: result.updatedAt,
    });
  }

  async delete(code: string, userUpdate: string): Promise<boolean> {

    const result = await this.getRepository().findOne({ where: { codigo: code } });
    if (!result) return false;

    const customerToUpdate = await this.getRepository().update(
      { id: result.id },
      {
        status: false,
        userInactive: userUpdate,
        inactiveAt: new Date(),
      },
    );

    if (customerToUpdate.affected === 0) return false;

    return true;
  }
}
