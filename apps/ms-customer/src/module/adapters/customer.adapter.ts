import { DataBaseBootstrapp } from "../../bootstrapp";
import { ICustomerPort } from "../ports";
import { Customer } from "../applications";
import { CustomerEntity } from "./entities";

export class CustomerAdapter implements ICustomerPort {
  async create(customer: Customer): Promise<Customer> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    const {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      activo,
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
      activo,
      userCreated,
    });

    const savedEntity = await repository.save(entity);
    return new Customer({ ...savedEntity });
  }

  async findAll(status?: boolean): Promise<Customer[]> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    const whereClause = status !== undefined ? { activo: status } : {};
    const customers = await repository.find({
      where: whereClause,
      select: {
        descripcion: true,
        codigo: true,
        ruc: true,
        direccion: true,
        ubigeo: true,
        contacto: true,
        email: true,
        telefono: true,
      },
    });
    if (!customers) return [];
    return customers.map((customer) => new Customer({ ...customer }));
  }
  async findById(code: string): Promise<Customer | null> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    const customer = await repository.findOne({
      select: {
        descripcion: true,
        codigo: true,
        ruc: true,
        direccion: true,
        ubigeo: true,
        contacto: true,
        email: true,
        telefono: true,
      },
      where: { codigo: code },
    });
    if (!customer) return null;
    return new Customer({ ...customer });
  }

  async findByName(name: string): Promise<Customer | null> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    const customer = await repository
      .createQueryBuilder("customer")
      .where("UPPER(customer.descripcion) LIKE :name", {
        name: `%${name.toUpperCase()}%`,
      })
      .getOne();
    if (!customer) return null;
    return new Customer({ ...customer });
  }
  async update(customer: Customer): Promise<Customer> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
      const {
      descripcion,
      codigo,
      ruc,
      direccion,
      ubigeo,
      contacto,
      email,
      telefono,
      activo,
      userUpdated,
    } = customer.properties;
    const result = await repository.findOne({ where: { codigo: codigo } });
    if (!result) return null;

    Object.assign(result, { ...customer.properties });
    const updatedEntity = await repository.save(result);
    return new Customer({ ...updatedEntity });
  }
  async delete(code: string, userUpdate: string): Promise<boolean> {
    const repository =
      DataBaseBootstrapp.dataSource.getRepository(CustomerEntity);
    const result = await repository.findOne({ where: { codigo: code } });
    if (!result) return false;

    const customerToUpdate = await repository.update(
      { id: result.id },
      {
        activo: false,
        userInactive: userUpdate,
        inactiveAt: new Date(),
      },
    );

    if (customerToUpdate.affected === 0) {
      return false;
    }
    return true;
  }
}
